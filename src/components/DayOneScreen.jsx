import React from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { styled } from "@mui/material/styles";
import "react-reflex/styles.css";

const Item = styled("div")(({ theme }) => ({
  textAlign: "center",
  height: "100%",
}));

export default function DayOneScreen(props) {
  return (
    <ReflexContainer
      orientation="vertical"
      style={{
        height: "100%",
        width: "100vw",
      }}
    >
      {/* Task overview */}
      <ReflexElement flex={0.15}>
        <Item style={{ width: "100%", height: "100%" }}>
          <div>
            <p> Some crazy description of the task</p>
          </div>
        </Item>
      </ReflexElement>

      <ReflexSplitter propagate={true} />

      {/* LLM chatbox */}
      <ReflexElement flex={0.5}>
        <Item style={{ width: "100%", height: "100%" }}>
          <div>
            <p> LLM chatbox </p>
          </div>
        </Item>
      </ReflexElement>

      <ReflexSplitter propagate={true} />

      <ReflexElement flex={0.35}>
        <ReflexContainer orientation="horizontal">
          <ReflexElement>
            <Item>
              <div>
                <p> Objectives </p>
              </div>
            </Item>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          <ReflexElement>
            <Item>
              <div>
                <p> Misty Image </p>
              </div>
            </Item>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}
