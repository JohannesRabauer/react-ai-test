import React, { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [story, setStory] = useState([
    "You wake up in a dark forest. The air is cold and you hear distant howls. What do you do?"
  ]);
  const [input, setInput] = useState("");

  const generateNext = (userInput) => {
    const responses = [
      `You decide to ${userInput}. The path twists ahead, and something glimmers in the distance...`,
      `After you ${userInput}, the trees whisper secrets only you can hear.`,
      `You ${userInput}, and suddenly the ground trembles beneath your feet.`,
      `Choosing to ${userInput}, you feel destiny shifting around you.`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const nextPart = generateNext(input.trim());
    setStory([...story, `> ${input}`, nextPart]);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <header className="text-3xl font-bold mb-6 text-center">
        AI Adventure Story
      </header>

      <motion.div
        className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-4 overflow-y-auto flex-1 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {story.map((line, idx) => (
          <p key={idx} className="mb-2">
            {line}
          </p>
        ))}
      </motion.div>

      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you do?"
          className="flex-1 p-3 rounded-l-2xl bg-gray-700 text-white outline-none"
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 rounded-r-2xl hover:bg-blue-500"
        >
          Go
        </button>
      </form>
    </div>
  );
}
