require("dotenv").config();
const express = require("express");
const cors = require("cors");

const generateReply = require("./aiChatting");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory chat history
const chattingHistory = {};

// Health check (important for deployment)
app.get("/", (req, res) => {
  res.send("ChatGPT Clone Backend is running 🚀");
});

// Chat API
app.post("/chat", async (req, res) => {
  try {
    const { id, msg } = req.body;

    if (!id || !msg) {
      return res.status(400).json({ error: "id and msg are required" });
    }

    if (!chattingHistory[id]) {
      chattingHistory[id] = [];
    }

    const history = chattingHistory[id];

    // Build prompt with history
    const prompt = [
      ...history,
      { role: "user", parts: [{ text: msg }] },
    ];

    const answer = await generateReply(prompt);

    // Save conversation
    history.push({ role: "user", parts: [{ text: msg }] });
    history.push({ role: "model", parts: [{ text: answer }] });

    res.json({ reply: answer });
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
