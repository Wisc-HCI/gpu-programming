import { Box, Typography } from "@mui/material";
import React from "react";
import Divider from '@mui/material/Divider';


export default function Descriptions({header, content, style}) {
  return (
    <Box style={style}>
        <Typography variant="h6">
            {header}
        </Typography>
        <Divider variant="middle" />
        {content.map(sentence => {
            return <Typography variant="subtitle1">
                {sentence}
            </Typography>}
        )}
    </Box>
  );
}
