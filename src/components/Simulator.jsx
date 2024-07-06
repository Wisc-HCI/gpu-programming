import useStore from "../Store";
import { MeshLookupTable } from "../Misty-Robot/MeshLookup.js";
import { Scene } from "robot-scene";

import React from "react";
import { Box } from "@mui/material";
import SimulationControls from "./SimulationControls.jsx";
import MistyChatBubble from "./MistyChatBubble.jsx";

export default function Simulator(props) {

  const otherArgs = {
    displayTfs: false,
    displayGrid: true,
    isPolar: false,
    backgroundColor: "#3a3a3a",
    planeColor: "#3a3a3a",
    highlightColor: "#ffffff",
    plane: 0,
    fov: 60,
    ar: false,
    vr: false,
  };

  return (
    <Box height={"100%"}>
      <Scene
        style={{ overflow: "hidden" }}
        store={useStore}
        meshLookup={MeshLookupTable}
        {...otherArgs}
      />
      <SimulationControls />
      <div style={{position: "absolute", right: 10, bottom: 0, padding: "10px", maxWidth: "50%" }}>
        <MistyChatBubble />
      </div>
    </Box>
  );
}
