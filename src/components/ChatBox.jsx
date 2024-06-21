import { ChatContainer, Message, MessageInput, MessageList } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/themes/default/main.scss";
import React from "react";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";
import DropShadowButton from "./DropShadowButton";

const sanitizeMessage = (message) => {
  if (message.includes("[Need Help]")) {
    return "Please help me."
  }
  
  if (message.includes("[Done]")) {
    return "Next phase."
  }
  // if (message.includes("<Suggestion>")) {
  //   let splits = message.split("<Suggestion>");
  //   return splits[0].trim();
  // }
  return message.replaceAll("<Suggestion>", "").replaceAll("</Suggestion>", "").replace("[Summary]", "Summary: ");
}

const parseMessage = (message) => {
  let suggestions = [];
  let splits = message.split("<Suggestion>")
  let firstElement = sanitizeMessage(splits.shift()).trim();
  splits.forEach((elem) => {
    if (elem.includes("</Suggestion>")) {
      let newSplits = elem.split("</Suggestion>");
      suggestions.push(newSplits[0].trim());
      if (newSplits[1].length > 0) {
        firstElement = firstElement.concat(" ", sanitizeMessage(newSplits[1]).trim());
      }
    } else {
      firstElement = firstElement.concat(" ", sanitizeMessage(elem.trim()));
    }
  })
  return [firstElement, suggestions];
}

export default function ChatBox(props) {
  let chatMessageHistory = useStore(useShallow(state => state.chatMessageHistory));
  let addMessageToHistory = useStore(useShallow(state => state.addMessageToHistory));

  
  let chatLength = chatMessageHistory.length;
  let messageAndSuggestions = parseMessage(chatMessageHistory[chatLength-1].content);

  return (
    <ChatContainer 
      style={{
        height: '100%'
      }}
    >
      <MessageList>
        {chatMessageHistory.map((message, i) => {
          // Hide prompt message
          if (i == 0) {
            return
          } else if (i < chatLength - 1) {
            return <Message
              key={i}
              model={{
                  direction: message.role === "user" ? 'outgoing' : 'incoming',
                  message: sanitizeMessage(message.content),
                  position: 'single'
              }}
            />
          }

          return <Message
            key={i}
            model={{
                direction: message.role === "user" ? 'outgoing' : 'incoming',
                message: messageAndSuggestions[0],
                position: 'single'
            }}
          />
        })}
        {messageAndSuggestions[1].length > 0 && 
          <div style={{paddingTop: "5px", paddingBottom: "5px"}}>
            {messageAndSuggestions[1].map((suggestion, index) => {
              return <DropShadowButton 
                key={index} 
                text={suggestion} 
                clickFunction={() => addMessageToHistory(suggestion)}
              />
            })}
          </div>}
        <div style={{right: 0, position: "absolute"}}>
          <DropShadowButton
              key={"next-phase-btn"} 
              text={"Next Phase"} 
              clickFunction={() => addMessageToHistory("[Done]")}
            />
        </div>
      </MessageList>
      <MessageInput placeholder="Type message here" attachButton={false} onSend={addMessageToHistory}/>
    </ChatContainer>
  );
}
