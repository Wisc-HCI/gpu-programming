import { Grid, Input, Typography } from "@mui/material";
import React from "react";

export default function LabeledInput({
  label,
  onChange,
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
      <Input type="file" onChange={onChange} accept=".xml" />
    </Grid>
  );
}
