import React, { useEffect } from 'react';
import * as Blockly from 'blockly';
 
// Import custom blocks and generators
import { blocks } from '../blocks/text';
import { forBlock } from '../generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import {save, load} from '../serialization';
import {toolbox} from '../toolbox';
import '../index.css';
import useStore from "../Store";
 
Blockly.Blocks['Start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Program starts here');
    this.setColour(345);
    this.setTooltip('This is the starting block');
    this.setNextStatement(true, null);
    this.setHelpUrl('');
    this.setDeletable(false);
  }
};
 
export default function BlocklyInterface(props) {
  const addBlock = useStore((state) => state.addBlock);
  const blocks = useStore((state) => state.blocks);
  const removeBlock = useStore((state) => state.removeBlock);
  const getBlock = useStore((state) => state.getBlock);
  const updateBlock = useStore((state) => state.updateBlock);
  const getBlocksByType = useStore((state) => state.getBlocksByType);

 
  useEffect(() => {
    console.log(blocks);
  }, [blocks]);
 
  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);
  Object.assign(javascriptGenerator.forBlock, forBlock);
 
  
  useEffect(() =>{
      if (!document.querySelector('.blocklySvg')) { 
        var blocklyArea = document.getElementById("pageContainer");
        var blocklyDiv = document.getElementById("blocklyDiv");
        let startId =''
        let CHILDREN = []
 
        const ws = Blockly.inject(blocklyDiv, { toolbox:toolbox});
        const initialBlock = ws.newBlock('Start');
        initialBlock.moveBy(50, 50);
        save(ws);
        load(ws);
        javascriptGenerator.addReservedWords('code');
        const runCode = () => {
            console.log("runcode clicked")
 
            const code = javascriptGenerator.workspaceToCode(ws);
            //console.log(code)
            eval(code);
        }
 
        //add click event listener to run button
        document.getElementById('runButton').addEventListener('click', runCode);
 
        // Observe the pageContainer for resizing
        const observer = new ResizeObserver(entries => {
          for (let entry of entries) {
          // Compute the absolute coordinates and dimensions of blocklyArea.
          let element = blocklyArea;
          let x = 0;
          let y = 0;
          do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = element.offsetParent;
          } while (element);
          // Position blocklyDiv over blocklyArea.
          blocklyDiv.style.left = x + 'px';
          blocklyDiv.style.top = y + 'px';
          blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
          blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
          Blockly.svgResize(ws);
          }
        });
        observer.observe(blocklyArea);
      
        

        // Every time the workspace changes state, save the changes to storage.
        ws.addChangeListener((e) => {
          // UI events are things like scrolling, zooming, etc.
          // No need to save after one of these.
          console.log(e)
          if (e.isUiEvent) return;

          // Block has been deleted, remove it from store
          if(e.type === Blockly.Events.BLOCK_DELETE){

            removeBlock(e.blockId);
            //TODO: also rmove anything that is connect to it
          }
 
          if(e.type === Blockly.Events.BLOCK_CHANGE){
            //console.log(e)
            let id = e.blockId
            let params = getBlock(id)
            params['fields'][e.name] = e.newValue;
            updateBlock(id, params)
          }
          
          //check for create blocks
          if (e.type === "create") {
            
            //create block in store
            
            let params ={id: e.json.id, type: e.json.type, prev:'', next:'', isShadow: false}
            //fields, id, type would be the three params for shadow block

            if (e.ids.length > 1){
              //shadow blocks should be created
              for (let input of Object.values(e.json.inputs)) {
                let params ={id: input.shadow.id, type: input.shadow.type, fields: input.shadow.fields, isShadow: true}
                addBlock(input.shadow.id,params)
              }

            }
            if (e.json.type ==="Start"){
              startId = e.json.id
              params ={id: e.json.id, type: e.json.type, next:''}
            }
 
            //check if the blocks have field
            if(e.json.fields){
              params['fields'] = e.json.fields;
            }
            // check for inputs
            if(e.json.inputs){
              params['inputs'] = e.json.inputs;
            }
            addBlock(e.json.id,params)
          }
 
          //check for move blocks
          if (e.type === "move") {
            let blockId = ws.getBlockById(e.blockId);    
            // If block is moved but still in the workspace
            
            //if it is connected as input for other block
            if (e.reason && e.reason.includes('connect')){
              let id = e.newParentId
              let params = getBlock(e.newParentId)

              // case 1: if newInputName is undefined, then it is sequencial relationship
              // newParenName exist, newInputname don't, handle the case that it is connect to parent
              if(!e.newInputName){
                params['next'] = e.blockId
                updateBlock(id, params)
                params = getBlock(e.blockId)
                params['prev'] = id
                updateBlock(e.blockId, params)
                
                
              }

              // case2: new input is the children, newInputname and newParenName both exist
              else{
                if (!('inputs' in params)) {
                  params.inputs={};
                  params.inputs[e.newInputName]= e.blockId
                }else{
                  params.inputs[e.newInputName]= e.blockId
                }
                
                updateBlock(id, params)
              }
            }


            //disconnect
            if (e.reason && e.reason.includes('disconnect')){
              let id = e.oldParentId
              let params = getBlock(e.oldParentId)
              
              if(!e.oldInputName){
                params['next'] = ''
                updateBlock(id, params)
                params = getBlock(e.blockId)
                params['prev'] = ''
                updateBlock(e.blockId, params)
                
              }

            //TODO: when a block is removed, check if there is a shadow block which has corresponding inputname and parent id
            //if yes, resore refrence to shadow box
            }
            
            
          }
          save(ws);
        })
      }
    },[])

    

    return <div id="pageContainer" style={{width: "100%", height: "100%"}}>
<div id="blocklyDiv" style={{width: "100%", height: "100%", minHeight: "480px", minWidth: "480px"}}></div>
<xml id="toolbox" style={{ display: 'none' }}>
      {/* Toolbox XML goes here */}
</xml>
    {/* <div id="outputPane">
<pre id="generatedCode"><code></code></pre>
</div> */}
</div>
}