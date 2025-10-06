"use client";

import React, { useState } from "react";
import ChatSection from "./ChatSection";
import {
  CHATGPT_IMG_URL,
  GEMINI_IMG_URL,
  DEEPSEEK_IMG_URL,
} from "../utils/app.constants";
import ChatInput from "./ChatInput";

const ChatWithInput = ({ setUserPrompts }) => {
  const [promptText, setPromptText] = useState("");
  const [modelVisible, setModelVisible] = useState({
    chatgpt: true,
    gemini: true,
    deepseek: true,
  });

  const [modelResponse, setModelResponse] = useState({
    chatgptResponse: [], // now an array of messages
    geminiResponse: [],
    deepseekResponse: [],
  });
  const [modelLoading, setModelLoading] = useState({
    chatgptLoading: false,
    geminiLoading: false,
    deepseekLoading: false,
  });
  return (
    <div className="bg-cod-gray2 flex w-full">
      <ChatSection
        modelName={"ChatGPT"}
        imgUrl={CHATGPT_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.chatgptResponse}
        loading={modelLoading.chatgptLoading}
      />
      <ChatSection
        modelName={"Gemini"}
        imgUrl={GEMINI_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.geminiResponse}
        loading={modelLoading.geminiLoading}
      />
      <ChatSection
        modelName={"DeepSeek"}
        imgUrl={DEEPSEEK_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.deepseekResponse}
        loading={modelLoading.deepseekLoading}
      />
      <ChatInput
        setUserPrompts={setUserPrompts}
        setPromptText={setPromptText}
        setModelResponse={setModelResponse}
        setModelLoading={setModelLoading}
        modelVisible={modelVisible}
      />
    </div>
  );
};

export default ChatWithInput;

