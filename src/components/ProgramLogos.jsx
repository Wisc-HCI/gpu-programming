import React from "react";
import { Stack} from "@mui/material";

import { default as UWLogo } from '../svgs/uw-crest-color-web-digital.svg';
import { default as PRLLogo } from '../svgs/people_and_robots_lab.svg';

export default function ProgramLogos(props) {

    return (
        <Stack style={{
            position: "absolute",
            left: "20px",
            bottom: "20px",
            // padding: "10px",
            zIndex: "101",
            width: "70px"
        }}>
            <img style={{paddingBottom: "20px"}} src={PRLLogo} />
            <img src={UWLogo} />
        </Stack>
    );
}
