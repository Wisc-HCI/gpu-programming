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
import { SettingsModal } from './components/Settings.jsx';
import useStore from './Store.js';
import { useShallow } from 'zustand/react/shallow';
import GPTPanel from './components/GPTPanel.jsx';

const Item = styled('div')(({ theme }) => ({
  textAlign: 'center',
  height: "100%"
}));

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {
  const llmMode = useStore(useShallow(state => state.llmMode));

  return (
    <Box width={"100vw"} height={`calc(100vh - 65px)`} padding={0}>
      <TopBar/>
      <ReflexContainer orientation='vertical' 
          style={{
            // backgroundColor: "red",
            height: "100%",
            width: "100vw",
            // position: "fixed",
          }}>
        
        <ReflexElement flex={0.55}>
          <Item style={{width: "100%", height:"100%"}}>
            {!llmMode && <BlocklyInterface/>}
            {llmMode && <GPTPanel />}
          </Item>
        </ReflexElement>
        
        <ReflexSplitter propagate={true} />
        
        <ReflexElement flex={0.45}>
          <ReflexContainer orientation='horizontal'>
            <ReflexElement>
              <Item>
                {!llmMode && <Simulator />}
                {llmMode && <BlocklyInterface />}
              </Item>
            </ReflexElement>
            
            <ReflexSplitter propagate={true} />
            
            <ReflexElement>
              <Item>
                {/* <TrackerScreen/> */}
                {llmMode && <Simulator />}
              </Item>
            </ReflexElement>
          
          </ReflexContainer>
        </ReflexElement>
      </ReflexContainer>
      <SettingsModal />
    </Box>
  );
}

export default App;
