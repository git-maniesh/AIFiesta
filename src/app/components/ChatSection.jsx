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
import { Copy, Check, Terminal } from "lucide-react";

const CodeBlock = ({ node, inline, className, children, ...props }) => {
  const [copied, setCopied] = React.useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const codeContent = String(children).replace(/\n$/, "");

  const handleCopy = () => {
    navigator.clipboard.writeText(codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (inline) {
    return (
      <code className="bg-gray-800 text-green-400 px-1.5 py-0.5 rounded font-mono text-[0.85em]" {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="group relative my-4 rounded-xl overflow-hidden border border-gray-700 bg-gray-900/50">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/80 border-b border-gray-700">
        <div className="flex items-center gap-2 text-gray-400 text-xs font-mono uppercase tracking-wider">
          <Terminal size={14} />
          {language || "code"}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs"
        >
          {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <pre className="text-sm font-mono leading-relaxed text-gray-200">
          <code className={className}>{children}</code>
        </pre>
      </div>
    </div>
  );
};

const ChatSection = ({
  modelName,
  imgUrl,
  modelVisible,
  setModelVisible,
  promptText,
  modelMessage,
  loading,
  onSend,
  onStop,
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
    <div className="flex-1 min-w-0 h-full border-r border-l border-mine-shaft flex flex-col transition-all duration-300 overflow-hidden">
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
          <span className="font-semibold tracking-tight">{modelName}</span>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Image
            src={ChatIcon}
            width={20}
            height={20}
            alt="ChatLogo"
            className="cursor-pointer hover:scale-110 transition-transform"
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
        className="flex-1 overflow-y-auto p-4 no-scrollbar scroll-smooth bg-[#121212]/50"
      >
        {modelMessage &&
          modelMessage.map((msg, index) => (
            <div key={index} className="flex items-start gap-4 mb-8 group animate-in fade-in slide-in-from-bottom-2 duration-500">
              {msg.role === "user" ? (
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-full w-9 h-9 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-2 ring-white/10">
                  <Image
                    src={UserIcon}
                    height={20}
                    width={20}
                    alt="user"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={imgUrl}
                      height={36}
                      width={36}
                      alt="model"
                      className={clsx(
                        "rounded-xl shadow-xl border border-white/10 transition-transform group-hover:scale-105",
                        modelName === "ChatGPT" ? "bg-white p-1" : "bg-[#1e1e1e]"
                      )}
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212] animate-pulse"></div>
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className={clsx(
                  "text-[15px] leading-relaxed tracking-wide",
                  msg.role === "user" ? "text-white/90 whitespace-pre-wrap font-medium bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/5" : "text-gray-200"
                )}>
                  {msg.role === "user" ? (
                    msg.text
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      <ReactMarkDown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code: CodeBlock,
                          p: ({children}) => <p className="mb-5 text-gray-300/90 leading-7 last:mb-0">{children}</p>,
                          h1: ({children}) => <h1 className="text-2xl font-bold mb-6 mt-8 text-white tracking-tight border-b border-white/10 pb-2 first:mt-0">{children}</h1>,
                          h2: ({children}) => <h2 className="text-xl font-semibold mb-4 mt-6 text-white tracking-tight first:mt-0">{children}</h2>,
                          h3: ({children}) => <h3 className="text-lg font-semibold mb-3 mt-5 text-white/90 first:mt-0">{children}</h3>,
                          ul: ({children}) => <ul className="list-disc pl-6 mb-5 space-y-2 text-gray-300/80">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal pl-6 mb-5 space-y-2 text-gray-300/80">{children}</ol>,
                          li: ({children}) => <li className="pl-1 leading-relaxed">{children}</li>,
                          blockquote: ({children}) => (
                            <blockquote className="border-l-4 border-purple-500 bg-purple-500/5 py-3 pl-5 pr-3 rounded-r-xl italic my-6 text-gray-300 shadow-inner">
                              {children}
                            </blockquote>
                          ),
                          table: ({children}) => (
                            <div className="overflow-x-auto my-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-xl">
                              <table className="w-full border-collapse text-left text-sm">
                                {children}
                              </table>
                            </div>
                          ),
                          thead: ({children}) => <thead className="bg-white/10">{children}</thead>,
                          th: ({children}) => <th className="px-5 py-3.5 font-bold text-white border-b border-white/10 uppercase text-xs tracking-wider">{children}</th>,
                          td: ({children}) => <td className="px-5 py-4 border-b border-white/5 text-gray-300 transition-colors hover:bg-white/5">{children}</td>,
                          a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-2 transition-colors font-medium">{children}</a>,
                          hr: () => <hr className="my-8 border-white/10" />,
                          strong: ({children}) => <strong className="font-bold text-white shadow-white/10">{children}</strong>,
                        }}
                      >
                        {msg.text}
                      </ReactMarkDown>
                    </div>
                  )}
                </div>
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
        <div className="flex items-end bg-gray-800 border border-gray-600 rounded-xl p-1.5 gap-2">
          <textarea
            rows="1"
            value={localText}
            onChange={(e) => {
              setLocalText(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (e.shiftKey) {
                  return; // Allow new line
                }
                e.preventDefault();
                if (localText.trim()) {
                  onSend(localText);
                  setLocalText("");
                  e.target.style.height = "auto";
                }
              }
            }}
            placeholder={`Ask ${modelName}...`}
            className="flex-1 outline-none text-white bg-transparent px-3 py-1.5 text-sm resize-none max-h-[120px] overflow-y-auto no-scrollbar"
          />
          {loading ? (
            <button
              onClick={onStop}
              className="bg-red-500 p-2 rounded-lg text-white transition flex-shrink-0 mb-0.5 hover:bg-red-600 cursor-pointer"
              title="Stop"
            >
              <div className="w-3.5 h-3.5 bg-white rounded-sm" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (localText.trim()) {
                  onSend(localText);
                  setLocalText("");
                }
              }}
              disabled={!localText.trim()}
              className={clsx(
                "bg-ocean-green p-2 rounded-lg text-white transition flex-shrink-0 mb-0.5",
                localText.trim()
                  ? "hover:bg-green-600 cursor-pointer"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <Image src={SendIcon} width={14} height={14} alt="SendIcon" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
