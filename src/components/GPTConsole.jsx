import { useState } from "react";
import GPTPanel from "./GPTPanel";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import UserPromptInput from "./UserPromptInput";

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
  const userPrompt = useStore((state) => state.userPrompt);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "0px",
        left: "114.7px", //toolbox width is 114.7px
        width: "93%",
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
          left: "5vw",
        }}
      >
        Expand to Full Screen
      </button>

      <div
        style={{
          position: "absolute",
          zIndex: 20,
          top: "40px",
          left: "50px",
        }}
      >
        <p>User prompt: {userPrompt}</p>
        {/*        
        <UserPromptInput />
        <GPTPanel /> */}
      </div>
      <button
        onClick={() => setShowGPTConsole(!showGPTConsole)}
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
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
