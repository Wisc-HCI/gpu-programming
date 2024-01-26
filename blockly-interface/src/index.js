/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/text';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);


// Set up UI elements and inject Blockly
let ip = '';
const ipInputfrom = document.getElementById('robotIpAddress');
const confirmButton = document.getElementById('confirmButton');
const ipDisplay = document.getElementById('ipDisplay');
ipDisplay.textContent = `IP: ---.---.---`;
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');
const ws = Blockly.inject(blocklyDiv, {toolbox});

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
javascriptGenerator.addReservedWords('code');
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(ws);
  codeDiv.innerText = code;

  outputDiv.innerHTML = '';
  
  eval(code);
};

Blockly.Blocks['Start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField('Program starts here');
    this.setColour(345);
    this.setTooltip('This is the starting block');
    this.setNextStatement(true, null);
    this.setHelpUrl('');
  }
};



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('robotSceneContainer')
);


//add click event listener to run button
document.getElementById('runButton').addEventListener('click', runCode);
// Load the initial state from storage and run the code.
const initialBlock = ws.newBlock('Start');
initialBlock.moveBy(50, 50);
save(ws);
load(ws);
runCode();

//add change listener to the ip input form
confirmButton.addEventListener('click', function() {
  ip = ipInputfrom.value;
  ipDisplay.textContent = `IP: ${ip}`;
});

function sendPostRequestToRobot(endpoint,payload) {
  fetch(`http://${ip}/api/${endpoint}`, {
    method: 'POST',
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(payload)
    }).then(res => res.json()).then(json => {
          
      console.log(`successfully send a post request, the response is: ${json}`)
    })

        
}

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
  // UI events are things like scrolling, zooming, etc.
  // No need to save after one of these.
  if (e.isUiEvent) return;
  save(ws);
});


// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
  // Don't run the code when the workspace finishes loading; we're
  // already running it once when the application starts.
  // Don't run the code during drags; we might have invalid state.
  if (e.isUiEvent || e.type == Blockly.Events.FINISHED_LOADING ||
    ws.isDragging()) {
    return;
  }
  //runCode();
});
