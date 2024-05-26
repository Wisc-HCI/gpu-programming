import React from "react";
import { Grid, Stack} from "@mui/material";

import { default as UWLogo } from '../svgs/uw-crest-color-web-digital.svg';
import { default as PRLLogo } from '../svgs/people_and_robots_lab.svg';

export default function ProgramLogos(props) {

    return (
        <Grid 
            container
            style={{
                position: "absolute",
                left: "20px",
                bottom: "20px",
                zIndex: "101",
                width: "70px"
            }}
        >
            <Grid item xs={6} sm={6} md={12} lg={12} xl={12} alignContent={"center"}>
                <img src={PRLLogo} />
            </Grid>
            <Grid item xs={6} sm={6} md={12} lg={12} xl={12}>
                <img src={UWLogo} />
            </Grid>
        </Grid>
    );
}
