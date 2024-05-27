import { useState } from "react";
import GPTPanel from "./GPTPanel";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";

export default function GPTConsole(props) {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showPanel, setShowPanel] = useState(false); // State to toggle visibility

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const isLLMProcessing = useStore(useShallow(state => state.llmProcessing));

  return (
    <div style={{
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
    }}>
      {!showPanel ? (
        <button onClick={() => setShowPanel(true)} style={{
          position: 'relative',
          bottom: '0px',
          left: '50%',
        }}>
          {isFullScreen ? 'Exit Full Screen' : 'Expand to Full Screen'}
        </button>
      ) : (
        <GPTPanel />
      )}
      <p style={{
        position: 'relative',
        bottom: '0px',
        left: '50%',
      }}>Goals goes here...</p>
    </div>
  );
}
