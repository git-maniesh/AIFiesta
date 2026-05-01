"use client";
import { useState } from "react";
import ChatWithInput from "./components/ChatWithInput";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [userPrompts, setUserPrompts] = useState([]);
  const [modelResponse, setModelResponse] = useState({
    chatgptResponse: [],
    geminiResponse: [],
    deepseekResponse: [],
  });

  const handleNewChat = () => {
    setUserPrompts([]);
    setModelResponse({
      chatgptResponse: [],
      geminiResponse: [],
      deepseekResponse: [],
    });
  };

  return (
    <div className="flex h-screen bg-cod-gray">
      <Sidebar userPrompts={userPrompts} onNewChat={handleNewChat} />
      <ChatWithInput 
        setUserPrompts={setUserPrompts} 
        modelResponse={modelResponse}
        setModelResponse={setModelResponse}
      />
    </div>
  );
};

export default App;
