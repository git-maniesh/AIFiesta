

import Image from "next/image";
import React, { useState } from "react";
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
}) => {
  const [userText, setUserText] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

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

    const fileData = file ? { name: file.name, type: file.type } : null;

    // Clear input and file
    setUserText("");
    removeFile();

    // Call models individually based on visibility
    if (modelVisible.gemini) {
      setModelLoading((prev) => ({ ...prev, geminiLoading: true }));
      const geminiHistory = [
        ...(modelResponse?.geminiResponse || []),
        { role: "user", text: userText }
      ];
      handleFetchGeminiResponse(geminiHistory).then((data) => {
        setModelResponse((prev) => ({
          ...prev,
          geminiResponse: [
            ...(prev.geminiResponse || []),
            { role: "user", text: userText, file: fileData },
            { role: "assistant", text: data },
          ],
        }));
        setModelLoading((prev) => ({ ...prev, geminiLoading: false }));
      }).catch((error) => {
        setModelLoading((prev) => ({ ...prev, geminiLoading: false }));
      });
    }

    if (modelVisible.chatgpt) {
      setModelLoading((prev) => ({ ...prev, chatgptLoading: true }));
      const chatgptHistory = [
        ...(modelResponse?.chatgptResponse || []),
        { role: "user", text: userText }
      ];
      handleFetchChatGPTResponse(chatgptHistory).then((response) => {
        setModelResponse((prev) => ({
          ...prev,
          chatgptResponse: [
            ...(prev.chatgptResponse || []),
            { role: "user", text: userText, file: fileData },
            { role: "assistant", text: response },
          ],
        }));
        setModelLoading((prev) => ({ ...prev, chatgptLoading: false }));
      }).catch((error) => {
        setModelLoading((prev) => ({ ...prev, chatgptLoading: false }));
      });
    }

    if (modelVisible.deepseek) {
      setModelLoading((prev) => ({ ...prev, deepseekLoading: true }));
      const deepseekHistory = [
        ...(modelResponse?.deepseekResponse || []),
        { role: "user", text: userText }
      ];
      handleFetchDeepSeekResponse(deepseekHistory).then((response) => {
        setModelResponse((prev) => ({
          ...prev,
          deepseekResponse: [
            ...(prev.deepseekResponse || []),
            { role: "user", text: userText, file: fileData },
            { role: "assistant", text: response },
          ],
        }));
        setModelLoading((prev) => ({ ...prev, deepseekLoading: false }));
      }).catch((error) => {
        setModelLoading((prev) => ({ ...prev, deepseekLoading: false }));
      });
    }
  };

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
      <div className="flex items-center bg-cod-gray border border-mine-shaft rounded-2xl p-2 gap-2">
        <input
          type="text"
          value={userText}
          className="flex-1 outline-none text-white bg-transparent px-3 py-2 rounded-l-2xl"
          placeholder="Ask Me Anything..."
          onChange={(e) => setUserText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (userText.trim() || file)) {
              handleSendPrompt();
              e.preventDefault();
            }
          }}
        />

        {/* File Upload Button */}
        <label className="bg-gray-700 p-2 rounded-md cursor-pointer flex-shrink-0">
          <input type="file" className="hidden" onChange={handleFileChange} />
          📎
        </label>

        {/* Send Button */}
        <button
          className={clsx(
            "bg-ocean-green p-3 rounded-r-2xl flex-shrink-0",
            !userText.trim() && !file ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          disabled={!userText.trim() && !file}
          onClick={handleSendPrompt}
        >
          <Image src={SendIcon} width={20} height={20} alt="SendIcon" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
