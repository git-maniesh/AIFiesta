const fetchStreamingResponse = async (history, model, signal, onChunk) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal,
      body: JSON.stringify({
        messages: history.map(h => ({ role: h.role, content: h.text })),
        model: model,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      fullText += chunk;
      if (onChunk) onChunk(fullText);
    }

    return fullText;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`${model} request aborted`);
      return null;
    }
    console.error(`${model} API Failed`, error);
    return "Error generating response.";
  }
};

const handleFetchGeminiResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "google/gemma-2-2b-it", signal, onChunk);
};

const handleFetchChatGPTResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "meta/llama-3.1-70b-instruct", signal, onChunk);
};

const handleFetchDeepSeekResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "deepseek-ai/deepseek-v4-flash", signal, onChunk);
};

export {
  handleFetchChatGPTResponse,
  handleFetchDeepSeekResponse,
  handleFetchGeminiResponse,
};
