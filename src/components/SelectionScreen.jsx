import React from "react";
import { Button, Grid } from "@mui/material";
import useStore from "../Store";
import {
  PHASE_ONE_SCREEN,
  PHASE_TWO_SCREEN,
  PHASE_THREE_SCREEN,
  PHASE_ONE_BTN_TEXT,
  PHASE_TWO_BTN_TEXT,
  PHASE_THREE_BTN_TEXT
} from "../Constants.js";
import DropShadowButton from "./DropShadowButton.jsx";
import { appendActivity } from "./ActivityTracker.jsx";

export default function SelectionScreen(props) {
  const updateScreen = useStore((state) => state.updateScreen);

  return (
    <Grid
      container
      direction="row"
      justifyContent={"center"}
      spacing={2}
      style={{
        height: "100%",
        textAlign: "center",
        alignContent: "center",
        backgroundColor: "#E4E5F1",
        marginTop: 0,
      }}
    >
      <Grid item xs={1}></Grid>
      <Grid item xs={3}>
        <DropShadowButton text={PHASE_ONE_BTN_TEXT} clickFunction={() => {appendActivity("User clicked new tab: Story"); updateScreen(PHASE_ONE_SCREEN)}} style={{padding: "50px"}}/>
      </Grid>
      <Grid item xs={3}>
        <DropShadowButton text={PHASE_TWO_BTN_TEXT} clickFunction={() => {appendActivity("User clicked new tab: Planning"); updateScreen(PHASE_TWO_SCREEN)}} style={{padding: "50px"}}/>
      </Grid>
      <Grid item xs={3}>
        <DropShadowButton text={PHASE_THREE_BTN_TEXT} clickFunction={() => {appendActivity("User clicked new tab: Programming"); updateScreen(PHASE_THREE_SCREEN)}} style={{padding: "50px"}}/>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
}
