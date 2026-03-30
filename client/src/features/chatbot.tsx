"use client";

import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async (custom?: string) => {
    const msg = custom || input;
    if (!msg) return;

    setMessages((prev) => [...prev, "You: " + msg]);
    setInput("");

    const res = await fetch("http://localhost:4000/api/chat", {
      method: "POST",
      credentials: "include", // ✅ important for cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, "Bot: " + data.reply]);
  };

  return (
    <div className="p-4 border rounded-lg w-full max-w-md">
      <div className="h-60 overflow-y-auto mb-2 bg-gray-50 p-2 rounded">
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your project..."
        />
        <button
          onClick={() => sendMessage()}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>

      {/* Quick actions */}
      <div className="mt-2 flex gap-2 flex-wrap">
        <button onClick={() => sendMessage("Explain my project")}>
          Explain
        </button>
        <button onClick={() => sendMessage("How can I improve?")}>
          Improve
        </button>
      </div>
    </div>
  );
}