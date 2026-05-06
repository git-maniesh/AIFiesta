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
        className="flex-1 overflow-y-auto p-4 no-scrollbar scroll-smooth"
      >
        {modelMessage &&
          modelMessage.map((msg, index) => (
            <div key={index} className="flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {msg.role === "user" ? (
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full w-8 h-8 flex-shrink-0 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <Image
                    src={UserIcon}
                    height={20}
                    width={20}
                    alt="user"
                  />
                </div>
              ) : (
                <div className="flex-shrink-0">
                  <img
                    src={imgUrl}
                    height={32}
                    width={32}
                    alt="model"
                    className={clsx(
                      "rounded-lg shadow-md",
                      modelName === "ChatGPT" ? "bg-white p-0.5" : ""
                    )}
                  />
                </div>
              )}
              <div className="text-white text-sm w-full max-w-[92%] overflow-hidden">
                <div className="prose prose-invert max-w-none leading-relaxed">
                  <ReactMarkDown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock,
                      p: ({children}) => <p className="mb-4 text-gray-300 last:mb-0">{children}</p>,
                      h1: ({children}) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white first:mt-0">{children}</h1>,
                      h2: ({children}) => <h2 className="text-xl font-bold mb-3 mt-5 text-white first:mt-0">{children}</h2>,
                      h3: ({children}) => <h3 className="text-lg font-semibold mb-3 mt-4 text-white first:mt-0">{children}</h3>,
                      ul: ({children}) => <ul className="list-disc pl-6 mb-4 space-y-1 text-gray-300">{children}</ul>,
                      ol: ({children}) => <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-300">{children}</ol>,
                      li: ({children}) => <li className="pl-1">{children}</li>,
                      blockquote: ({children}) => (
                        <blockquote className="border-l-4 border-ocean-green bg-ocean-green/5 py-2 pl-4 pr-2 rounded-r-lg italic my-4 text-gray-400">
                          {children}
                        </blockquote>
                      ),
                      table: ({children}) => (
                        <div className="overflow-x-auto my-4 rounded-xl border border-gray-700 shadow-sm">
                          <table className="w-full border-collapse text-left text-xs">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({children}) => <thead className="bg-gray-800/80">{children}</thead>,
                      th: ({children}) => <th className="px-4 py-3 font-semibold text-white border-b border-gray-700">{children}</th>,
                      td: ({children}) => <td className="px-4 py-3 border-b border-gray-800 text-gray-300">{children}</td>,
                      a: ({children, href}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-ocean-green hover:underline font-medium">{children}</a>,
                      hr: () => <hr className="my-6 border-gray-800" />,
                      strong: ({children}) => <strong className="font-bold text-white">{children}</strong>,
                    }}
                  >
                    {msg.text}
                  </ReactMarkDown>
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
