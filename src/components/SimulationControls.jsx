import useStore from "../Store";
import IconButton from "@mui/material/IconButton";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useShallow } from "zustand/react/shallow";

import React, { useState } from "react";
import { Checkbox, Container, FormControlLabel, FormGroup, Stack, Typography } from "@mui/material";
import { Check, CheckBox } from "@mui/icons-material";

export default function SimulationControls(props) {
    const resetSim = useStore(useShallow((state) => state.resetSim));
    const toggleRunRobot = useStore(useShallow((state) => state.toggleRunRobot));
    const isConnected  = useStore(useShallow((state) => state.isConnected ));

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
                <IconButton
                    variant="contained"
                    aria-label="play"
                    style={{
                        backgroundColor: "#FAFAFA",
                        marginBottom: "5px",
                    }}
                    onClick={resetSim}
                >
                    <PlayArrowIcon />
                </IconButton>
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
