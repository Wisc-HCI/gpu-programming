import { Typography } from "@mui/material";
import React from "react";

export default function Tab({onClick, isActive, text, useSubtitle=false}) {

    let nonActiveStyle = {
        padding: "3px 15px",
        cursor: "pointer",
        marginRight: "5px",
        marginRop: "10px",
        fontSize: "14px",
        color: "gray",
        backgroundColor: "#E4E5F1",
        alignSelf: "flex-end",
        position: "relative",
        borderTopLeftRadius: "5px",
        borderTopRightRadius: "5px",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
     }
    let activeStyle = {...nonActiveStyle, backgroundColor: "white", color: "black"};
  return (
    <div
        style={isActive ? activeStyle : nonActiveStyle}
        onClick={onClick}
    >
        <Typography variant={useSubtitle ? "subtitle1" : "h6"}>
            {text}
        </Typography>
    </div>
  )
}
