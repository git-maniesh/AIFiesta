"use client";
import { useState } from "react";
import ChatWithInput from "./components/ChatWithInput";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [userPrompts, setUserPrompts] = useState([]);
  const [modelResponse, setModelResponse] = useState({
    metaResponse: [],
    googleResponse: [],
    mistralResponse: [],
    minimaxResponse: [],
  });

  const handleNewChat = () => {
    setUserPrompts([]);
    setModelResponse({
      metaResponse: [],
      googleResponse: [],
      mistralResponse: [],
      minimaxResponse: [],
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
