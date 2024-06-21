import React from "react";
import SplitSection from "./SplitSection";
import UserPromptInput from "./UserPromptInput";
import useStore from "../Store";
import TrackerScreen from "../tracker_components/TrackerScreen";
import DropShadowButton from "./DropShadowButton";
import useWindowDimensions from "../useWindowDimensions";

export default function GPTPanel(props) {
  const fullScreenPanel = useStore((state) => state.fullScreenPanel);
  const setFullScreenPanel = useStore((state) => state.setFullScreenPanel);

  const {height, _} = useWindowDimensions();
  let calcHeight = height-155;

  return (
    <div style={{ zIndex: 20, height: "100%" }}>
      <SplitSection
        leftChildren={<UserPromptInput />}
        rightChildren={
          <div style={{ width: "100%" }}>
            <div style={{ height: calcHeight, overflowY: "scroll" }}>
              <TrackerScreen />
            </div>
            <div style={{ position: "absolute", right: 20 }}>
              <DropShadowButton text={"Done"} clickFunction={() => setFullScreenPanel(!fullScreenPanel)} style={{backgroundColor: "#A0FF7E"}}/>
            </div>
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
