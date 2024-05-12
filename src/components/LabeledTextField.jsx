import { Box, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import DropShadowButton from "./DropShadowButton";

export default function LabeledTextField({
  label,
  onChangeFunction,
  textFieldInput,
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
      <TextField value={textFieldInput} onChange={onChangeFunction} />
    </Grid>
  );
}
