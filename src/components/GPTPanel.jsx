import React from "react";
import SplitSection from "./SplitSection";
import UserPromptInput from "./UserPromptInput";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import { Backdrop, CircularProgress } from "@mui/material";
import TrackerScreen from "../tracker_components/TrackerScreen";

export default function GPTPanel(props) {
  const isLLMProcessing = useStore(useShallow((state) => state.llmProcessing));
  const fullScreenPanel = useStore((state) => state.fullScreenPanel);
  const setFullScreenPanel = useStore((state) => state.setFullScreenPanel);

  return (
    <div style={{ zIndex: 20 }}>
      <Backdrop style={{ color: "#fff", zIndex: 103 }} open={isLLMProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <SplitSection
        leftChildren={<UserPromptInput />}
        rightChildren={
          <div style={{ paddingRight: "50px" }}>
            <TrackerScreen />
          </div>
        }
      />
      <button
        onClick={() => setFullScreenPanel(!fullScreenPanel)}
        style={{
          position: "absolute",
          top: "75px",
          right: "10px",
          backgroundColor: "rgba(255, 0, 0, 0.8)", // Red color for visibility
          color: "#fff",
          padding: "5px 10px",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
        }}
      >
        ✖
      </button>
    </div>
  );
}
