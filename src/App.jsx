
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { pipeline } from "@xenova/transformers";

export default function App() {

  const [messages, setMessages] = useState([
    "Ask me anything! (All AI runs in your browser, no server needed.)"
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const aiRef = useRef(null);

  // Load the AI pipeline only once
  async function getAI() {
    if (!aiRef.current) {
  aiRef.current = await pipeline("text-generation", "Xenova/gpt2");
    }
    return aiRef.current;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, `> ${input}`]);
    setLoading(true);
    try {
      const ai = await getAI();
  // Add a few Q/A examples to guide the model
  const prompt = `${input}`;
      const output = await ai(prompt, { max_new_tokens: 60, temperature: 1.2 });
      setMessages((prev) => [...prev, `[DEBUG: raw output: ${JSON.stringify(output)}]`]);
      let answer = output[0]?.generated_text || "[No answer generated]";
      if (!answer) answer = "[No answer generated]";
      setMessages((prev) => [...prev, answer]);
    } catch (err) {
      setMessages((prev) => [...prev, "[AI error: " + err.message + "]"]);
    }
    setLoading(false);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <header className="text-3xl font-bold mb-6 text-center">
        Browser AI Chat
      </header>

      <motion.div
        className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-4 overflow-y-auto flex-1 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {messages.map((line, idx) => (
          <p key={idx} className="mb-2 whitespace-pre-line">
            {line}
          </p>
        ))}
        {loading && <p className="italic text-gray-400">AI is thinking...</p>}
      </motion.div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-3 rounded-l-2xl bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 rounded-r-2xl hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
