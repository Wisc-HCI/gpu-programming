import React from "react";
import SplitSection from "./SplitSection";
import UserPromptInput from "./UserPromptInput";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import { Backdrop, CircularProgress } from "@mui/material";

export default function GPTPanel(props) {
  const isLLMProcessing = useStore(useShallow((state => state.llmProcessing)));

  return (
    <div>
      <Backdrop style={{color: "#fff", zIndex:103}} open={isLLMProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <SplitSection leftChildren={<UserPromptInput />} rightChildren={<p>Test2</p>} />
    </div>
  )
}
