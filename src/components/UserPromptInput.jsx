import { TextField, TextareaAutosize } from "@mui/material";
import React, { useState } from "react";
import DropShadowButton from "./DropShadowButton";
import useWindowDimensions from "../useWindowDimensions";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";

export default function UserPromptInput(props) {
  const userPrompt = useStore(useShallow(state => state.userPrompt));
  const setUserPrompt = useStore(state => state.setUserPrompt);
  const generateProgramOutline = useStore(state => state.generateProgramOutline);
  
  const {height, _} = useWindowDimensions();

  const updatePrompt = (e) => {
    setUserPrompt(e.target.value);
  }

  return (
    <div>
      <TextField 
          label="What do you want the robot to do?"
          multiline
          fullWidth
          minRows={(height-180)/23}
          maxRows={(height-180)/23}
          onChange={updatePrompt}
      />
      <DropShadowButton text={"Generate Program Goals"} clickFunction={generateProgramOutline} style={{float: "right", backgroundColor: "#A0FF7E"}}/>
    </div>
  )
}
