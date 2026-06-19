"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const quickQuestions = [
  "What is Blue Carbon?",
  "How do I submit a plantation?",
  "How are carbon credits generated?",
  "What is the verification process?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `# Welcome to MangroveAdvisor 🌱

Your AI assistant for:

- Blue Carbon
- Mangrove Restoration
- Carbon Credits
- MRV Verification
- Plantation Monitoring
- Blockchain Transparency`,
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || input;

    if (!messageToSend.trim()) return;

    const updatedMessages = [
      ...messages,
      {
        role: "user" as const,
        text: messageToSend,
      },
    ];

    setMessages(updatedMessages);

    if (!customMessage) {
      setInput("");
    }

    setLoading(true);

    try {
      const chatHistory = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.text,
      }));

      const res = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: chatHistory,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "❌ Unable to connect to the server.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-black -m-5">
      {/* Header */}
      <div className="bg-violet-500/70 backdrop-blur-xl border-b border-white/20 text-white p-4 shadow-lg">
        <h1 className="text-xl font-extrabold">MangroveAdvisor AI </h1>
        
      </div>

      {/* Chat Area */}

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Quick Questions */}
        <div className="px-6 py-4 flex flex-wrap gap-3 bg-slate-950">
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => sendMessage(question)}
              className="
px-4 py-2
rounded-full
bg-white/80
backdrop-blur-md
border border-violet-200
text-violet-700
font-medium
hover:bg-violet-500
hover:text-white
transition-all
duration-300
hover:-translate-y-1
"
            >
              {question}
            </button>
          ))}
        </div>

        <div className="max-w-7xl mx-auto p-6 space-y-6 ">
          {messages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-2xl px-5 py-4 shadow-sm ${
                  msg.role === "user"
                    ? "bg-violet-500 text-white max-w-[70%]"
                    : "bg-white/80 backdrop-blur-md border border-white/40 text-gray-800 max-w-[75%]"
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className="prose prose-violet prose-sm max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-3xl font-bold mb-4">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-semibold mt-6 mb-3 text-green-700">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold mt-4 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="mb-3 leading-7">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc ml-6 mb-4 space-y-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal ml-6 mb-4 space-y-2">
                            {children}
                          </ol>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-green-700">
                            {children}
                          </strong>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <div>{msg.text}</div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="
bg-white/80
backdrop-blur-md
border border-white/40
rounded-2xl
px-5 py-4
shadow-lg
animate-pulse
text-violet-700
"
              >
                🌱 CarbonBot is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div
        className="
border-t
border-white/20
bg-white/40
backdrop-blur-xl
p-4
"
      >
        <div className="max-w-5xl mx-auto flex gap-3 ">
          <input
            type="text"
            value={input}
            placeholder="Ask about mangroves, carbon credits, MRV..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="
flex-1
bg-white/80
border
border-violet-200
rounded-xl
px-4 py-3
focus:outline-none
focus:ring-2
focus:ring-violet-400
"
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading}
            className="
bg-violet-500
hover:bg-violet-600
text-slate-900
px-6 py-3
rounded-xl
font-medium
transition-all
duration-300
hover:-translate-y-1
"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
