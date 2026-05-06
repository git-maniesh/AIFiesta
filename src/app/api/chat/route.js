import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function POST(request) {
  try {
    const { messages, model } = await request.json();

    const openai = new OpenAI({
      baseURL: NVIDIA_BASE_URL,
      apiKey: process.env.NEXT_PUBLIC_NVIDIA_API_KEY,
    });

    const stream = await openai.chat.completions.create({
      messages: messages,
      model: model,
      max_tokens: 1024,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json({ error: "Error generating response" }, { status: 500 });
  }
}
