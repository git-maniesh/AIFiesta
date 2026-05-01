"use client";

import React, { useState } from "react";
import ChatSection from "./ChatSection";
import {
  CHATGPT_IMG_URL,
  GEMINI_IMG_URL,
  DEEPSEEK_IMG_URL,
} from "../utils/app.constants";
import ChatInput from "./ChatInput";
import {
  handleFetchChatGPTResponse,
  handleFetchDeepSeekResponse,
  handleFetchGeminiResponse,
} from "../services/model.services";

const ChatWithInput = ({ setUserPrompts, modelResponse, setModelResponse }) => {
  const [promptText, setPromptText] = useState("");
  const [modelVisible, setModelVisible] = useState({
    chatgpt: true,
    gemini: true,
    deepseek: true,
  });
  const [modelLoading, setModelLoading] = useState({
    chatgptLoading: false,
    geminiLoading: false,
    deepseekLoading: false,
  });

  const handleIndividualSend = (modelKey, text) => {
    if (modelKey === "chatgpt") {
      setModelLoading((prev) => ({ ...prev, chatgptLoading: true }));
      const history = [...(modelResponse.chatgptResponse || []), { role: "user", text }];
      handleFetchChatGPTResponse(history).then((response) => {
        setModelResponse((prev) => ({
          ...prev,
          chatgptResponse: [...history, { role: "assistant", text: response }],
        }));
        setModelLoading((prev) => ({ ...prev, chatgptLoading: false }));
      }).catch(() => setModelLoading((prev) => ({ ...prev, chatgptLoading: false })));
    } else if (modelKey === "gemini") {
      setModelLoading((prev) => ({ ...prev, geminiLoading: true }));
      const history = [...(modelResponse.geminiResponse || []), { role: "user", text }];
      handleFetchGeminiResponse(history).then((response) => {
        setModelResponse((prev) => ({
          ...prev,
          geminiResponse: [...history, { role: "assistant", text: response }],
        }));
        setModelLoading((prev) => ({ ...prev, geminiLoading: false }));
      }).catch(() => setModelLoading((prev) => ({ ...prev, geminiLoading: false })));
    } else if (modelKey === "deepseek") {
      setModelLoading((prev) => ({ ...prev, deepseekLoading: true }));
      const history = [...(modelResponse.deepseekResponse || []), { role: "user", text }];
      handleFetchDeepSeekResponse(history).then((response) => {
        setModelResponse((prev) => ({
          ...prev,
          deepseekResponse: [...history, { role: "assistant", text: response }],
        }));
        setModelLoading((prev) => ({ ...prev, deepseekLoading: false }));
      }).catch(() => setModelLoading((prev) => ({ ...prev, deepseekLoading: false })));
    }
  };

  return (
    <div className="bg-cod-gray2 flex flex-col w-full h-screen">
      <div className="flex flex-1 overflow-hidden">
        <ChatSection
        modelName={"ChatGPT"}
        imgUrl={CHATGPT_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.chatgptResponse}
        loading={modelLoading.chatgptLoading}
        onSend={(text) => handleIndividualSend("chatgpt", text)}
      />
      <ChatSection
        modelName={"Gemini"}
        imgUrl={GEMINI_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.geminiResponse}
        loading={modelLoading.geminiLoading}
        onSend={(text) => handleIndividualSend("gemini", text)}
      />
      <ChatSection
        modelName={"DeepSeek"}
        imgUrl={DEEPSEEK_IMG_URL}
        modelVisible={modelVisible}
        setModelVisible={setModelVisible}
        promptText={promptText}
        modelMessage={modelResponse.deepseekResponse}
        loading={modelLoading.deepseekLoading}
        onSend={(text) => handleIndividualSend("deepseek", text)}
      />
      </div>
      <div className="p-4 bg-cod-gray border-t border-mine-shaft">
        <ChatInput
        setUserPrompts={setUserPrompts}
        setPromptText={setPromptText}
        setModelResponse={setModelResponse}
        setModelLoading={setModelLoading}
        modelVisible={modelVisible}
        modelResponse={modelResponse}
      />
      </div>
    </div>
  );
};

export default ChatWithInput;

