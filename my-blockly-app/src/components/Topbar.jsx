import { useState } from "react";
import useStore from "../Store";

import React from 'react';
import { Box, Button, TextField, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
export default function TopBar(props){
    const [inputVal, setInputVal] = useState("")
    const setIp = useStore((state) => state.setIp);
    const ip = useStore((state) => state.ip);
    const blocks = useStore((state) => state.blocks);

    const confirmIpAddress =()=> {
      setIp(inputVal)
      // alert user with the entered IP address
      alert("Confirmed IP Address: " + inputVal);
    }

    const topbarStyle = {
      backgroundColor: '#333', // Change the background color as needed
      color: '#FFFFFF', // Change the text color as needed
      paddingLeft: '10px',
      // textAlign: 'center',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: "100%"
    };
    return (
      <Box style={topbarStyle}>
        <Container>
          <Typography variant="h5">
            University of Wisconsin - Grandparents University Programming
          </Typography>
        </Container>
        
        <Container style={{
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          width: "100%",
          margin: "5px"
        }}>
          <TextField
            id="robotIpAddress"
            label="IP"
            variant="filled"
            style={{backgroundColor: "#FFFFFF50", borderRadius: "5px"}}
            defaultValue=""
            onChange={(e)=> setInputVal(e.target.value)}
          />
            <Button style={{color: "#FFFFFF"}} onClick={confirmIpAddress}>Confirm</Button>
            <Button style={{color: "#FFFFFF"}} id="runButton">Run</Button>
          </Container>
      </Box>
    );
    
}