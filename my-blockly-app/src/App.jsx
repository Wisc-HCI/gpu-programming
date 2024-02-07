import React, { useEffect } from 'react';
import * as Blockly from 'blockly';
import {Scene} from 'robot-scene'
import './App.css'; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import './index.css';
import TopBar from './Topbar';
import BlocklyInterface from './Blockly-interface';
// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {
  return (
    <div>
      <TopBar/>
    <BlocklyInterface/>
    <Scene/>
    </div>
  );
}

export default App;
