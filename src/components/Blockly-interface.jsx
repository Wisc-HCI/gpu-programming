import React, { useEffect, useState } from "react";
import * as Blockly from "blockly";
import { appendActivity } from "./ActivityTracker";

// Import custom blocks and generators
import { forBlock } from "../generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "../serialization";
import { toolbox } from "../toolbox";
import "../index.css";
import useStore from "../Store";

import blockColors from "../blockPallete.json";
import ProgramLogos from "./ProgramLogos.jsx";
import useWindowDimensions from "../useWindowDimensions.jsx";
import GPTConsole from "./GPTConsole.jsx";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

export default function BlocklyInterface(props) {
  const addBlock = useStore((state) => state.addBlock);
  const blocks = useStore((state) => state.blocks);
  const removeBlock = useStore((state) => state.removeBlock);
  const getBlock = useStore((state) => state.getBlock);
  const updateBlock = useStore((state) => state.updateBlock);
  const getBlockType = useStore((state) => state.getBlockType);
  const setBlocklyWorkspace = useStore((state) => state.setBlocklyWorkspace);
  const getBlocklyWorkspace = useStore((state) => state.getBlocklyWorkspace);
  const loadBlocks = useStore((state) => state.loadBlocks);
  const blocklyWorkspace = useStore((state) => state.blocklyWorkspace);
  const highlightBlocks = useStore((state) => state.highlightBlocks);
  const setShowGPTConsole = useStore((state) => state.setShowGPTConsole);
  const showGPTConsole = useStore((state) => state.showGPTConsole);
  const fullScreenPanel = useStore((state) => state.fullScreenPanel);
  const ip = useStore((state) => state.ip);
  const setFullScreenPanel = useStore((state) => state.setFullScreenPanel);

  const { height, _ } = useWindowDimensions();

  const findNext = (arr, blockId) => {
    arr.push(blockId);
    let currBlock = getBlock(blockId);
    while (currBlock && currBlock.next) {
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

  const toggleGPTConsole = () => {
    // setShowGPTConsole(!showGPTConsole);
    setFullScreenPanel(true);
    
  };

  // Register the blocks and generator with Blockly
  Blockly.common.defineBlocks(blocks);
  Object.assign(javascriptGenerator.forBlock, forBlock);

  useEffect(() => {
    let ws = null;
    if (!document.querySelector(".blocklySvg")) {
      const blocklyArea = document.getElementById("pageContainer");
      const blocklyDiv = document.getElementById("blocklyDiv");
      let startId = "";

      ws = Blockly.inject(blocklyDiv, {
        toolbox: toolbox,
        grid: {
          spacing: 20,
          length: 3,
          colour: "#ccc",
          snap: true,
        },
        theme: Blockly.Theme.defineTheme("gpuTheme", {
          componentStyles: {
            toolboxBackgroundColour: "#E4E5F1",
            flyoutBackgroundColour: "#d2d3db",
          },
          categoryStyles: { ...blockColors },
          blockStyles: {
            logic_blocks: {
              colourPrimary: blockColors["logic_category"]["colour"],
            },
            loop_blocks: {
              colourPrimary: blockColors["loop_category"]["colour"],
            },
            math_blocks: {
              colourPrimary: blockColors["math_category"]["colour"],
            },
            procedure_blocks: {
              colourPrimary: blockColors["procedure_category"]["colour"],
            },
            text_blocks: {
              colourPrimary: blockColors["speech_category"]["colour"],
            },
            colour_blocks: {
              colourPrimary: blockColors["light_category"]["colour"],
            },
            hat_blocks: {
              hat: "cap",
            },
          },
        }),
      });

      if (!blocklyWorkspace) {
        const existingStartBlocks = ws
          .getAllBlocks()
          .filter((block) => block.type === "Start");
        if (existingStartBlocks.length === 0) {
          const initialBlock = ws.newBlock("Start");
          initialBlock.setDeletable(false);
          initialBlock.moveBy(50, 50);
          initialBlock.initSvg();
          initialBlock.render();
        }
      }

      if (blocklyWorkspace) {
        let data = { data: [] };
        let blockKeys = Object.keys(blocks);
        let numBlocks = blockKeys.length;
        for (let i = 0; i < numBlocks; i++) {
          let blockData = {
            id: blocks[blockKeys[i]].id,
            type: blocks[blockKeys[i]].type,
          };
          if (blocks[blockKeys[i]].next && blocks[blockKeys[i]].next !== "") {
            blockData["nextStatement"] = blocks[blockKeys[i]].next;
          }

          let fieldKeys = blocks[blockKeys[i]]?.inputs
            ? Object.keys(blocks[blockKeys[i]]?.inputs)
            : [];
          for (let j = 0; j < fieldKeys.length; j++) {
            blockData[fieldKeys[j]] = blocks[blockKeys[i]]["inputs"][
              fieldKeys[j]
            ]?.["shadow"]
              ? blocks[blockKeys[i]]["inputs"][fieldKeys[j]]["shadow"].id
              : blocks[blockKeys[i]]["inputs"][fieldKeys[j]];
          }

          // Will need to do this for each input type (colors, numbers)
          if (blockData.type === "math_number") {
            blockData["value"] = blocks[blockKeys[i]].fields.NUM;
          }
          if (blockData.type === "colour_picker") {
            blockData["value"] = blocks[blockKeys[i]].fields.COLOUR;
          }
          if (blockData.type === "text") {
            blockData["value"] = blocks[blockKeys[i]].fields.TEXT;
          }
          if (
            [
              "BasicSlider",
              "ArmPositionSlider",
              "SpeedSlider",
              "TimeSlider",
              "HeadPitchSlider",
              "HeadRollSlider",
              "HeadYawSlider",
            ].includes(blockData.type)
          ) {
            blockData["value"] =
              blocks[blockKeys[i]].fields["FIELD_slider_value"];
          }
          data["data"].push({ ...blockData });
        }
        loadBlocks(data, ws);
      }
      setBlocklyWorkspace(ws);

      javascriptGenerator.addReservedWords("code");

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
          Blockly.svgResize(ws);
          ws.scrollbar.setVisible(false);
        }
      });
      observer.observe(blocklyArea);

      ws.render();
      setBlocklyWorkspace(ws)

      // Every time the workspace changes state, save the changes to storage.
      ws.addChangeListener((e) => {
        // UI events are things like scrolling, zooming, etc.
        // No need to save after one of these.
        if (e.isUiEvent) {
          // record user activity
          if (e.type === "toolbox_item_select") {
            handleSelectToolbox(e.newItem, e.oldItem);
          } else if (e.type === "click") {
            if (e.targetType === "block") {
              const blockType = getBlockType(e.blockId);
              appendActivity(`click on ${blockType} block`);
            }
            if (e.targetType === "workspace") {
              appendActivity(`click on workspace`);
            }
          } else if (e.type === "selected") {
            if (e.oldElementId) {
              const blockType = getBlockType(e.oldElementId);
              appendActivity(`unselect and un-highlight ${blockType} `);
            }
            if (e.newElementId) {
              const blockType = getBlockType(e.newElementId);
              appendActivity(`select and highlight ${blockType} `);
            }
          } else if (e.type === "drag") {
            const blockType = getBlockType(e.blockId);
            if (e.isStart) {
              appendActivity(`drag block ${blockType} start `);
            } else {
              appendActivity(`drag block ${blockType} end `);
            }
          }
          return;
        }

        // Block has been deleted, remove it from store, as well as anything connect to it
        if (e.type === Blockly.Events.BLOCK_DELETE) {
          let currID = e.blockId;
          removeBlock(currID);

          appendActivity(
            `block ${currID} and children are deleted`
          );
        }

        if (e.type === Blockly.Events.BLOCK_CHANGE) {
          const blockType = getBlockType(e.blockId);
          let id = e.blockId;
          let params = getBlock(id);
          params["fields"][e.name] = e.newValue;
          updateBlock(id, params);
          appendActivity(
            `field ${e.name} of ${blockType} change from ${e.oldValue} to ${e.newValue} `
          );
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
            //ws.highlightBlock(startId)
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
          if (
            moveReason &&
            ((typeof moveReason !== "string" && moveReason[1] === "drag") ||
              moveReason[0] === "drag")
          ) {
            //identify drag event
            if (!e.newCoordinate) {
              // it means dragged as input of other blocks, handles elsewhere
            } else {
              appendActivity(
                `drag ${blockType} from coordinate: {x: ${e.oldCoordinate.x}, y: ${e.oldCoordinate.y}} to {x: ${e.newCoordinate.x},y: ${e.newCoordinate.y}}`
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

  useEffect(() => {
    console.log(highlightBlocks); 
    let ws = getBlocklyWorkspace()
    if (ws && highlightBlocks) {
       highlightBlockCustom(ws, highlightBlocks, '#FF0000');
    } else {
        console.log('Workspace or block ID not defined.');
    }
  }, [highlightBlocks]); 

  
function highlightBlockCustom(workspace, blockId, newColor, duration = 300, blinks = 5) {
  var block = workspace.getBlockById(blockId);
  if (block) {
      var svgRoot = block.getSvgRoot();

      if (svgRoot) {
          var paths = svgRoot.querySelectorAll('.blocklyPath');
          if (paths.length > 0) {
              // Store the original color from the first path element
              let originalColor = paths[0].style.fill;
              
              let blinkCount = 0;
              let isOriginalColor = false;
              
              // Function to toggle colors
              const toggleColor = () => {
                  paths.forEach(function(path) {
                      path.style.fill = isOriginalColor ? newColor : originalColor;
                  });
                  isOriginalColor = !isOriginalColor;
                  
                  if (blinkCount++ < blinks * 2) {
                      setTimeout(toggleColor, duration);
                  } else {
                      // Ensure ending with the original color
                      paths.forEach(function(path) {
                          path.style.fill = originalColor;
                      });
                  }
              };

              // Start the blinking effect
              toggleColor();
          }
      }
  }
}


function resetHighlightBlock(workspace, blockId) {
    var block = workspace.getBlockById(blockId);
    if (block) {
        var svgRoot = block.getSvgRoot();
        if (svgRoot) {
            svgRoot.style.stroke = ''; // Reset the stroke
        }
    }
}
  return (
    <div style={{ width: "100%", height: "100%" }}>
      {/* if the GPT panel is full Screen, the Logos should not be rendered */}
      {height >= 460 && !fullScreenPanel && <ProgramLogos />}
      <div id="pageContainer" style={{ width: "100%", height: "100%" }}>
        <div
          id="blocklyDiv"
          style={{
            width: "100%",
            height: "100%",
          }}
        ></div>
        <xml id="toolbox" style={{ display: "none" }}></xml>
      </div>
    </div>
  );
}
