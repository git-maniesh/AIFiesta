

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import SendIcon from "../../../public/send.svg";
import clsx from "clsx";
import {
  handleFetchChatGPTResponse,
  handleFetchDeepSeekResponse,
  handleFetchGeminiResponse,
} from "../services/model.services";

const ChatInput = ({
  setUserPrompts,
  setPromptText,
  setModelResponse,
  setModelLoading,
  modelVisible,
  modelResponse,
  modelLoading,
  onStopAll,
  onSendAll,
}) => {
  const [userText, setUserText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const textareaRef = useRef(null);

  // Function to adjust textarea height
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  // Adjust height on mount or whenever text changes (as backup)
  useEffect(() => {
    adjustHeight();
  }, [userText]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // If image, show preview; else, just show filename
    if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(selectedFile.name);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSendPrompt = async () => {
    if (!userText.trim() && !file) return;

    setPromptText(userText);
    setUserPrompts((prev) => [...prev, userText]);

    const currentText = userText;

    // Clear input and file
    setUserText("");
    removeFile();
    
    // Reset height immediately
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    // Call models individually based on visibility
    if (modelVisible.gemini) onSendAll("gemini", currentText);
    if (modelVisible.chatgpt) onSendAll("chatgpt", currentText);
    if (modelVisible.deepseek) onSendAll("deepseek", currentText);
  };

  const isLoading = modelLoading.geminiLoading || modelLoading.chatgptLoading || modelLoading.deepseekLoading;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2">
      {/* File Preview */}
      {filePreview && (
        <div className="flex items-center justify-between bg-gray-700 rounded-lg p-2">
          {file.type && file.type.startsWith("image/") ? (
            <img
              src={filePreview}
              alt="preview"
              className="h-16 w-16 object-cover rounded"
            />
          ) : (
            <span className="text-white truncate max-w-xs">{filePreview}</span>
          )}
          <button
            className="ml-2 text-red-500 font-bold"
            onClick={removeFile}
          >
            ✕
          </button>
        </div>
      )}

      {/* Input + Buttons */}
      <div className="flex items-end bg-cod-gray border border-mine-shaft rounded-2xl p-2 gap-2 relative">
        <textarea
          ref={textareaRef}
          rows="1"
          value={userText}
          className="flex-1 outline-none text-white bg-transparent px-3 py-2 rounded-l-2xl resize-none max-h-[200px] overflow-y-auto no-scrollbar"
          placeholder="Ask Me Anything..."
          onChange={(e) => {
            setUserText(e.target.value);
            // Instant height adjustment
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
          }}
          onKeyDown={(e) => {
            // Enter key handling
            if (e.key === "Enter") {
              // If Shift is pressed, allow the default behavior (new line)
              if (e.shiftKey) {
                return;
              }
              
              // If only Enter is pressed, send the message and prevent new line
              e.preventDefault();
              if ((userText.trim() || file) && !isLoading) {
                handleSendPrompt();
              }
            }
          }}
        />

        <div className="flex items-center gap-2 mb-1">
          {/* File Upload Button */}
          <label className="bg-gray-700/50 hover:bg-gray-700 p-2 rounded-xl cursor-pointer flex-shrink-0 transition-colors">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <span className="text-xl">📎</span>
          </label>

          {/* Send / Stop Button */}
          {isLoading ? (
            <button
              className="bg-red-500 p-3 rounded-xl flex-shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              onClick={onStopAll}
              title="Stop Generation"
            >
              <div className="w-5 h-5 bg-white rounded-sm" /> {/* Stop Icon (Square) */}
            </button>
          ) : (
            <button
              className={clsx(
                "bg-ocean-green p-3 rounded-xl flex-shrink-0 transition-all duration-200",
                !userText.trim() && !file ? "opacity-50 cursor-not-allowed scale-95" : "cursor-pointer hover:scale-105 active:scale-95"
              )}
              disabled={!userText.trim() && !file}
              onClick={handleSendPrompt}
            >
              <Image src={SendIcon} width={20} height={20} alt="SendIcon" />
            </button>
          )}
        </div>
      </div>
      
      {/* Tooltip for keyboard shortcuts */}
      <div className="text-[10px] text-gray-500 flex justify-end px-2">
        <span><b>Enter</b> to send, <b>Shift + Enter</b> for new line</span>
      </div>
    </div>
  );
};

export default ChatInput;
