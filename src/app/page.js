"use client";
import { useState } from "react";
import ChatSection from "./components/ChatSection";
import ChatWithInput from "./components/ChatWithInput";
import Sidebar from "./components/Sidebar";

const App = () => {
  const [userPrompts, setUserPrompts] = useState([]);
  return (
    <div className="flex h-screen bg-cod-gray">
      <Sidebar userPrompts={userPrompts} />
      <ChatWithInput setUserPrompts={setUserPrompts} />
    </div>
  );
};

export default App;
