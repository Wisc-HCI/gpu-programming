import useStore from "../Store";
import { MeshLookupTable } from "../Misty-Robot/MeshLookup.js";
import { Scene } from "robot-scene";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useShallow } from "zustand/react/shallow";

import React from "react";
import { Box } from "@mui/material";

export default function Simulator(props) {
  const resetSim = useStore(useShallow((state) => state.resetSim));

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
      <IconButton
        variant="contained"
        aria-label="restart"
        style={{
          position: "absolute",
          right: "0px",
          top: "0px",
          backgroundColor: "white",
          marginRight: "5px",
          marginTop: "5px",
        }}
        onClick={resetSim}
      >
        <RestartAltIcon />
      </IconButton>
    </Box>
  );
}
