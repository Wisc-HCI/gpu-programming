import React, { useState, useRef } from "react";
import useStore from "../Store";
import { activityLog, appendActivity } from "./ActivityTracker";
import { useShallow } from "zustand/react/shallow";
import { Box, Button, TextField, Container, Typography, Grid } from "@mui/material";
import { default as MistyLogo } from './misty.svg';
import workerUrl from '../compile/compile-worker.js?worker&url';
import FileSaver from 'file-saver';

export default function TopBar(props) {
  const [inputVal, setInputVal] = useState("");
  const setIp = useStore(useShallow((state) => state.setIp));
  const ip = useStore(useShallow((state) => state.ip));
  const getBlocks = useStore(useShallow((state) => state.getBlocks));
  const clock = useStore(useShallow((state) => state.clock));
  const setImageList = useStore(useShallow((state) => state.setImageList));
  const setAudioList = useStore(useShallow((state) => state.setAudioList));
  const mistyImageList = useStore(useShallow((state) => state.mistyImageList));
  const mistyAudioList = useStore(useShallow((state) => state.mistyAudioList));
  const setIsConnected = useStore(useShallow((state) => state.setIsConnected));
  const isConnected = useStore(useShallow((state) => state.isConnected));
  const runOnRobot = useStore(useShallow((state) => state.runOnRobot));
  const disconnect = useStore(useShallow((state) => state.disconnect));
  const workerRef = useRef(null);

  const confirmIpAddress = () => {
    setIp(inputVal);
    fetch(`http://${inputVal}/api/battery`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          // If the response status code is not in the 200-299 range,
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        console.log(
          `Successfully sent a GET request, the response is: ${json}`
        );
        alert("Confirmed IP Address: " + inputVal);
        setIsConnected(true);

        return fetch(`http://${inputVal}/api/audio/list`);
      })
      .then((res) => {
        if (!res.ok) {
          // If the response status code is not in the 200-299 range,
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setAudioList(json["result"]);

        return fetch(`http://${inputVal}/api/images/list`);
      })
      .then((res) => {
        if (!res.ok) {
          // If the response status code is not in the 200-299 range,
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        setImageList(json["result"]);
      })
      .catch((error) => {
        // Handle the error
        console.error("Error during fetch operation:", error.message);
        alert(`Error fetching data: ${error.message}`);
      });
    appendActivity("Hit Confirm IP Address Button");
  };

  const topbarStyle = {
    backgroundColor: "#585D92", // Change the background color as needed
    color: "#FFFFFF", // Change the text color as needed
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
    zIndex: 101,
    position: "relative"
  };

  const runCode = async () => {
    clock.reset_elapsed();

    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null;
    }
    const js = `import ${JSON.stringify(new URL(workerUrl, import.meta.url))}`;
    const blob = new Blob([js], { type: "application/javascript" });
    const workerURL = URL.createObjectURL(blob);
    let myWorker = new Worker(workerURL, { type: "module" });
    myWorker.onmessage = function (e) {
      console.log("Message received from worker " + e.data);
    };
    myWorker.onerror = function (e) {
      URL.revokeObjectURL(workerURL);
    };
    myWorker.postMessage({
      blocks: getBlocks(),
      mistyAudioList: mistyAudioList,
      mistyImageList: mistyImageList,
      ip: ip,
      runOnRobot: runOnRobot
    });
    workerRef.current = myWorker;

    appendActivity("Click Run Code button");
  };

  const stopCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null; // Clear the ref post termination
    }
    appendActivity("Click Stop Code button");
    console.log(activityLog);
  };

  const handleDownload = () =>{
    
    var blob = new Blob([activityLog], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "activity log.txt");
  }


  return (
    <Box style={topbarStyle}>
      <Grid
        container
        direction="row"
        justifyContent={"left"}
        alignItems={"center"}
        style={{paddingLeft: "20px"}}
      >
        <img style={{height:"35px", paddingRight: "10px"}} src={MistyLogo} />
        <Typography display={"inline"} variant="h5">
          Robo-Blocks
        </Typography>
      </Grid>

      <Container
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          width: "100%",
          marginTop: "5px",
          marginBottom: "5px",
          paddingRight: "0px",
        }}
      >
        <Button style={{ color: "#FFFFFF" }} onClick={handleDownload}>
          Download     
        </Button>

        <Button style={{ color: "#FFFFFF" }} onClick={stopCode}>
          Stop
        </Button>
        <TextField
          id="robotIpAddress"
          label="IP"
          variant="filled"
          style={{ backgroundColor: "#FFFFFF50", borderRadius: "5px" }}
          defaultValue=""
          onChange={(e) => setInputVal(e.target.value)}
        />
        {!isConnected && 
          <Button style={{ color: "#FFFFFF" }} onClick={confirmIpAddress}>
            Connect
          </Button>
        }
        {isConnected && 
          <Button style={{ color: "#FFFFFF" }} onClick={disconnect}>
            Disconnect
          </Button>
        }
        <Button style={{ color: "#FFFFFF" }} onClick={runCode} id="runButton">
          Run
        </Button>
      </Container>
    </Box>
  );
}
