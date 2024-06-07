import { useState } from "react";
import GPTPanel from "./GPTPanel";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import UserPromptInput from "./UserPromptInput";
import zIndex from "@mui/material/styles/zIndex";

//toolbox width is 731px
export default function GPTConsole(props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPanel, setShowPanel] = useState(false); // State to toggle visibility

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const isLLMProcessing = useStore(useShallow((state) => state.llmProcessing));

  const setFullScreenPanel = useStore(
    useShallow((state) => state.setFullScreenPanel)
  );
  const setShowGPTConsole = useStore((state) => state.setShowGPTConsole);
  const showGPTConsole = useStore((state) => state.showGPTConsole);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        zIndex: 10,
        backgroundColor: "#222",
        color: "#fff",
        height: "25vh",
      }}
    >
      <button
        onClick={() => {
          setFullScreenPanel(true);
          setShowGPTConsole(!showGPTConsole);
        }}
        style={{
          position: "relative",
          bottom: "0px",
          left: "10vw",
        }}
      >
        Expand to Full Screen
      </button>
      {/* <UserPromptInput style={{ zIndex: "200" }} /> */}
      {/* <GPTPanel></GPTPanel> */}
      <button
        onClick={() => setShowGPTConsole(!showGPTConsole)}
        style={{
          position: "absolute",
          top: "10px",
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
