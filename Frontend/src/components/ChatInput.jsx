import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="p-4 border-t border-gray-700 flex gap-2">
      <input
        type="text"
        placeholder="Message ChatGPT..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        className="flex-1 bg-gray-900 text-white px-4 py-2 rounded-lg outline-none"
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
      >
        Send
      </button>
    </div>
  );
}
