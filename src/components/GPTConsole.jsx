import { useState } from "react";
import SplitSection from "./SplitSection";
import UserPromptInput from "./UserPromptInput";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import { Backdrop, CircularProgress } from "@mui/material";

export default function GPTConsole(props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const isLLMProcessing = useStore(useShallow((state => state.llmProcessing)));


  return (
    <div
      style={{
        position: isFullScreen ? 'fixed' : 'relative',
        top: isFullScreen ? 0 : 'auto',
        left: isFullScreen ? 0 : 'auto',
        width: isFullScreen ? '100vw' : '300px',
        height: isFullScreen ? '100vh' : '200px',
        backgroundColor: '#222',
        color: '#fff',
        padding: '10px',
        overflow: 'auto',
        zIndex: 1000,
      }}
    >
      <div>
        <button onClick={toggleFullScreen}>
          {isFullScreen ? 'Exit Full Screen' : 'Expand to Full Screen'}
        </button>
      </div>
      <div>
        <p>Console output goes here...</p>
        {/* Add your console log output here */}
      </div>
    </div>
  )
}
