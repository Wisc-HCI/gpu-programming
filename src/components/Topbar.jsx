import { useState, useEffect, useRef } from "react";
import useStore from "../Store";
import { activityLog, appendActivity } from "./ActivityTracker";
import { useShallow } from "zustand/react/shallow";

import React from "react";
import { Box, Button, TextField, Container, Typography } from "@mui/material";
import useCompile, { delayJS } from "../compile/useCompile";

export default function TopBar(props) {
  const [worker, setWorker] = useState(null);
  const [data, setData] = useState([]);
  const [result, setResult] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const setIp = useStore(useShallow((state) => state.setIp));
  const getBlocks = useStore(useShallow((state) => state.getBlocks));
  const getBlock = useStore(useShallow((state) => state.getBlock));
  const getBlocksByType = useStore(
    useShallow((state) => state.getBlocksByType)
  );
  const start = getBlocksByType("Start");
  let currParam = start;
  const clock = useStore(useShallow((state) => state.clock));
  const setImageList = useStore(useShallow((state) => state.setImageList));
  const setAudioList = useStore(useShallow((state) => state.setAudioList));
  const { compile } = useCompile();
  const workerRef = useRef(null);

  useEffect(() => {
    const newWorker = new Worker(`${process.env.PUBLIC_URL}/worker.js`);
    newWorker.onmessage = (e) => {
      console.log("Message received from worker:", e.data);
      setResult(e.data);
    };
    newWorker.onerror = (error) => {
      console.error("Worker error:", error);
    };

    setWorker(newWorker);

    workerRef.current = newWorker;
    // Cleanup on component unmount
    return () => {
      newWorker.terminate();
    };
  }, []);

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

  const runCode = () => {
    clock.reset_elapsed();

    console.log("runcode");
    console.log(`starting from the first block: `);
    console.log(start);
    if (worker) {
      setData(getBlocks());
      worker.postMessage(data);
    } else {
      console.log("worker not setup");
    }
    appendActivity("Click Run Code button");
  };

  const stopCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null; // Clear the ref post termination
    }

    delayJS(10000);
    currParam.next = "";
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
