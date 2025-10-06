import Image from "next/image";
import React from "react";
import GptImg from "../../../public/models/gpt.png";
import ChatIcon from "../../../public/chat.svg";
import OpenChatIcon from "../../../public/chat.svg";
import UserIcon from "../../../public/user2.svg";
import ReactMarkDown from "react-markdown";

import { Switch } from "./ui/Switch";
import { CHATGPT_IMG_URL, DUMMY_RESPONSE } from "../utils/app.constants";
import clsx from "clsx";
import Spinner from "./ui/Spinner";

// import {CHATGPT_IMG_URL} from '../utils/app.constants'

const ChatSection = ({
  modelName,
  imgUrl,
  modelVisible,
  setModelVisible,
  promptText,
  modelMessage,
  loading,
}) => {
  const modelKey = modelName.toLowerCase();
  const isVisible = modelVisible[modelKey];
  const handleToggleVisibility = () => {
    setModelVisible((prev) => {
      return {
        ...prev,
        [modelKey]: !modelVisible[modelKey],
      };
    });
  };
  const handleSingleChat = (modelKey) => {
    // console.log("open");
    // close other models except the current one
    const currentModelState = { ...modelVisible };
    const isThisSingleChatOpen =
      Object.values(modelVisible).filter(Boolean).length === 1;
    if (isThisSingleChatOpen) {
      for (const key in currentModelState) {
        currentModelState[key] = true;
      }
    } else {
      for (const key in currentModelState) {
        if (key !== modelKey) {
          currentModelState[key] = false;
        }
      }
    }

    setModelVisible(currentModelState);
  };

  if (!isVisible) {
    return (
      <div className="w-[10rem] flex items-center flex-col justify-start border-r border-l border-mine-shaft">
        <div className="bg-cod-gray w-full p-4 flex items-center justify-center flex-col gap-4">
          <Image
            src={imgUrl}
            height={32}
            width={32}
            alt="ModelIcon"
            className={modelName === "ChatGPT" ? "bg-white" : ""}
          />
          <Image
            src={OpenChatIcon}
            height={22}
            width={22}
            alt="ModelIcon"
            onClick={handleToggleVisibility}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-screen border-r border-l border-mine-shaft">
      <div className="bg-cod-gray border-b border-mine-shaft flex items-center justify-between p-4 text-white">
        <div className="flex items-center justify-center gap-2">
          {/* <img src={imgUrl} className="h-6 w-6" alt="ChatGPTImg" /> */}
          <Image
            src={imgUrl}
            width={20}
            height={20}
            alt="GPTLogo"
            className={modelName === "ChatGPT" ? "bg-white" : ""}
          />
          <span>{modelName}</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Image
            src={ChatIcon}
            width={20}
            height={20}
            alt="ChatLogo"
            className="cursor-pointer"
            onClick={() => handleSingleChat(modelKey)}
          />
          <Switch
            checked={isVisible}
            onCheckedChange={handleToggleVisibility}
            className="cursor-pointer"
          />
        </div>
      </div>
      <div className="p-4">
        {promptText ? (
          <div className="flex items-center justify-start gap-2">
            <div className="bg-purple-500 flex items-center justify-center rounded-full w-7 h-7">
              <Image src={UserIcon} height={22} width={22} alt="userIcon" />
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm">{promptText}</span>
              {loading ? <Spinner className="text-white" /> : null}
            </div>
          </div>
        ) : null}

        <div className="flex items-start mt-8 gap-2 h-[30rem] no-scrollbar overflow-y-scroll">
          {/* {modelMessage ? (
            <Image
              src={imgUrl}
              height={32}
              width={32}
              alt="userIcon"
              className={clsx(
                "flex-shrink-0",
                modelName === "ChatGPT" ? "bg-white" : ""
              )}
            />
          ) : null} */}

          <div className="text-white text-sm">
            {/* <div className="[&>p]:mb:2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:mb-3 [&>h2]:mb:3"> */}
              {/* <ReactMarkDown>{modelMessage}</ReactMarkDown> */}
              {/*  */}
              {modelMessage &&
                modelMessage.map((msg, index) => (
                  <div key={index} className="flex items-start gap-2 mb-2">
                    {msg.role === "user" ? (
                      <div className="bg-purple-500 rounded-full w-7 h-7 flex items-center justify-center">
                        <Image
                          src={UserIcon}
                          height={22}
                          width={22}
                          alt="user"
                        />
                      </div>
                    ) : (
                      <Image src={imgUrl} height={32} width={32} alt="model" />
                    )}
                    <div className="text-white text-sm max-w-[80%]">
                     <div className="[&>p]:mb:2 [&>ul]:mb-2 [&>ol]:mb-2 [&>h1]:mb-3 [&>h2]:mb:3"> 
                      <ReactMarkDown>{msg.text}</ReactMarkDown>
                      </div>
                    </div>
                  </div>
                ))}


                
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
