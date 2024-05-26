import React, { useEffect, useState } from "react";
import useStore from "../Store";
import { appendActivity } from "./ActivityTracker";
import { useShallow } from "zustand/react/shallow";
import {
  TextField,
  Typography,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";

import { default as MistyLogo } from "../svgs/misty.svg";
import { default as PluggedIcon } from "../svgs/plugged.svg";
import { default as UnpluggedIcon } from "../svgs/unplugged.svg";

import DropShadowButton from "./DropShadowButton";
import SettingsIcon from "@mui/icons-material/Settings";
import { EditNote } from "@mui/icons-material";
import { PROMPT_MODAL, SETTINGS_MODAL } from "../Constants";

export default function TopBar(props) {
  const [inputVal, setInputVal] = useState("");
  const setIp = useStore(useShallow((state) => state.setIp));
  const setImageList = useStore(useShallow((state) => state.setImageList));
  const setAudioList = useStore(useShallow((state) => state.setAudioList));
  const setIsConnected = useStore(useShallow((state) => state.setIsConnected));
  const isConnected = useStore(useShallow((state) => state.isConnected));
  const disconnect = useStore(useShallow((state) => state.disconnect));
  const setActiveModal = useStore((state) => state.setActiveModal);
  const toggleLLMMode = useStore(state => state.toggleLLMMode);
  const llmMode = useStore(useShallow(state => state.llmMode));
  const setHeaderDimensions = useStore(state => state.setHeaderDimensions);

  useEffect(() => {
    const header = document.getElementById("website-header");
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setHeaderDimensions(header.offsetHeight, header.offsetWidth);
      }
    });
    observer.observe(header);
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
    filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
    zIndex: 101,
    position: "relative",
    paddingLeft: "20px",
    paddingTop: "5px",
    paddingBottom: "5px",
  };

  return (
    <Grid
      id={"website-header"}
      container 
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      style={topbarStyle}
    >
      <Grid item xs={12} sm={3} md={2} lg={3} xl={3}>
        <Stack direction={"row"} alignItems={"center"}>
          <img style={{maxHeight: "35px", paddingRight: "5px"}} src={MistyLogo} />
          <Typography display={"inline"} variant="h5">
            Robo-Blocks
          </Typography>
        </Stack>
      </Grid>

      <Grid item xs={12} sm={9} md={10} lg={9} xl={9}>
        <Grid 
          container
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Grid item xs={12} sm={12} md={4} lg={4} xl={3} style={{justifyContent: "right", display: "flex"}}>
            {/* <DropShadowButton icon={<EditNote />} text={llmMode ? "Program Manually" : "Program with ChatGPT"} clickFunction={() => toggleLLMMode(!llmMode)}/> */}
            <DropShadowButton icon={<EditNote />} text={llmMode ? "Program Manually" : "Program with ChatGPT"} clickFunction={() => setActiveModal(PROMPT_MODAL)}/>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={5} xl={4} style={{justifyContent: "right", display: "flex"}}>
            <Stack direction={"row"} alignItems={"center"}>
                {!isConnected && (
                  <div
                    style={{
                      backgroundColor: "#FF7E7E",
                      width: "45px",
                      height: "45px",
                      borderRadius: "25px",
                      marginRight: "10px",
                      filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
                    }}
                  >
                    <img
                      style={{
                        height: "34px",
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                      }}
                      src={UnpluggedIcon}
                    />
                  </div>
                )}
                {isConnected && (
                  <div
                    style={{
                      backgroundColor: "#A0FF7E",
                      width: "45px",
                      height: "45px",
                      borderRadius: "25px",
                      marginRight: "10px",
                      filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
                    }}
                  >
                    <img
                      style={{
                        height: "34px",
                        position: "absolute",
                        top: "5px",
                        left: "5px",
                      }}
                      src={PluggedIcon}
                    />
                  </div>
                )}
                <TextField
                  id="robotIpAddress"
                  disabled={isConnected}
                  label="IP"
                  variant="filled"
                  style={{
                    backgroundColor: "#FFFFFF50",
                    borderRadius: "5px",
                    filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
                    marginRight: "5px",
                  }}
                  defaultValue=""
                  onChange={(e) => setInputVal(e.target.value)}
                />
                {!isConnected && (
                  <DropShadowButton text={"Connect"} clickFunction={confirmIpAddress} />
                )}
                {isConnected && (
                  <DropShadowButton text={"Disconnect"} clickFunction={disconnect} />
                )}
                <IconButton
                  style={{
                    margin: "5px",
                    marginRight: "10px",
                    color: "black",
                    backgroundColor: "#FAFAFA",
                    borderRadius: "10px",
                    filter: "drop-shadow(0px 10px 4px rgba(0,0,0,0.25))",
                  }}
                  onClick={() => {
                    setActiveModal(SETTINGS_MODAL);
                  }}
                >
                  <SettingsIcon />
                </IconButton>
            </Stack>
            {/* <Grid
              container
              direction="row"
              justifyContent={"right"}
              alignItems={"center"}
            >
              <Grid item lg={2} xl={2}>
                
              </Grid>
              <Grid item lg={5} xl={5}>
                
              </Grid>
              <Grid item lg={3} xl={3}>
                
              </Grid>
              <Grid item lg={2} xl={2}>
                
              </Grid>
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
      
    </Grid>
  );
}
