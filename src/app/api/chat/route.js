import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function POST(request) {
  try {
    const { messages, model } = await request.json();

    const openai = new OpenAI({
      baseURL: NVIDIA_BASE_URL,
      apiKey: process.env.NEXT_PUBLIC_NVIDIA_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: model,
      max_tokens: 1024,
    });

    return Response.json({ content: completion.choices[0].message.content });
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json({ error: "Error generating response" }, { status: 500 });
  }
}
