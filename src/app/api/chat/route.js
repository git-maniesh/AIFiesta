const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";

export async function POST(request) {
  try {
    const { messages, model } = await request.json();
    const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "NVIDIA API Key is missing" }), { status: 500 });
    }

    const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1024,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: `NVIDIA API Error: ${errorText}` }), { 
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = response.body.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
              const cleanedLine = line.replace(/^data: /, "").trim();
              if (cleanedLine === "" || cleanedLine === "[DONE]") continue;

              try {
                const parsed = JSON.parse(cleanedLine);
                const content = parsed.choices[0]?.delta?.content || "";
                if (content) {
                  controller.enqueue(encoder.encode(content));
                }
              } catch (e) {
                // Ignore parsing errors for partial chunks
              }
            }
          }
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
