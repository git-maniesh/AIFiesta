import fetch from "node-fetch";
const run = async () => {
  const res = await fetch("https://integrate.api.nvidia.com/v1/models", {
    headers: { Authorization: "Bearer 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" }
  });
  const data = await res.json();
  console.log(data.data.map(m => m.id).filter(id => id.includes("deepseek") || id.includes("gemma") || id.includes("llama")));
};
run();
