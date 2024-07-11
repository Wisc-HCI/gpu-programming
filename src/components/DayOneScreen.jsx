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
          <div style={{display: "flex", flexFlow: "column", height: "100%"}}> 
            <div style={{flex: "0 1 auto"}}>
              <TitleCard text={"Task Description"}/>
            </div>
            <div style={{flex: "1 1 auto", padding: "10px", alignItems: "center", alignContent: "center"}}>
              <DayOneTaskDescription />
              </div>
            </div>
          </ReflexElement>

          <ReflexSplitter propagate={true} />

          {/* LLM chatbox */}
          <ReflexElement flex={0.70}>
            <div style={{display: "flex", flexFlow: "column", height: "100%"}}> 
              <div style={{flex: "0 1 auto"}}>
                <TitleCard text={"Chat"}/>
              </div>
              <div style={{flex: "1 1 auto", paddingTop: "5px"}}>
                <ChatBox />
              </div>
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
            
            <div style={{display: "flex", flexFlow: "column", height: "100%"}}> 
              <div style={{flex: "0 1 auto"}}>
                <TitleCard text={"Robot Features"} />
              </div>
              <div style={{flex: "1 1 auto", paddingTop: "5px", textAlign: "center"}}>
                <Grid container style={{height: "100%"}}>
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
                        content={["Move Misty's arms and head!", "Change the color of the LED on its chest.", "Turn the flashlist on its head on.", "Change Misty's experessions, play audio files, or have it speak!", "Move Misty around by turning left and right."]}
                        style={{paddingRight: "10px"}}
                      />
                  </Grid>
                </Grid>
              </div>
            </div>
          </ReflexElement>
        </ReflexContainer>
      </ReflexElement>
    </ReflexContainer>
  );
}
