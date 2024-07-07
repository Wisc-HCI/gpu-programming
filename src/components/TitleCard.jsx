import { Box, Typography } from "@mui/material";
import React from "react";

export default function TitleCard({text, style}) {
  return (
    <Box style={{
      display: "flex",
      backgroundColor: "#585D92",
      height: "30px",
      alignContent: "center",
      paddingTop: "15px"
    }}>
      <Box style={{
          backgroundColor: "white",
          color: "black",
          // padding: "5px",
          padding: "3px 15px",
          alignSelf: "flex-end",
          marginRight: "5px",
          marginLeft: "10px",
          marginTop: "10px",
          position: "relative",
          borderTopLeftRadius: "5px",
          borderTopRightRadius: "5px",
          ...style}}>
          <Typography variant="h6">
              {text}
          </Typography>



          {/* <div className="tabs-container">
          {allKeys.map((key, idx) => (
            <div
              key={key}
              className={`tab ${idx === activeTab ? 'active' : ''}`}
              onClick={() => handleTabChange(idx)}
            >
              {isPlanningScreen ? "Milestones - Story" : "Milestones - Programmng"}
            </div>
          ))}
        </div> */}

  {/* .tabs-container {
      display: flex;
      background-color: #585D92;
      height: 30px;
      align-content: center;
  }

  .tab {
      padding: 3px 15px;
      cursor: pointer;
      margin-right: 5px;
      font-size: 14px;
      color: gray;
      background-color: #E4E5F1;
      align-self: flex-end;
      margin-top: 10px;
      position: relative;
      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0; 
  }

  .tab.active {
      background-color: white;
      color: black;
  } */}
      </Box>
    </Box>

    
  );
}
