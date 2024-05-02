import { useState, useEffect, useRef } from "react";
import useStore from "../Store";
import { activityLog, appendActivity } from "./ActivityTracker";
import { useShallow } from "zustand/react/shallow";

import React from "react";
import { Box, Button, TextField, Container, Typography } from "@mui/material";
// import useCompile, { delayJS } from "../compile/useCompile";
import { styled } from "@mui/material/styles";

import workerUrl from "./worker.js?worker&url";

export default function TopBar(props) {
  const [inputVal, setInputVal] = useState("");
  const setIp = useStore(useShallow((state) => state.setIp));
  const ip = useStore(useShallow((state) => state.ip));
  const getBlocks = useStore(useShallow((state) => state.getBlocks));
  const getBlocksByType = useStore(
    useShallow((state) => state.getBlocksByType)
  );
  const start = getBlocksByType("Start");
  const clock = useStore(useShallow((state) => state.clock));
  const setImageList = useStore(useShallow((state) => state.setImageList));
  const setAudioList = useStore(useShallow((state) => state.setAudioList));
  const mistyImageList = useStore(useShallow((state) => state.mistyImageList));
  const mistyAudioList = useStore(useShallow((state) => state.mistyAudioList));
  const lightMode = useStore(useShallow((state) => state.lightMode));
  const toggleTheme = useStore(useShallow((state) => state.toggleTheme));
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
    backgroundColor: "#333", // Change the background color as needed
    color: "#FFFFFF", // Change the text color as needed
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
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

  return (
    <Box style={topbarStyle}>
      <Container>
        <Typography variant="h5">
          University of Wisconsin - Grandparents University Programming
        </Typography>
      </Container>

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
        <Button style={{ color: "#FFFFFF" }} onClick={confirmIpAddress}>
          Confirm
        </Button>
        <Button style={{ color: "#FFFFFF" }} onClick={runCode} id="runButton">
          Run
        </Button>
      </Container>
    </Box>
  );
}
