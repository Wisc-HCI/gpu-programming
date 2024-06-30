import React from "react";
import { ReflexContainer, ReflexSplitter, ReflexElement } from "react-reflex";
import { styled } from "@mui/material/styles";
import "react-reflex/styles.css";
import { default as MistyLogo } from "../svgs/misty.svg";
import { Grid } from "@mui/material";
import DayOneTaskDescription from "./DayOneTaskDescription";
import TrackerScreen from "../tracker_components/TrackerScreen";
import ChatBox from "./ChatBox";
import SplitSection from "./SplitSection";
import Descriptions from "./Descriptions";
import TitleCard from "./TitleCard";

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
            <Item style={{ height: "100%", width: "100%", alignItems: "center", alignContent: "center"}}>
              <DayOneTaskDescription />
            </Item>
            <div style={{position: "absolute", right: "10px", top: "10px"}}>
              <TitleCard text={"Task Description"}/>
            </div>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          {/* LLM chatbox */}
          <ReflexElement flex={0.70}>
            <Item style={{ width: "100%", height: "100%" }}>
              <ChatBox />
            </Item>
            <div style={{position: "absolute", right: "10px", top: "3px"}}>
              <TitleCard text={"Chat"}/>
            </div>
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
            <div style={{textAlign: "center", height: "100%", display: "flex"}}>
              <Grid container>
                <Grid item xs={6} alignItems={"center"}>
                    <img
                      style={{
                        alignContent: "center",
                        width: "80%",
                        height: "80%",
                      }}
                      src={MistyLogo}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Descriptions 
                      header={"Misty Robot"}
                      content={["Misty can move both of its arms and head.", "It is also capable of turning left and right.", ""]}
                      style={{paddingRight: "10px"}}
                    />
                </Grid>
              </Grid>
            </div>
            <div style={{position: "absolute", left: "10px", top: "10px"}}>
              <TitleCard text={"Robot Features"} />
            </div>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}
