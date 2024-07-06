import {
  ChatContainer,
  Message,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/themes/default/main.scss";
import "./chatbox.css"; // Assuming index.css is renamed to App.css
import React, { useCallback, useEffect, useState } from "react";
import useStore from "../Store";
import { default as MistyLogo } from "../svgs/misty.svg";
import { Grid, Stack } from "@mui/material";
import { useShallow } from "zustand/react/shallow";

export default function MistyChatBubble({}) {
  const [msg, setMessage] = useState("");
  // Do not remove time. For some reason, none of this works without it.
  const [tTime, setTime] = useState(new Date());
  let speechObject = useStore(state => state.speechObject);
  let clock = useStore(useShallow(state => state.clock));

  // Update 4 times a second, get the time, set the appropriate message, and update tTime because reasons
  useEffect(() => {
    let temp;
    if (typeof speechObject.value !== typeof "") {
      temp = setInterval(() =>  { const time = clock.getElapsed() * 1000; setMessage(speechObject.value(time)); setTime(new Date()); }, 250);
    } else {
      temp = setInterval(() =>  { const time = clock.getElapsed() * 1000; setMessage(""); setTime(new Date()); }, 250);
    }
    return () => clearInterval(temp);
  }, [speechObject])

  return (
    <div>
      {msg !== "" && <Stack direction="row">
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
                message: msg,
                position: "single",
              }}
            />
          </MessageList>
        </ChatContainer>
        <img
            style={{
              width: "5vw",
              height: "5vh",
              alignSelf: "end",
              zIndex: 101,
            }}
            src={MistyLogo}
          />
      </Stack>}
    </div>
  );
}
