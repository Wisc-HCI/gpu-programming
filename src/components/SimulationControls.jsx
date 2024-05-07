import React, { useRef } from "react";
import useStore from "../Store";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useShallow } from "zustand/react/shallow";
import { activityLog, appendActivity } from "./ActivityTracker";

import workerUrl from '../compile/compile-worker.js?worker&url';

import { Checkbox, Container, FormControlLabel, FormGroup, Stack } from "@mui/material";

export default function SimulationControls(props) {
    const resetSim = useStore(useShallow((state) => state.resetSim));
    const toggleRunRobot = useStore(useShallow((state) => state.toggleRunRobot));
    const isConnected  = useStore(useShallow((state) => state.isConnected ));
    const workerRef = useRef(null);
    const ip = useStore(useShallow((state) => state.ip));
    const getBlocks = useStore(useShallow((state) => state.getBlocks));
    const clock = useStore(useShallow((state) => state.clock));
    const mistyImageList = useStore(useShallow((state) => state.mistyImageList));
    const mistyAudioList = useStore(useShallow((state) => state.mistyAudioList));
    const runOnRobot = useStore(useShallow((state) => state.runOnRobot));
    
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
        workerRef.current = null;
    };
    myWorker.onerror = function (e) {
        console.log(e);
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

    return (
        <Stack style={{
            position: "absolute",
            left: "10px",
            bottom: "0px",
            padding: "0px"
        }}>
            <Container style={{
                paddingLeft: "0px",
                paddingRight: "0px"
            }}>
                {!workerRef.current &&
                    <IconButton
                        variant="contained"
                        aria-label="play"
                        style={{
                            backgroundColor: "#FAFAFA",
                            marginBottom: "5px",
                        }}
                        onClick={runCode} 
                        id="runButton"
                    >
                        <PlayArrowIcon />
                    </IconButton>
                }
                {workerRef.current &&
                    <IconButton
                        variant="contained"
                        aria-label="play"
                        style={{
                            backgroundColor: "#FAFAFA",
                            marginBottom: "5px",
                        }}
                        onClick={stopCode} 
                        id="stopButton"
                    >
                        <StopIcon />
                    </IconButton>
                }
                <IconButton
                    variant="contained"
                    aria-label="restart"
                    style={{
                        backgroundColor: "#FAFAFA",
                        marginLeft: "5px",
                        marginBottom: "5px",
                    }}
                    onClick={resetSim}
                >
                    <RestartAltIcon />
                </IconButton>
            </Container>

            {isConnected && <Container style={{
                backgroundColor: "#FAFAFA",
                borderRadius: "5px",
                marginBottom: "5px",
                paddingLeft: "10px",
                paddingRight: "0px"
            }}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox onChange={(e) => toggleRunRobot(e.target.checked)}/>} label="Robot" />
                </FormGroup>
            </Container>}
        </Stack>
    );
}
