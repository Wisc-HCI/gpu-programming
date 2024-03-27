import { useState } from "react";
import useStore from "../Store";

import React from 'react';
import { Box, Button, TextField, Container, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import useCompile from "../compile/useCompile";
export default function TopBar(props){
    const [inputVal, setInputVal] = useState("")
    const setIp = useStore((state) => state.setIp);
    const ip = useStore((state) => state.ip);
    const blocks = useStore((state) => state.blocks);
    const getBlock = useStore((state) => state.getBlock);
    const getBlocksByType = useStore((state) => state.getBlocksByType);
    const { compile } = useCompile();

    const confirmIpAddress =()=> {
      setIp(inputVal)
      fetch(`http://${ip}/api/battery`, {
        method: 'GET'
        }).then(res => {
          if (!res.ok) {
            // If the response status code is not in the 200-299 range,
            throw new Error(`Request failed with status ${res.status}`);
          }
          return res.json();
        })
        .then(json => {
          console.log(`Successfully sent a GET request, the response is: ${json}`);
        })
        .catch(error => {
          // Handle the error
          console.error('Error during fetch operation:', error.message);
          alert(`Error fetching data: ${error.message}`);
        })
        .finally(() => {
          alert("Confirmed IP Address: " + inputVal);
        });

      
    }

    const topbarStyle = {
      backgroundColor: '#333', // Change the background color as needed
      color: '#FFFFFF', // Change the text color as needed
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: "100%"
    };

    const runCode = () => {
      // get start block, then iteratively check for children as well as inputs
      const start = getBlocksByType('Start')
      
      const compileBlocks = blocks
      console.log('runcode')
      console.log(start)
      let currParam = start
      while(currParam.next){
        currParam = getBlock(currParam.next)
        compile(currParam, currParam.type)
        currParam = currParam.next
      }
      
        //const code = javascriptGenerator.workspaceToCode(ws);
        //eval(code);
    }


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
          marginTop: "5px",
          marginBottom: "5px",
          paddingRight: "0px"
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
            <Button style={{color: "#FFFFFF"}} onClick={runCode} id="runButton">Run</Button>
          </Container>
      </Box>
    );
    
}