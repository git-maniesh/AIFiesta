"use client";

import React, { useState, useRef } from "react";
import ChatSection from "./ChatSection";
import {
  META_IMG_URL,
  GOOGLE_IMG_URL,
  MISTRAL_IMG_URL,
  MINIMAX_IMG_URL,
} from "../utils/app.constants";
import ChatInput from "./ChatInput";
import {
  handleFetchMetaResponse,
  handleFetchGoogleResponse,
  handleFetchMistralResponse,
  handleFetchMiniMaxResponse,
} from "../services/model.services";

const ChatWithInput = ({ userPrompts, setUserPrompts }) => {
  const [promptText, setPromptText] = useState("");
  
  // Separate states for each model to ensure independent, fast rendering
  const [metaHistory, setMetaHistory] = useState([]);
  const [googleHistory, setGoogleHistory] = useState([]);
  const [mistralHistory, setMistralHistory] = useState([]);
  const [minimaxHistory, setMinimaxHistory] = useState([]);

  const [metaLoading, setMetaLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [mistralLoading, setMistralLoading] = useState(false);
  const [minimaxLoading, setMinimaxLoading] = useState(false);

  const [modelVisible, setModelVisible] = useState({
    meta: true,
    google: true,
    mistral: true,
    minimax: true,
  });

  const abortControllers = useRef({
    meta: null,
    google: null,
    mistral: null,
    minimax: null,
  });

  const stopModelGeneration = (modelKey) => {
    if (abortControllers.current[modelKey]) {
      abortControllers.current[modelKey].abort();
      abortControllers.current[modelKey] = null;
      const loadingSetter = getLoadingSetter(modelKey);
      if (loadingSetter) loadingSetter(false);
    }
  };

  const getHistory = (modelKey) => {
    if (modelKey === "meta") return metaHistory;
    if (modelKey === "google") return googleHistory;
    if (modelKey === "mistral") return mistralHistory;
    if (modelKey === "minimax") return minimaxHistory;
    return [];
  };

  const getSetter = (modelKey) => {
    if (modelKey === "meta") return setMetaHistory;
    if (modelKey === "google") return setGoogleHistory;
    if (modelKey === "mistral") return setMistralHistory;
    if (modelKey === "minimax") return setMinimaxHistory;
    return null;
  };

  const getLoadingSetter = (modelKey) => {
    if (modelKey === "meta") return setMetaLoading;
    if (modelKey === "google") return setGoogleLoading;
    if (modelKey === "mistral") return setMistralLoading;
    if (modelKey === "minimax") return setMinimaxLoading;
    return null;
  };

  const handleIndividualSend = async (modelKey, text) => {
    stopModelGeneration(modelKey);
    const controller = new AbortController();
    abortControllers.current[modelKey] = controller;

    const currentHistory = getHistory(modelKey);
    const updatedWithUser = [...currentHistory, { role: "user", text }];
    const setter = getSetter(modelKey);
    const loadingSetter = getLoadingSetter(modelKey);

    setter([...updatedWithUser, { role: "assistant", text: "" }]);
    if (loadingSetter) loadingSetter(true);

    let fetchFunc;
    if (modelKey === "meta") fetchFunc = handleFetchMetaResponse;
    else if (modelKey === "google") fetchFunc = handleFetchGoogleResponse;
    else if (modelKey === "mistral") fetchFunc = handleFetchMistralResponse;
    else if (modelKey === "minimax") fetchFunc = handleFetchMiniMaxResponse;

    const onChunk = (chunkText) => {
      setter([...updatedWithUser, { role: "assistant", text: chunkText }]);
    };

    if (fetchFunc) {
      fetchFunc(updatedWithUser, controller.signal, onChunk)
        .finally(() => {
          if (loadingSetter) loadingSetter(false);
          abortControllers.current[modelKey] = null;
        });
    }
  };

  return (
    <div className="bg-cod-gray2 flex flex-col flex-1 min-h-screen h-screen overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <ChatSection
          modelName={"Meta"}
          imgUrl={META_IMG_URL}
          modelVisible={modelVisible}
          setModelVisible={setModelVisible}
          modelMessage={metaHistory}
          loading={metaLoading}
          onSend={(text) => handleIndividualSend("meta", text)}
          onStop={() => stopModelGeneration("meta")}
        />
        <ChatSection
          modelName={"Google"}
          imgUrl={GOOGLE_IMG_URL}
          modelVisible={modelVisible}
          setModelVisible={setModelVisible}
          modelMessage={googleHistory}
          loading={googleLoading}
          onSend={(text) => handleIndividualSend("google", text)}
          onStop={() => stopModelGeneration("google")}
        />
        <ChatSection
          modelName={"Mistral"}
          imgUrl={MISTRAL_IMG_URL}
          modelVisible={modelVisible}
          setModelVisible={setModelVisible}
          modelMessage={mistralHistory}
          loading={mistralLoading}
          onSend={(text) => handleIndividualSend("mistral", text)}
          onStop={() => stopModelGeneration("mistral")}
        />
        <ChatSection
          modelName={"MiniMax"}
          imgUrl={MINIMAX_IMG_URL}
          modelVisible={modelVisible}
          setModelVisible={setModelVisible}
          modelMessage={minimaxHistory}
          loading={minimaxLoading}
          onSend={(text) => handleIndividualSend("minimax", text)}
          onStop={() => stopModelGeneration("minimax")}
        />
      </div>

      <div className="p-4 bg-gradient-to-t from-cod-gray2 via-cod-gray2/90 to-transparent">
        <ChatInput
          setUserPrompts={setUserPrompts}
          setPromptText={setPromptText}
          modelVisible={modelVisible}
          modelLoading={{
            metaLoading,
            googleLoading,
            mistralLoading,
            minimaxLoading
          }}
          onStopAll={() => {
            stopModelGeneration("meta");
            stopModelGeneration("google");
            stopModelGeneration("mistral");
            stopModelGeneration("minimax");
          }}
          onSendAll={handleIndividualSend}
        />
      </div>
    </div>
  );
};

export default ChatWithInput;
