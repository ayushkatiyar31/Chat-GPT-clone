import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

const chatId = uuidv4();

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:3000/chat", {
        id: chatId,
        msg: text,
      });

      setMessages((prev) => [
        ...prev,
        { role: "model", text: response.data.reply },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "❌ Server error. Try again." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl h-[90vh] bg-gray-800 rounded-xl flex flex-col shadow-lg">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.role} text={msg.text} />
        ))}

        {loading && (
          <p className="text-gray-400 text-sm">AI is thinking...</p>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={sendMessage} />
    </div>
  );
}
