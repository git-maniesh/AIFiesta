import Image from "next/image";
import React, { useRef, useEffect } from "react";
import ChatIcon from "../../../public/chat.svg";
import OpenChatIcon from "../../../public/chat.svg";
import UserIcon from "../../../public/user2.svg";
import SendIcon from "../../../public/send.svg";
import ReactMarkDown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Switch } from "./ui/Switch";
import clsx from "clsx";
import Spinner from "./ui/Spinner";

const ChatSection = ({
  modelName,
  imgUrl,
  modelVisible,
  setModelVisible,
  promptText,
  modelMessage,
  loading,
  onSend,
}) => {
  const [localText, setLocalText] = React.useState("");
  const modelKey = modelName.toLowerCase();
  const isVisible = modelVisible[modelKey];
  const scrollRef = useRef(null);

  // Auto-scroll to the latest message whenever modelMessage or loading changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [modelMessage, loading]);

  const handleToggleVisibility = () => {
    setModelVisible((prev) => {
      return {
        ...prev,
        [modelKey]: !modelVisible[modelKey],
      };
    });
  };
  const handleSingleChat = (modelKey) => {
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
          <img
            src={imgUrl}
            height={32}
            width={32}
            alt="ModelIcon"
            className={clsx("rounded", modelName === "ChatGPT" ? "bg-white" : "")}
          />
          <Image
            src={OpenChatIcon}
            height={22}
            width={22}
            alt="ModelIcon"
            className="cursor-pointer"
            onClick={handleToggleVisibility}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full h-full border-r border-l border-mine-shaft flex flex-col">
      {/* Header */}
      <div className="bg-cod-gray border-b border-mine-shaft flex items-center justify-between p-4 text-white flex-shrink-0">
        <div className="flex items-center justify-center gap-2">
          <img
            src={imgUrl}
            width={20}
            height={20}
            alt="GPTLogo"
            className={clsx("rounded", modelName === "ChatGPT" ? "bg-white" : "")}
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

      {/* Messages Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 no-scrollbar"
      >
        {modelMessage &&
          modelMessage.map((msg, index) => (
            <div key={index} className="flex items-start gap-3 mb-5">
              {msg.role === "user" ? (
                <div className="bg-purple-500 rounded-full w-7 h-7 flex-shrink-0 flex items-center justify-center">
                  <Image
                    src={UserIcon}
                    height={18}
                    width={18}
                    alt="user"
                  />
                </div>
              ) : (
                <img
                  src={imgUrl}
                  height={28}
                  width={28}
                  alt="model"
                  className={clsx(
                    "flex-shrink-0 rounded",
                    modelName === "ChatGPT" ? "bg-white" : ""
                  )}
                />
              )}
              <div className="text-white text-sm w-full max-w-[90%] overflow-hidden">
                <div className="leading-relaxed [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mb-1 [&_h1]:mb-4 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_pre]:bg-gray-800 [&_pre]:p-3 [&_pre]:rounded-md [&_pre]:overflow-x-auto [&_pre]:mb-4 [&_pre]:text-sm [&_code]:bg-gray-800 [&_code]:text-green-300 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_blockquote]:border-l-4 [&_blockquote]:border-gray-500 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:mb-4 [&_table]:w-full [&_table]:border-collapse [&_table]:mb-4 [&_th]:border [&_th]:border-gray-600 [&_th]:bg-gray-800 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_td]:border [&_td]:border-gray-700 [&_td]:px-3 [&_td]:py-2 [&_td]:text-xs [&_strong]:font-bold [&_em]:italic [&_a]:text-blue-400 [&_a]:underline [&_hr]:border-gray-600 [&_hr]:my-4">
                  <ReactMarkDown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkDown>
                </div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.text)}
                    className="mt-2 text-xs bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition cursor-pointer"
                  >
                    📋 Copy
                  </button>
                )}
              </div>
            </div>
          ))}

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center gap-2 mt-2">
            <img
              src={imgUrl}
              height={24}
              width={24}
              alt="model"
              className={clsx("rounded", modelName === "ChatGPT" ? "bg-white" : "")}
            />
            <Spinner className="text-white" />
          </div>
        )}
      </div>

      {/* Individual Input */}
      <div className="p-3 border-t border-mine-shaft flex-shrink-0">
        <div className="flex items-center bg-gray-800 border border-gray-600 rounded-xl p-1.5 gap-2">
          <input
            type="text"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && localText.trim()) {
                onSend(localText);
                setLocalText("");
                e.preventDefault();
              }
            }}
            placeholder={`Ask ${modelName} specifically...`}
            className="flex-1 outline-none text-white bg-transparent px-3 py-1.5 text-sm"
          />
          <button
            onClick={() => {
              if (localText.trim()) {
                onSend(localText);
                setLocalText("");
              }
            }}
            disabled={!localText.trim()}
            className={clsx(
              "bg-ocean-green p-2 rounded-lg text-white transition flex-shrink-0",
              localText.trim()
                ? "hover:bg-green-600 cursor-pointer"
                : "opacity-50 cursor-not-allowed"
            )}
          >
            <Image src={SendIcon} width={14} height={14} alt="SendIcon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
