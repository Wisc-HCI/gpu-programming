import React from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { styled } from "@mui/material/styles";
import "react-reflex/styles.css";
import { default as MistyLogo } from "../svgs/misty.svg";
import { Grid } from "@mui/material";
import DayOneTaskDescription from "./DayOneTaskDescription";
import TrackerScreen from "../tracker_components/TrackerScreen";
import ChatBox from "./ChatBox";

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
      <ReflexElement flex={0.65}>
        <ReflexContainer orientation="horizontal">
          <ReflexElement flex={0.30}>
            <Item style={{ width: "100%"}}>
              <DayOneTaskDescription />
            </Item>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          {/* LLM chatbox */}
          <ReflexElement flex={0.70}>
            <Item style={{ width: "100%", height: "100%" }}>
              <ChatBox />
            </Item>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>

      <ReflexSplitter propagate={true} />

      <ReflexElement flex={0.35}>
        <ReflexContainer orientation="horizontal">
          <ReflexElement>
            <Item>
              <TrackerScreen isPlanningScreen={true}/>
            </Item>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          <ReflexElement>
            <div style={{textAlign: "center", height: "100%", alignItems: "center", display: "flex"}}>
              <Grid container alignItems={"center"}>
                <Grid item xs={12} alignItems={"center"}>
                  <img
                    style={{
                      alignContent: "center",
                      width: "70%",
                      height: "70%",
                    }}
                    src={MistyLogo}
                  />
                </Grid>
              </Grid>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}
