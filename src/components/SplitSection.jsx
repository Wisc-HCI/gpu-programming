import { Container, Divider, Grid } from "@mui/material";
import React from "react";

export default function SplitSection({
    leftChildren,
    rightChildren
}) {
  return (
    <Grid
        container
        direction="row"
        justifyContent={"center"}
        // alignItems={"center"}
        spacing={2}
        style={{
            padding: "20px",
            height: "100%",
            width: "100%"
        }}
    >
        <Grid item xs={6}>
            {leftChildren}
        </Grid>
        <Grid item xs={1}>
            <Divider orientation="vertical" style={{height: "100%", width: "1px"}} />
        </Grid>
        <Grid item xs={5}>
            {rightChildren}
        </Grid>
    </Grid>
  )
}
