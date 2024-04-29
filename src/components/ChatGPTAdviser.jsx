import { useState } from 'react'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';


const API_KEY="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";


const ChatGPTAdviser = (props) => {
    const metricname = props.metricname;
    const value = props.value;

    const [messages, setMessages] = useState([
        {
          message: "Hello, I'm ChatGPT!Click the Info AI buton",
          sentTime: "just now",
          sender: "ChatGPT"
        }
      ]);
      const [isTyping, setIsTyping] = useState(false);


      const handleSend = async (metricname,value) => {
        const newMessage = {
          message:metricname+ " has value "+value+" what impact does it have for this point?",
          direction: 'outgoing',
          sender: "user"
        };
    
        const newMessages = [...messages, newMessage];
        
        setMessages(newMessages);
    
        // Initial system message to determine ChatGPT functionality
        // How it responds, how it talks, etc.
        setIsTyping(true);
        await processMessageToChatGPT(newMessages);
      };


      async function processMessageToChatGPT(chatMessages){
        // chatmessages  
        let apiMessages = chatMessages.map((messageObject)=>{
          let role="";
          if (messageObject.sender === "ChatGPT"){
            role="assistant"
          } else {
            role="user"
          }
            return { role:role,content:messageObject.message}
        });
    
        const systemMessage = {
          role:"system",
          content:"Explain all concepts like a epidemologist."
        }
    
        const apiRequestBody ={
          "model":"gpt-3.5-turbo",
          "messages":[
            systemMessage,
            ...apiMessages
          ]
        }
    
        await fetch("https://api.openai.com/v1/chat/completions",{
          method:"POST",
          headers:{
            "Authorization":"Bearer "+ API_KEY,
            "Content-Type":"application/json"
          },
          body:JSON.stringify(apiRequestBody)
        }).then((data)=>{
          return data.json();
        }).then((data)=>{
          console.log(data);
          console.log(data.choices[0].message.content);
          setMessages(
            [...chatMessages,{
              message:data.choices[0].message.content,
              sender:"ChatGPT"
            }]
          );
          setIsTyping(false);
        });
      }
    


  return (
<div>
<button onClick={() => handleSend(metricname,value)}>Info AI</button>

            <h3>   {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
              
            </h3>

</div>
  );
};

export default ChatGPTAdviser;
