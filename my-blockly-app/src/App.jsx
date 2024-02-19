import React, { useEffect } from 'react';
import * as Blockly from 'blockly';
import {Scene} from 'robot-scene';
import './App.css'; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import './index.css';
import TopBar from './components/Topbar';
import BlocklyInterface from './components/Blockly-interface';

import { styled } from '@mui/material/styles';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Box, Stack } from '@mui/material';

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
      <Box display="flex" minHeight="90vh">
        <Grid display="flex" container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={9}>
            <Item style={{width: "100%", height:"100%", paddingLeft: "2px"}}>
              <BlocklyInterface/>
            </Item>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={3}>
            <Stack>
              <Item style={{height:"30%"}}>
                <Scene/>
              </Item>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
