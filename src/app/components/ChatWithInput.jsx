"use client";

import React, { useState, useRef } from "react";
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

  const abortControllers = useRef({
    chatgpt: null,
    gemini: null,
    deepseek: null,
  });

  const stopModelGeneration = (modelKey) => {
    if (abortControllers.current[modelKey]) {
      abortControllers.current[modelKey].abort();
      abortControllers.current[modelKey] = null;
      setModelLoading((prev) => ({ ...prev, [`${modelKey}Loading`]: false }));
    }
  };

  const handleIndividualSend = (modelKey, text) => {
    const controller = new AbortController();
    abortControllers.current[modelKey] = controller;

    const history = [...(modelResponse[`${modelKey}Response`] || []), { role: "user", text }];
    
    // Initial state with user message and empty assistant message for loading
    setModelResponse((prev) => ({
      ...prev,
      [`${modelKey}Response`]: [...history, { role: "assistant", text: "" }],
    }));
    setModelLoading((prev) => ({ ...prev, [`${modelKey}Loading`]: true }));

    const onChunk = (fullText) => {
      setModelResponse((prev) => {
        const currentHistory = prev[`${modelKey}Response`];
        const updatedHistory = [...currentHistory];
        // The last message is the assistant message we're streaming into
        if (updatedHistory.length > 0) {
          updatedHistory[updatedHistory.length - 1] = {
            ...updatedHistory[updatedHistory.length - 1],
            text: fullText
          };
        }
        return {
          ...prev,
          [`${modelKey}Response`]: updatedHistory,
        };
      });
    };

    let fetchFunc;
    if (modelKey === "chatgpt") fetchFunc = handleFetchChatGPTResponse;
    else if (modelKey === "gemini") fetchFunc = handleFetchGeminiResponse;
    else if (modelKey === "deepseek") fetchFunc = handleFetchDeepSeekResponse;

    if (fetchFunc) {
      fetchFunc(history, controller.signal, onChunk)
        .then((finalResponse) => {
          if (finalResponse === null) return;
          setModelLoading((prev) => ({ ...prev, [`${modelKey}Loading`]: false }));
        })
        .catch(() => setModelLoading((prev) => ({ ...prev, [`${modelKey}Loading`]: false })));
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
          onStop={() => stopModelGeneration("chatgpt")}
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
          onStop={() => stopModelGeneration("gemini")}
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
          onStop={() => stopModelGeneration("deepseek")}
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
          modelLoading={modelLoading}
          onStopAll={() => {
            stopModelGeneration("chatgpt");
            stopModelGeneration("gemini");
            stopModelGeneration("deepseek");
          }}
          onSendAll={handleIndividualSend}
        />
      </div>
    </div>
  );
};

export default ChatWithInput;

