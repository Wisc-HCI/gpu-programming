import { Box, Typography } from "@mui/material";
import React, { Children } from "react";
import Stack from "@mui/material/Stack";

export default function SettingsDiv({ title, children, style }) {
  return (
    <Box
      style={{
        padding: "5px",
        paddingTop: "20px",
        ...style,
      }}
    >
      <Box
        style={{
          backgroundColor: "#E4E5F1",
          border: "3px #9394A5 solid",
          padding: "5px",
          borderRadius: "6px",
        }}
      >
        <Box
          style={{
            position: "relative",
            display: "float",
            top: "-18px",
            left: "10px",
          }}
        >
          <Box>
            <Typography
              display={"inline"}
              style={{
                filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
                backgroundColor: "#E4E5F1",
                padding: "3px",
                border: "3px #9394A5 solid",
                borderRadius: "6px",
              }}
            >
              {title}
            </Typography>
          </Box>
        </Box>
        <Stack>
          {Children.map(children, (child) => {
            return <div style={{ padding: "3px", margin: "3px" }}>{child}</div>;
          })}
        </Stack>
      </Box>
    </Box>
  );
}
