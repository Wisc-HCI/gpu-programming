import React, { useEffect } from 'react';
import * as Blockly from 'blockly';
import {Scene} from 'robot-scene'
import './App.css'; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';
// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {
  useEffect(() =>{
    if (!document.querySelector('.blocklySvg')) { 
  const ws = Blockly.inject('blocklyDiv', { toolbox:toolbox});

  javascriptGenerator.addReservedWords('code');
  const runCode = () => {
    const code = javascriptGenerator.workspaceToCode(ws);
    eval(code);
  }
  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
})}},[])



  return (
    <div>
    <div id="pageContainer">
      <div id="blocklyDiv" style={{ height: '480px', width: '800px' }}></div>
      <xml id="toolbox" style={{ display: 'none' }}>
        {/* Toolbox XML goes here */}
      </xml>
      {/* <div id="outputPane">
        <pre id="generatedCode"><code></code></pre>
      </div> */}
    </div>
    <Scene/>
    </div>
  );
}

export default App;
