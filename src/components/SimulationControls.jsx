import React, { useRef } from "react";
import useStore from "../Store";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import { useShallow } from "zustand/react/shallow";
import { activityLog, appendActivity } from "./ActivityTracker";

import workerUrl from '../compile/compile-worker.js?worker&url';
import useAnimation from '../compile/useAnimation';

import { Checkbox, Container, FormControlLabel, FormGroup, Stack } from "@mui/material";

export default function SimulationControls(props) {
    const resetSim = useStore(useShallow((state) => state.resetSim));
    const toggleSimOnly = useStore(useShallow((state) => state.toggleSimOnly));
    const isConnected  = useStore(useShallow((state) => state.isConnected ));
    const ip = useStore(useShallow((state) => state.ip));
    const getBlocks = useStore(useShallow((state) => state.getBlocks));
    const getEndingItems = useStore(useShallow((state) => state.getEndingItems));
    const clock = useStore(useShallow((state) => state.clock));
    const mistyImageList = useStore(useShallow((state) => state.mistyImageList));
    const mistyAudioList = useStore(useShallow((state) => state.mistyAudioList));
    const simOnly = useStore(useShallow((state) => state.simOnly));
    const endingTfs = useStore(useShallow((state) => state.endingTfs));
    const setAnimationFrames = useStore(useShallow((state) => state.setAnimationFrames));
    const workerThread = useStore(useShallow((state) => state.workerThread));
    const setWorkerThread = useStore(useShallow((state) => state.setWorkerThread));
    const llmMode = useStore(useShallow(state => state.llmMode));

    function sendPostRequestToRobot(endpoint, payload) {
        if (ip && !simOnly && isConnected) {
          fetch(`http://${ip}/api/${endpoint}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        }
      }

    const runCode = async () => {
        clock.reset_elapsed();

        if (workerThread) {
            workerThread.terminate();
            setWorkerThread(null);
        }
        const js = `import ${JSON.stringify(new URL(workerUrl, import.meta.url))}`;
        const blob = new Blob([js], { type: "application/javascript" });
        const workerURL = URL.createObjectURL(blob);
        let myWorker = new Worker(workerURL, { type: "module" });
        myWorker.onmessage = function (e) {
            console.log("Message received from worker " + e.data);
            setWorkerThread(null);
        };
        myWorker.onerror = function (e) {
            // Todo, if worker errors, something isn't parameterized. Can do something with this data
            console.log(e);
            URL.revokeObjectURL(workerURL);
        };
        myWorker.postMessage({
            blocks: getBlocks(),
            mistyAudioList: mistyAudioList,
            mistyImageList: mistyImageList,
            tfs: endingTfs,
            ip: ip,
            runOnRobot: !simOnly
        });
        setWorkerThread(myWorker);

        let {newTfs, newEndingTfs, newItems, newEndingItems} = useAnimation({blocks: getBlocks(), tfs: endingTfs, items: getEndingItems()});
        console.log(newEndingItems);
        setAnimationFrames(newTfs, newEndingTfs, newItems, newEndingItems);

        appendActivity("Click Run Code button");
    };

    const stopCode = () => {
        if (workerThread) {
            workerThread.terminate();
            setWorkerThread(null);
            sendPostRequestToRobot("halt", {});
        }
        appendActivity("Click Stop Code button");
    };

    const resetRobot = () => {
        sendPostRequestToRobot("arms/set", {
            LeftArmPosition: 90,
            RightArmPosition: 90,
            LeftArmVelocity: 100,
            RightArmVelocity: 100,
            Units: "Degrees",
        });
        
        sendPostRequestToRobot("head", {
            Pitch: 0,
            Yaw: 0,
            Roll: 0,
            Duration: 1,
            Units: "Degrees",
        });
        
        sendPostRequestToRobot("images/display", {
            FileName: "e_DefaultContent.jpg",
            Alpha: 1
        });

        sendPostRequestToRobot("text/display", {
          Text: "",
        });

        sendPostRequestToRobot("led", {
            Red: 100,
            Green: 70,
            Blue: 160
        });

        resetSim();
    }

    let styleLocation = llmMode ? {top: "10px"} : {bottom: "0px"}

    return (
        <Stack style={{
            position: "absolute",
            padding: "0px",
            left: "10px",
            ...styleLocation
        }}>
            <Container style={{
                paddingLeft: "0px",
                paddingRight: "0px"
            }}>
                {!workerThread &&
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
                {workerThread &&
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
                    onClick={resetRobot}
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
                    <FormControlLabel control={<Checkbox onChange={(e) => toggleSimOnly(e.target.checked)}/>} label="Sim only" />
                </FormGroup>
            </Container>}
        </Stack>
    );
}
