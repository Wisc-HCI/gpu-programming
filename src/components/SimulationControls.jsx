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
    const workerRef = useRef(null);
    const ip = useStore(useShallow((state) => state.ip));
    const getBlocks = useStore(useShallow((state) => state.getBlocks));
    const clock = useStore(useShallow((state) => state.clock));
    const mistyImageList = useStore(useShallow((state) => state.mistyImageList));
    const mistyAudioList = useStore(useShallow((state) => state.mistyAudioList));
    const simOnly = useStore(useShallow((state) => state.simOnly));
    const endingTfs = useStore(useShallow((state) => state.endingTfs));
    const setAnimationFrames = useStore(useShallow((state) => state.setAnimationFrames));
    
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
        tfs: endingTfs,
        ip: ip,
        runOnRobot: !simOnly
    });
    workerRef.current = myWorker;


    // const js2 = `import ${JSON.stringify(new URL(animationUrl, import.meta.url))}`;
    // const blob2 = new Blob([js2], { type: "application/javascript" });
    // const workerURL2 = URL.createObjectURL(blob2);
    // let myWorker2 = new Worker(workerURL2, { type: "module" });
    // myWorker2.onmessage = function (e) {
    //     console.log(e);
    //     console.log(e.data);
    //     console.log(e.data["LEFT_ARM_CONNECTOR_1"])
    //     console.log("Message received from worker2 " + e.data);
    // };
    // myWorker2.postMessage({
    //     blocks: getBlocks(),
    //     tfs: endingTfs,
    // });
    let {newTfs, newEndingTfs} = useAnimation({blocks: getBlocks(), tfs: endingTfs});
    setAnimationFrames(newTfs, newEndingTfs);

    appendActivity("Click Run Code button");
  };

  const stopCode = () => {
    if (workerRef.current) {
      workerRef.current.terminate();
      workerRef.current = null; // Clear the ref post termination
    }
    appendActivity("Click Stop Code button");
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
                {/* {!workerRef.current && */}
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
                {/* } */}
                {/* {workerRef.current &&
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
                } */}
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
                    <FormControlLabel control={<Checkbox onChange={(e) => toggleSimOnly(e.target.checked)}/>} label="Sim only" />
                </FormGroup>
            </Container>}
        </Stack>
    );
}
