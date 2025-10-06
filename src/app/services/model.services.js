// import { Completions } from "openai/resources/chat/completions";
import { FETCH_DEEPSEEK, FETCH_GEMINI } from "../utils/app.constants";
import OpenAI from "openai";

const handleFetchGeminiResponse = async (prompt) => {
  try {
    // console.log("Prompt:", prompt);
    // console.log("Body sent to Gemini:", JSON.stringify(body, null, 2));

    const response = await fetch(FETCH_GEMINI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
      },
      //api_key
      //   console.log("Body sent to Gemini:", JSON.stringify(body, null, 2));

      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.log("Gemini API Failed", error);
  }
};

const handleFetchChatGPTResponse = async (prompt) => {
  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_CHATGPT_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: prompt,
  });
  const responseData = completion.choices[0].message.content;
//   console.log(responseData);

  return responseData;
};

const handleFetchDeepSeekResponse = async (prompt) => {
  const openai = new OpenAI({
    baseURL: FETCH_DEEPSEEK,
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    dangerouslyAllowBrowser: true,
  });
  const completion = await openai.chat.completions.create({
    messages:[{role:"system", content:prompt}],
    model:"deepseek/deepseek-r1:free"

  })
  const responseData =completion.choices[0].message.content;

  return responseData;
};

export {
  handleFetchChatGPTResponse,
  handleFetchDeepSeekResponse,
  handleFetchGeminiResponse,
};
