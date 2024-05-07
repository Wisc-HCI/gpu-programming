import React from 'react';
import * as Blockly from 'blockly';
import './App.css'; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from './blocks/text';
import { forBlock } from './generators/javascript';
import { javascriptGenerator } from 'blockly/javascript';
import './index.css';
import TopBar from './components/Topbar';
import BlocklyInterface from './components/Blockly-interface';
import urdf from "./Misty-Robot/misty.xacro?raw";
import TrackerScreen from './tracker_components/TrackerScreen.jsx';

import { styled } from '@mui/material/styles';

import {
  ReflexContainer,
  ReflexSplitter,
  ReflexElement
} from 'react-reflex';

import 'react-reflex/styles.css';
import { Box } from '@mui/material';
import Simulator from './components/Simulator.jsx';
import ProgramLogos from './components/ProgramLogos.jsx';

const Item = styled('div')(({ theme }) => ({
  textAlign: 'center',
  height: "100%"
}));

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {

  return (
    <Box height={"94vh"} padding={0}>
      <TopBar/>
      <ProgramLogos />
      <ReflexContainer orientation='vertical' 
          style={{
            // backgroundColor: "red",
            height: "100%",
            width: "100vw",
            // position: "fixed",
          }}>
        
        <ReflexElement flex={0.55}>
          <Item style={{width: "100%", height:"100%", paddingLeft: "2px"}}>
            <BlocklyInterface/>
          </Item>
        </ReflexElement>
        
        <ReflexSplitter propagate={true} />
        
        <ReflexElement flex={0.45}>
          <ReflexContainer orientation='horizontal'>
            <ReflexElement>
              <Item>
                <Simulator />
              </Item>
            </ReflexElement>
            
            <ReflexSplitter propagate={true} />
            
            <ReflexElement>
              <Item>
                <TrackerScreen/>
              </Item>
            </ReflexElement>
          
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
    </Box>
  );
}

export default App;
