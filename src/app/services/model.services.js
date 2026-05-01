const handleFetchGeminiResponse = async (history) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: history.map(h => ({ role: h.role, content: h.text })),
        model: "google/gemma-2-2b-it",
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return data.content;
  } catch (error) {
    console.error("Gemini (Gemma) API Failed", error);
    return "Error generating response.";
  }
};

const handleFetchChatGPTResponse = async (history) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: history.map(h => ({ role: h.role, content: h.text })),
        model: "meta/llama-3.1-70b-instruct",
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return data.content;
  } catch (error) {
    console.error("ChatGPT (Llama) API Failed", error);
    return "Error generating response.";
  }
};

const handleFetchDeepSeekResponse = async (history) => {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: history.map(h => ({ role: h.role, content: h.text })),
        model: "deepseek-ai/deepseek-v4-flash",
      }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) throw new Error(data.error);
    
    return data.content;
  } catch (error) {
    console.error("DeepSeek API Failed", error);
    return "Error generating response.";
  }
};

export {
  handleFetchChatGPTResponse,
  handleFetchDeepSeekResponse,
  handleFetchGeminiResponse,
};
