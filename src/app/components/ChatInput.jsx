

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

  useEffect(() => {
    adjustHeight();
  }, [userText]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
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

    setUserText("");
    removeFile();
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    
    // Call all 4 models individually based on visibility
    if (modelVisible.meta) onSendAll("meta", currentText);
    if (modelVisible.google) onSendAll("google", currentText);
    if (modelVisible.mistral) onSendAll("mistral", currentText);
    if (modelVisible.minimax) onSendAll("minimax", currentText);
  };

  const isLoading = 
    modelLoading.metaLoading || 
    modelLoading.googleLoading || 
    modelLoading.mistralLoading || 
    modelLoading.minimaxLoading;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2">
      {filePreview && (
        <div className="flex items-center justify-between bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-3">
            {file.type && file.type.startsWith("image/") ? (
              <img src={filePreview} alt="preview" className="h-12 w-12 object-cover rounded-lg shadow-lg" />
            ) : (
              <div className="bg-white/10 p-2 rounded-lg"><span className="text-white text-xs truncate max-w-[200px] block">{filePreview}</span></div>
            )}
          </div>
          <button className="text-gray-400 hover:text-red-500 transition-colors p-1" onClick={removeFile}>✕</button>
        </div>
      )}

      <div className="flex items-end bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 gap-2 shadow-2xl relative group focus-within:border-white/20 transition-all">
        <textarea
          ref={textareaRef}
          rows="1"
          value={userText}
          className="flex-1 outline-none text-white bg-transparent px-4 py-2.5 rounded-l-2xl resize-none max-h-[200px] overflow-y-auto no-scrollbar text-sm placeholder:text-gray-500"
          placeholder="Ask Meta, Google, Mistral, and MiniMax..."
          onChange={(e) => {
            setUserText(e.target.value);
            e.target.style.height = "auto";
            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if ((userText.trim() || file) && !isLoading) handleSendPrompt();
            }
          }}
        />

        <div className="flex items-center gap-2 mb-1 mr-1">
          <label className="bg-white/5 hover:bg-white/10 p-2.5 rounded-xl cursor-pointer flex-shrink-0 transition-all border border-white/5">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <span className="text-lg opacity-70 group-hover:opacity-100">📎</span>
          </label>

          {isLoading ? (
            <button
              className="bg-red-500/90 hover:bg-red-600 p-3 rounded-xl flex-shrink-0 transition-all shadow-lg shadow-red-500/20"
              onClick={onStopAll}
              title="Stop All Generations"
            >
              <div className="w-4 h-4 bg-white rounded-sm" />
            </button>
          ) : (
            <button
              className={clsx(
                "p-3 rounded-xl flex-shrink-0 transition-all duration-300 shadow-lg",
                !userText.trim() && !file 
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed opacity-50" 
                  : "bg-gradient-to-br from-ocean-green to-emerald-600 text-white cursor-pointer hover:shadow-emerald-500/20 active:scale-95"
              )}
              disabled={!userText.trim() && !file}
              onClick={handleSendPrompt}
            >
              <Image src={SendIcon} width={18} height={18} alt="Send" />
            </button>
          )}
        </div>
      </div>
      
      <div className="text-[10px] text-gray-500 flex justify-end px-3 gap-3 opacity-60">
        <span><b>Meta, Google, Mistral, MiniMax</b> are ready</span>
        <span><b>Enter</b> to send</span>
      </div>
    </div>
  );
};

export default ChatInput;
