import React, { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { appendActivity } from "./ActivityTracker";

// Import custom blocks and generators
import { forBlock } from "../generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "../serialization";
import { toolbox } from "../toolbox";
import "../index.css";
import useStore from "../Store";

import blockColors from '../blockPallete.json';

Blockly.Blocks["Start"] = {
  init: function () {
    this.setStyle('hat_blocks')
    this.appendDummyInput().appendField("Program starts here");
    this.setColour(blockColors["procedure_category"]["colour"]);
    this.setTooltip("This is the starting block");
    this.setNextStatement(true, null);
    this.setHelpUrl("");
    this.setDeletable(false);
  },
};

export default function BlocklyInterface(props) {
  const addBlock = useStore((state) => state.addBlock);
  const blocks = useStore((state) => state.blocks);
  const removeBlock = useStore((state) => state.removeBlock);
  const getBlock = useStore((state) => state.getBlock);
  const updateBlock = useStore((state) => state.updateBlock);
  const getBlockType = useStore((state) => state.getBlockType);
  const setWorkspaceXml = useStore((state) => state.setWorkspaceXml);
  const workspaceRef = useRef(null);
  const ip = useStore((state) => state.ip);
  const findNext = (arr, blockId) => {
    arr.push(blockId);
    let currBlock = getBlock(blockId);
    while (currBlock.next) {
      currBlock = currBlock.next;
      arr.push(currBlock);
    }
  };

  const handleSelectToolbox = (newItem, oldItem) => {
    if (!oldItem) {
      appendActivity(`select toolbox category: ${newItem}`);
    } else if (!newItem) {
      appendActivity(`unselect toolbox category: ${oldItem}`);
    } else {
      appendActivity(`switch toolbox category from ${oldItem} to ${newItem}`);
    }
  };

  
  const uploadBlocks = (event) => {
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const text = fileReader.result;
        if (workspaceRef.current) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(text, "text/xml");
                Blockly.Xml.domToWorkspace(doc.firstChild, workspaceRef.current);
            } catch (error) {
                console.error("Error parsing XML:", error);
            }
        } else {
            console.error("Blockly workspace not initialized");
        }
    };
    fileReader.readAsText(event.target.files[0]);
  };


  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);
  Object.assign(javascriptGenerator.forBlock, forBlock);

  useEffect(() => {

    if (!document.querySelector(".blocklySvg")) {
      const blocklyArea = document.getElementById("pageContainer");
      const blocklyDiv = document.getElementById("blocklyDiv");
      if (!blocklyArea || !blocklyDiv) {
        return; // Exit if blocklyDiv or blocklyArea isn't rendered yet
      }
      let startId = "";

      if (!workspaceRef.current) {

        // Blockly.Blocks.variables.HUE = 330; 
        workspaceRef.current = Blockly.inject(blocklyDiv, {
          toolbox:toolbox, 
          grid:
          {
            spacing: 20,
            length: 3,
          colour: '#ccc',
          snap: true
          },
          theme: Blockly.Theme.defineTheme('gpuTheme', {
            "componentStyles": {
              "toolboxBackgroundColour": "#E4E5F1",
              "flyoutBackgroundColour": "#d2d3db"
            },
            'categoryStyles': {...blockColors},
            "blockStyles": {
              'logic_blocks': {
                'colourPrimary': blockColors["logic_category"]["colour"]
              },
              'loop_blocks': {
                "colourPrimary": blockColors["loop_category"]["colour"]
              },
              'math_blocks': {
                'colourPrimary': blockColors["math_category"]["colour"]
              },
              'procedure_blocks': {
                "colourPrimary": blockColors["procedure_category"]["colour"]
              },
              'text_blocks': {
                'colourPrimary': blockColors["speech_category"]["colour"]
              },
              'colour_blocks': {
                'colourPrimary': blockColors["light_category"]["colour"]
              },
              'hat_blocks': {
                'hat': 'cap',
              }
            }
          })
        })
      };

      
      const initialBlock = workspaceRef.current.newBlock("Start");
      initialBlock.moveBy(50, 50);
    initialBlock.setDeletable(false);
    initialBlock.moveBy(50, 50);
    initialBlock.initSvg();
    initialBlock.render();
      javascriptGenerator.addReservedWords("code");


      //add click event listener to run button
      // document.getElementById('runButton').addEventListener('click', runCode);

      // Observe the pageContainer for resizing
      const observer = new ResizeObserver((entries) => {
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
          blocklyDiv.style.left = x + "px";
          blocklyDiv.style.top = y + "px";
          blocklyDiv.style.width = blocklyArea.offsetWidth + "px";
          blocklyDiv.style.height = blocklyArea.offsetHeight + "px";
          Blockly.svgResize(workspaceRef.current);
        }
      });
      observer.observe(blocklyArea);

      
      // Every time the workspace changes state, save the changes to storage.
      workspaceRef.current.addChangeListener((e) => {

      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      setWorkspaceXml(xml)
        // UI events are things like scrolling, zooming, etc.
        // No need to save after one of these.
        console.log(e);
        if (e.isUiEvent) {
          // record user activity
          if (e.type === "toolbox_item_select") {
            handleSelectToolbox(e.newItem, e.oldItem);
          }
          else if (e.type === "click") {
            if(e.targetType === "block"){
              const blockType = getBlockType(e.blockId)
              appendActivity(`click on ${blockType} block`)
            }
            if(e.targetType === "workspace"){
              appendActivity(`click on workspace`)
            }
          }
          else if (e.type === "selected"){
            if(e.oldElementId){
              const blockType = getBlockType(e.oldElementId)
              appendActivity(`unselect and un-highlight ${blockType} `)
            }
            if(e.newElementId){
              const blockType = getBlockType(e.newElementId)
              appendActivity(`select and highlight ${blockType} `)
            }
           
          }
          else if(e.type === "drag"){
            const blockType = getBlockType(e.blockId)
            if(e.isStart){
              appendActivity(`drag block ${blockType} start `)
            }else{
              appendActivity(`drag block ${blockType} end `)
            }
          }
          return;
        }

      

        // Block has been deleted, remove it from store, as well as anything connect to it
        if (e.type === Blockly.Events.BLOCK_DELETE) {
          let currID = e.blockId;
          let delArray = [currID];
          let currInputs = getBlock(currID).inputs;
          if (currInputs) {
            // eslint-disable-next-line no-unused-vars
            for (let [key, value] of Object.entries(currInputs)) {
              // check for shadows
              if (typeof value !== "string") {
                delArray.push(value.id);
              } else {
                findNext(delArray, value);
              }
            }
          }
          let currNext = getBlock(e.blockId).next;
          if (currNext) {
            findNext(delArray, currNext);
          }

          const delBlockTypes = delArray.map(id => getBlockType(id));
          removeBlock(delArray);

          appendActivity(`block ${currID} is deleted, total delete blocks: ${delBlockTypes}`)
        }

        if (e.type === Blockly.Events.BLOCK_CHANGE) {
          const blockType = getBlockType(e.blockId)
          let id = e.blockId;
          let params = getBlock(id);
          params["fields"][e.name] = e.newValue;
          updateBlock(id, params);
          appendActivity(`field ${e.name} of ${blockType} change from ${e.oldValue} to ${e.newValue} `)
        }

        //check for create blocks
        if (e.type === "create") {
          //create block in store

          let params = {
            id: e.json.id,
            type: e.json.type,
            prev: "",
            next: "",
            isShadow: false,
          };
          //fields, id, type would be the three params for shadow block

          if (e.json.type === "Start") {
            startId = e.json.id;
            params = { id: e.json.id, type: e.json.type, next: "" };
          }

          //check if the blocks have field
          if (e.json.fields) {
            params["fields"] = e.json.fields;
          }
          // check for inputs
          if (e.json.inputs) {
            params["inputs"] = e.json.inputs;

            //shadow blocks should be created
            for (let [key, value] of Object.entries(e.json.inputs)) {
              if (value.shadow) {
                let shadowParams = {
                  id: value.shadow.id,
                  type: value.shadow.type,
                  fields: value.shadow.fields,
                  isShadow: true,
                  initialParent: e.ids[0],
                  initialInput: key,
                };
                if (!("shadows" in params)) {
                  params.shadows = {};
                  params.shadows[key] = value.shadow.id;
                } else {
                  params.shadows[key] = value.shadow.id;
                }
                addBlock(value.shadow.id, shadowParams);
                appendActivity(
                  `create a instance of type ${shadowParams.type}`
                );
              }
            }
          }
          addBlock(e.json.id, params);
          appendActivity(`create a instance of type ${params.type}`);
        }

        //check for move blocks
        if (e.type === "move") {
          // If block is moved but still in the workspace
          const blockType = getBlockType(e.blockId);
          const moveReason = e.reason;
          if (moveReason && (typeof moveReason !== "string" && moveReason[1] === "drag" || moveReason[0] === "drag")) {
            //identify drag event
            if(!e.newCoordinate){
              // it means dragged as input of other blocks, handles elsewhere
            }
            else{
              appendActivity(`drag ${blockType} from coordinate: {x: ${e.oldCoordinate.x}, y: ${e.oldCoordinate.y}} to {x: ${e.newCoordinate.x},y: ${e.newCoordinate.y}}`
              );
            }
          }

          //if it is connected as input for other block
          if (e.reason && e.reason.includes("connect")) {
            let id = e.newParentId;
            let params = getBlock(e.newParentId);
            const prevBlockType = params.type;
            const currParams = getBlock(e.blockId);
            
            // case 1: if newInputName is undefined, then it is sequencial relationship
            // newParenName exist, newInputname don't, handle the case that it is connect to parent
            if (!e.newInputName) {
              params["next"] = e.blockId;
              updateBlock(id, params);
              currParams["prev"] = id;
              updateBlock(e.blockId, currParams);
              appendActivity(
                `Placed ${currParams.type} after ${prevBlockType}`
              );
            }

            // case2: new input, newInputname and newParenName both exist
            else {
              if (!("inputs" in params)) {
                params.inputs = {};
                params.inputs[e.newInputName] = e.blockId;
              } else {
                params.inputs[e.newInputName] = e.blockId;
              }

              updateBlock(id, params);
              appendActivity(
                `connect ${currParams.type}  as input of ${prevBlockType}`
              );
            }
          }

          //disconnect
          if (e.reason && e.reason.includes("disconnect")) {
            let id = e.oldParentId;
            let params = getBlock(e.oldParentId);
            const nextBlockType = params.type;
            const currParams = getBlock(e.blockId);

            if (!e.oldInputName) {
              params["next"] = "";
              updateBlock(id, params);
              currParams["prev"] = "";
              updateBlock(e.blockId, currParams);
              appendActivity(`disconnect ${nextBlockType} from ${params.type}`);
            } else {
              // there is an old input name
              params.inputs[e.oldInputName] = "";
              //check if it is shadow block, if yes,
              if (params.shadows && params.shadows[e.oldInputName]) {
                let shadowId = params.shadows[e.oldInputName];
                params.inputs[e.oldInputName] = shadowId;
              }
              updateBlock(id, params);
              appendActivity(
                `remove ${nextBlockType} from input of ${params.type}`
              );
            }

            //TODO: when a block is removed, check if there is a shadow block which has corresponding inputname and parent id
            //if yes, resore refrence to shadow box
          }
        }
      });
    }
  
  
  }, []);

  


  return (
    <div>
      <input type="file" onChange={uploadBlocks} accept=".xml" />
    <div id="pageContainer" style={{ width: "100%", height: "100%" }}>
      <div
        id="blocklyDiv"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "480px",
          minWidth: "480px",
        }}
      ></div>
      <xml id="toolbox" style={{ display: "none" }}>
        {/* Toolbox XML goes here */}
      </xml>
      
      {/* <div id="outputPane">
<pre id="generatedCode"><code></code></pre>
</div> */}
  </div>
  
  </div>
  
  );
}
