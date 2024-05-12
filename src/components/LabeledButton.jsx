import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import DropShadowButton from "./DropShadowButton";

export default function LabeledButton({
  label,
  buttonText,
  clickFunction,
  style,
}) {
  return (
    <Grid
      container
      direction="row"
      alignItems={"center"}
      style={{ ...style }}
    >
      <Typography
        display={"inline"}
        style={{ paddingRight: "10px", flex: "1" }}
      >
        {label}
      </Typography>
      <DropShadowButton text={buttonText} clickFunction={clickFunction} />
    </Grid>
  );
}
