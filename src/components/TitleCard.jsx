import { Box, Typography } from "@mui/material";
import React from "react";

export default function TitleCard({text, style}) {
  return (
    <Box style={{
        backgroundColor: "#585D92",
        color: "white",
        borderRadius: "10px",
        padding: "5px",
        filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
        ...style}}>
        <Typography variant="h6">
            {text}
        </Typography>
    </Box>
  );
}
