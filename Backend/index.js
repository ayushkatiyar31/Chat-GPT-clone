require("dotenv").config();
const express = require("express");
const cors = require("cors");

const generateReply = require("./aiChatting");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory chat history
const chattingHistory = {};

// Health check
app.get("/", (req, res) => {
  res.send("ChatGPT Clone Backend is running 🚀");
});

// API status (Groq)
app.get("/status", (req, res) => {
  const hasApiKey = !!process.env.GROQ_API_KEY;
  res.json({
    status: "running",
    provider: "Groq",
    apiKey: hasApiKey ? "configured" : "missing",
    model: "llama3-8b-8192"
  });
});

// Chat API
app.post("/chat", async (req, res) => {
  try {
    console.log("📨 Received chat request");
    const { id, msg } = req.body;

    if (!id || !msg) {
      return res.status(400).json({ error: "id and msg are required" });
    }

    if (!chattingHistory[id]) {
      chattingHistory[id] = [];
    }

    const message = {
      role: "user",
      parts: [{ text: msg }]
    };

    const answer = await generateReply([message]);

    chattingHistory[id].push({ role: "user", parts: [{ text: msg }] });
    chattingHistory[id].push({ role: "model", parts: [{ text: answer }] });

    res.json({
      reply: answer,
      success: true
    });
  } catch (err) {
    console.error("❌ Server Error:", err.message);
    res.status(500).json({
      error: "Internal server error",
      details: err.message
    });
  }
});

// Clear chat history
app.delete("/chat/:id", (req, res) => {
  delete chattingHistory[req.params.id];
  res.json({ message: "Chat history cleared" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔑 Groq API Key configured: ${process.env.GROQ_API_KEY ? "YES" : "NO"}`);
});
