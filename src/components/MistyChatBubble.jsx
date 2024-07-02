import {
  ChatContainer,
  Message,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/themes/default/main.scss";
import "./chatbox.css"; // Assuming index.css is renamed to App.css
import React from "react";
import useStore from "../Store";
import { default as MistyLogo } from "../svgs/misty.svg";
import { Grid } from "@mui/material";

export default function MistyChatBubble({}) {
  return (
    <Grid container alignItems={"center"}>
      <Grid item xs={10}>
        <ChatContainer
          style={{
            backgroundColor: "transparent",
          }}
        >
          <MessageList style={{ backgroundColor: "transparent" }}>
            <Message
              className={"my-outgoing-message no-margin-message"}
              model={{
                direction: "outgoing",
                message: "This is a wonderful test message",
                position: "single",
              }}
            />
          </MessageList>
        </ChatContainer>
      </Grid>
      <Grid item xs={2}>
        <img
          style={{
            width: "100%",
            height: "100%",
            zIndex: 101,
          }}
          src={MistyLogo}
        />
      </Grid>
    </Grid>
  );
}
