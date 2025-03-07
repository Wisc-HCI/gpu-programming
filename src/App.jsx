import React from "react";
import * as Blockly from "blockly";
import "./App.css"; // Assuming index.css is renamed to App.css

// Import custom blocks and generators
import { blocks } from "./blocks/text";
import { forBlock } from "./generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import "./index.css";
import TopBar from "./components/Topbar";
import BlocklyInterface from "./components/Blockly-interface";
import TrackerScreen from "./tracker_components/TrackerScreen.jsx";

import { styled } from "@mui/material/styles";
import { default as LoadingLogo } from './svgs/misty_loading_combined.gif';

import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";

import "react-reflex/styles.css";
import { Backdrop, Box } from "@mui/material";
import Simulator from "./components/Simulator.jsx";
import { SettingsModal } from "./modals/Settings.jsx";
import useStore from "./Store.js";
import { useShallow } from "zustand/react/shallow";
import GPTPanel from "./components/GPTPanel.jsx";
import { PromptModal } from "./modals/PromptModal.jsx";
import {
  SELECTION_SCREEN,
  PHASE_ONE_SCREEN,
  PHASE_THREE_SCREEN,
  PHASE_TWO_SCREEN,
} from "./Constants.js";
import DayOneScreen from "./components/DayOneScreen.jsx";
import SelectionScreen from "./components/SelectionScreen.jsx";

const Item = styled("div")(({ theme }) => ({
  textAlign: "center",
  height: "100%",
}));

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);
function App() {
  const llmMode = useStore(useShallow((state) => state.llmMode));
  const isLLMProcessing = useStore(useShallow((state) => state.llmProcessing));
  const headerHeight = useStore(useShallow((state) => state.headerHeight));
  const screenToShow = useStore((state) => state.screenToShow);

  return (
    <Box width={"100vw"} height={`calc(100vh - ${headerHeight}px)`} padding={0}>
      <TopBar />
      {screenToShow === SELECTION_SCREEN && <SelectionScreen />}
      {screenToShow === PHASE_ONE_SCREEN && <DayOneScreen />}
      {screenToShow === PHASE_TWO_SCREEN && <GPTPanel
          style={{
            width: "100vw",
          }}
        />}
      {screenToShow === PHASE_THREE_SCREEN && (
        <ReflexContainer
          orientation="vertical"
          style={{
            // backgroundColor: "red",
            height: "100%",
            width: "100vw",
            // position: "fixed",
          }}
        >
          <ReflexElement flex={0.55}>
            <Item style={{ width: "100%", height: "100%" }}>
              <BlocklyInterface />
            </Item>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          <ReflexElement flex={0.45}>
            <ReflexContainer orientation="horizontal">
              <ReflexElement>
                <Item>{!llmMode && <Simulator />}</Item>
              </ReflexElement>

              <ReflexSplitter propagate={true} />

              <ReflexElement>
                <Item>{!llmMode && <TrackerScreen />}</Item>
              </ReflexElement>
            </ReflexContainer>
          </ReflexElement>
        </ReflexContainer>
      )}
      <Backdrop style={{ color: "#fff", zIndex: 1500 }} open={isLLMProcessing}>
        <img src={LoadingLogo} style={{width: "10%"}} />
        {/* <CircularProgress color="inherit" /> */}
      </Backdrop>
      <SettingsModal />
      <PromptModal />
    </Box>
  );
}

export default App;
