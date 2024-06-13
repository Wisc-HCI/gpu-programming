import React from "react";
import { Button, Grid } from "@mui/material";
import useStore from "../Store";
import {
  DAY_ONE_SCREEN,
  DAY_TWO_SCREEN,
  DAY_ONE_BTN_TEXT,
  DAY_TWO_BTN_TEXT
} from "../Constants.js";
import DropShadowButton from "./DropShadowButton.jsx";

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
        <DropShadowButton text={DAY_ONE_BTN_TEXT} clickFunction={() => updateScreen(DAY_ONE_SCREEN)} style={{padding: "50px"}}/>
      </Grid>
      <Grid item xs={2}></Grid>
      <Grid item xs={3}>
        <DropShadowButton text={DAY_TWO_BTN_TEXT} clickFunction={() => updateScreen(DAY_TWO_SCREEN)} style={{padding: "50px"}}/>
      </Grid>
      <Grid item xs={1}></Grid>
    </Grid>
  );
}
