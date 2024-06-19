import { ChatContainer, Message, MessageInput, MessageList } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/themes/default/main.scss";
import React from "react";
import useStore from "../Store";
import { useShallow } from "zustand/react/shallow";


export default function ChatBox(props) {
  let chatMessageHistory = useStore(useShallow(state => state.chatMessageHistory));
  let addMessageToHistory = useStore(useShallow(state => state.addMessageToHistory));

  return (
    <ChatContainer 
      style={{
        height: '100%'
      }}
    >
      <MessageList>
        {chatMessageHistory.map((message, i) => {
          return <Message
            className="myMessageStyle"
            model={{
                direction: message.role === "user" ? 'outgoing' : 'incoming',
                message: message.content,
                position: 'single'
            }}
          />
        })}
      </MessageList>
      <MessageInput placeholder="Type message here" attachButton={false} onSend={addMessageToHistory}/>
    </ChatContainer>
  );
}
