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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";
    let lastUpdate = Date.now();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer) {
          fullText += buffer;
          if (onChunk) onChunk(fullText);
        }
        break;
      }

      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;

      const now = Date.now();
      if (now - lastUpdate > 40) {
        fullText += buffer;
        if (onChunk) onChunk(fullText);
        buffer = "";
        lastUpdate = now;
      }
    }

    return fullText;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log(`${model} request aborted`);
      return null;
    }
    const errorMsg = `Error: ${error.message}`;
    if (onChunk) onChunk(errorMsg);
    console.error(`${model} API Failed`, error);
    return errorMsg;
  }
};

const handleFetchMetaResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "meta/llama-3.1-8b-instruct", signal, onChunk);
};

const handleFetchGoogleResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "google/gemma-4-31b-it", signal, onChunk);
};

const handleFetchMistralResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "mistralai/mixtral-8x7b-instruct-v0.1", signal, onChunk);
};

const handleFetchMiniMaxResponse = async (history, signal, onChunk) => {
  return fetchStreamingResponse(history, "deepseek-ai/deepseek-v3", signal, onChunk);
};

export {
  handleFetchMetaResponse,
  handleFetchGoogleResponse,
  handleFetchMistralResponse,
  handleFetchMiniMaxResponse,
};
