import React, { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";

const TodoAi = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const userMessage = { role: "user", content: userInput };

    // first update UI immediately
    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const allMessages = [...messages, userMessage];

      const res = await fetch(
        "http://localhost:5000/api/todo-ai/llama-3.3-70b-versatile",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: allMessages }),
        }
      );
      const data = await res.json();
      // Add AI message
      const aiMessage = { role: "assistant", content: data.data };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI request failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <section className="bg-linear-to-br from-zinc-900 via-gray-900 to-zinc-800 min-h-screen pt-20 sm:pt-16 text-white px-4 relative">
      <div className="max-w-5xl w-full mx-auto pb-32">
        <div className="mb-4 sm:mb-6 text-center flex-shrink-0 fixed left-0 right-0 top-14 z-40 bg-linear-to-r from-zinc-900 via-gray-900 to-zinc-900 pt-4 pb-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Todo AI
            </h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            Your intelligent task assistant
          </p>
        </div>

        <div className="mb-4 sm:mb-6 mt-20 md:mt-28 bg-linear-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-4 sm:p-5 backdrop-blur-sm flex-shrink-0">
          <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
            <div className="bg-purple-500/20 p-2 sm:p-3 rounded-lg">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-semibold text-purple-300 mb-2">
                AI-Powered Task Assistant
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3">
                Chat with your personal AI assistant to manage tasks
                effortlessly. Ask questions, get help, and let AI handle your
                todo management through natural conversation.
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
                  💬 Natural Chat
                </span>
                <span className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full">
                  🎤 Voice Support
                </span>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  🤖 Smart AI
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-800/30 min-h-[450px] border border-gray-700 rounded-lg p-4 overflow-y-auto mb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
              <p>Start a conversation with your AI assistant</p>
              <div className="flex flex-col gap-2 items-center py-10">
                <h1 className="text-3xl font-semibold text-white -ml-6">
                  <span className="animate-pulse">👋</span> Hello User
                </h1>
                <p>I'm your personal Todo AI assistant</p>
                <p>How can I help you today?</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-linear-to-t from-zinc-900 via-zinc-900 to-transparent pt-6 pb-4 px-4">
        <div className="max-w-5xl w-full mx-auto flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type Your Query..."
            className="bg-gray-800 w-full p-4 sm:p-5 rounded-lg focus:outline-none border border-gray-700 focus:border-purple-500 placeholder:text-gray-400 text-white transition-colors"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !userInput.trim()}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed border border-gray-600 flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Send className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default TodoAi;
