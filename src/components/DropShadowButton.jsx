import { Button } from "@mui/material";
import React from "react";

export default function DropShadowButton({ icon, text, clickFunction, style }) {
  return (
    <Button
      onClick={clickFunction}
      startIcon={icon}
      style={{
        margin: "5px",
        color: "black",
        backgroundColor: "#FAFAFA",
        borderRadius: "10px",
        filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
        ...style,
      }}
    >
      {text}
    </Button>
  );
}
