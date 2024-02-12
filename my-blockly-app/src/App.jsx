import React, { useEffect } from 'react';
import * as Blockly from 'blockly';
import {Scene} from 'robot-scene';
import './App.css'; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import './index.css';
import TopBar from './Topbar';
import BlocklyInterface from './Blockly-interface';

import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

const Item = styled('div')(({ theme }) => ({
  // backgroundColor: theme.palette.mode === 'dark' ? '#262B32' : '#fff',
  // padding: theme.spacing(1),
  textAlign: 'center',
}));


// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {
  return (
    <div>
      <TopBar/>
      <Grid display="flex" container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={9}>
          <Item style={{width: "100%"}}>
            <BlocklyInterface/>
          </Item>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={3}>
          <Item>
            <Scene/>
          </Item>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
