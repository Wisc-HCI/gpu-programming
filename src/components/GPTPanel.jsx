import React from "react";
import SplitSection from "./SplitSection";
import UserPromptInput from "./UserPromptInput";

export default function GPTPanel(props) {
  return (
    <SplitSection leftChildren={<UserPromptInput />} rightChildren={<p>Test2</p>} />
  )
}
