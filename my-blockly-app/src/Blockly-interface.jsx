import React, { useEffect } from 'react';
import * as Blockly from 'blockly';

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';



export default function BlocklyInterface(props){
    // Register the blocks and generator with Blockly
    Blockly.common.defineBlocks(blocks);
    Object.assign(javascriptGenerator.forBlock, forBlock);
    useEffect(() =>{
        if (!document.querySelector('.blocklySvg')) { 
        const ws = Blockly.inject('blocklyDiv', { toolbox:toolbox});

        javascriptGenerator.addReservedWords('code');
        const runCode = () => {
            console.log("runcode clicked")
            const code = javascriptGenerator.workspaceToCode(ws);
            eval(code);
        }
        //add click event listener to run button
        document.getElementById('runButton').addEventListener('click', runCode);
        // Every time the workspace changes state, save the changes to storage.
        ws.addChangeListener((e) => {
            // UI events are things like scrolling, zooming, etc.
            // No need to save after one of these.
            if (e.isUiEvent) return;
            save(ws);
        }
    )}},[])
    
    return <div id="pageContainer">
    <div id="blocklyDiv" style={{ height: '480px', width: '800px' }}></div>
    <xml id="toolbox" style={{ display: 'none' }}>
      {/* Toolbox XML goes here */}
    </xml>
    {/* <div id="outputPane">
      <pre id="generatedCode"><code></code></pre>
    </div> */}
  </div>
}