const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

async function generateReply(messages) {
  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: messages.map((m) => ({
        role: m.role === "model" ? "assistant" : "user",
        content: m.parts[0].text,
      })),
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("🔥 Groq Error:", error.message);
    throw error;
  }
}

module.exports = generateReply;
