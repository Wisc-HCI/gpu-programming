import { Grid, TextField } from "@mui/material";
import React from "react";
import DropShadowButton from "./DropShadowButton";
import useWindowDimensions from "../useWindowDimensions";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";

export default function UserPromptInput({ style, maxVH=0 }) {
  const userPrompt = useStore(useShallow(state => state.userPrompt));
  const setUserPrompt = useStore(state => state.setUserPrompt);
  const generateProgramOutline = useStore(state => state.generateProgramOutline);
  const isLLMProcessing = useStore(useShallow((state => state.llmProcessing)));
  
  const {height, _} = useWindowDimensions();

  function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
  }

  let maximumRows = maxVH > 0 ? vh(maxVH)/23 : (height-190)/23

  const updatePrompt = (e) => {
    setUserPrompt(e.target.value);
  }
  
  return (
    <div style={{...style}}>
      <TextField 
          label="What do you want the robot to do?"
          multiline
          disabled={isLLMProcessing}
          fullWidth
          minRows={maximumRows}
          maxRows= {maximumRows}
          onChange={updatePrompt}
          value={userPrompt}
      />
          <DropShadowButton text={"Generate Program Goals"} clickFunction={generateProgramOutline} disabled={isLLMProcessing} style={{float: "right", backgroundColor: "#A0FF7E"}}/>
    </div>
  )
}
