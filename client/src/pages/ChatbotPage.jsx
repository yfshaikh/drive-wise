import React, { useState, useEffect, useRef } from "react";


const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [dotAnimation, setDotAnimation] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [cancelTyping, setCancelTyping] = useState(false);
  const [botResponseCount, setBotResponseCount] = useState(0);

  const typingIntervalRef = useRef(null);
  const activeRequestRef = useRef(null);
  const stopTypingFlag = useRef(false);

  useEffect(() => {
    const greetUser = () => {
      setMessages([{ role: "bot", content: "..." }]);
      setBotTyping(true);

      let dotCount = 1;
      const dotInterval = setInterval(() => {
        setDotAnimation(".".repeat((dotCount % 3) + 1));
        dotCount++;
      }, 500);

      setTimeout(() => {
        clearInterval(dotInterval);
        setDotAnimation("");
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: "Hello! Ask me about CBRE's Sustainability Initiatives!" },
        ]);
        setBotTyping(false);
      }, 2000);
    };

    greetUser();
  }, []);

  useEffect(() => {
    if (botTyping) {
      let dotCount = 1;
      const dotInterval = setInterval(() => {
        setDotAnimation(".".repeat((dotCount % 3) + 1));
        dotCount++;
      }, 500);

      return () => clearInterval(dotInterval);
    }
  }, [botTyping]);

  const handleChat = async (customPrompt) => {
    if (cancelTyping) {
      stopTyping();
      return;
    }

    const messageToSend = customPrompt || prompt.trim();
    if (!messageToSend) return;

    setLoading(true);
    setCancelTyping(true);
    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    if (!customPrompt) setPrompt("");

    setMessages((prev) => [...prev, { role: "bot", content: "." }]);
    setBotTyping(true);

    const abortController = new AbortController();
    activeRequestRef.current = abortController;

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: messageToSend }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch response");
      const data = await res.json();
      simulateTyping(data.response);
      setBotTyping(false);
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log("Fetch request aborted");
      } else {
        console.error("Error fetching response:", error.message);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: "Sorry, something went wrong." },
        ]);
      }
    } finally {
      activeRequestRef.current = null;
      setLoading(false);
    }
  };

  const simulateTyping = (text) => {
    setBotResponseCount((prev) => prev + 1);
    let i = 0;
    const words = text.split(" ");

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "bot", content: "" },
    ]);

    stopTypingFlag.current = false;

    typingIntervalRef.current = setInterval(() => {
      if (stopTypingFlag.current || i >= words.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setCancelTyping(false);
        if (i >= words.length) {
          setFollowUpQuestions(["Tell me more", "What’s next?"]);
        }
        return;
      }
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: "bot", content: prev[prev.length - 1]?.content + " " + words[i] },
      ]);
      i++;
    }, 100);
  };

  const stopTyping = () => {
    stopTypingFlag.current = true;
    if (activeRequestRef.current) activeRequestRef.current.abort();
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "bot", content: "Typing canceled." },
    ]);
    setCancelTyping(false);
    setLoading(false);
    setBotTyping(false);
    setDotAnimation("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr] h-screen bg-gray-900 text-white">
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 border border-gray-700 rounded bg-gray-800 relative">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${
                  message.role === "user" ? "bg-indigo-600 text-white" : "bg-gray-700 text-gray-300"
                }`}
              >
                {message.content === "." ? dotAnimation : message.content}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 mt-4">
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-500"
            placeholder="Type your message"
          />
          <button
            className={`text-white p-2 rounded ${botTyping ? "bg-violet-600" : "bg-blue-600"}`}
            onClick={handleChat}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
};

export default ChatbotPage;
