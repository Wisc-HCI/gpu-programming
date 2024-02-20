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
            console.log(e)
            let params ={id: e.json.id, type: e.json.type}
 
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
            if (!blockId) {
              // Block has been deleted, remove it from store
 
              removeBlock(e.blockId);
            } else {
              // If block is moved but still in the workspace
              // updateBlockPosition(e.blockId, {newPosition}); // Implement this as needed
            }
            //console.log(e)
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