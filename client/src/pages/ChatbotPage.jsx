import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Import Firestore functions
import { CircularProgress } from '@mui/material'; // Import CircularProgress from MUI

const ChatbotPage = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [dotAnimation, setDotAnimation] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState([]);
  const [cancelTyping, setCancelTyping] = useState(false);
  const [botResponseCount, setBotResponseCount] = useState(0); // Track AI responses
  const [recommendationsLoading, setRecommendationsLoading] = useState(true); // New state for recommendations loading
  const token = sessionStorage.getItem('token');
  if (!token) {
    navigate('/signin');
    return;
  }
  const userInfo = jwtDecode(token);


  const typingIntervalRef = useRef(null);
  const activeRequestRef = useRef(null);
  const stopTypingFlag = useRef(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const db = getFirestore();
      const userDocRef = doc(db, "users", userInfo.email); 
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const chatHistory = userDoc.data().chat_history || []; // Fetch chat history
        const formattedMessages = chatHistory.flatMap(item => {
          const messages = [];
          if (item.user_prompt) {
            messages.push({ role: "user", content: item.user_prompt }); // Add user prompt if it exists
          }
          if (item.ai_response) {
            messages.push({ role: "bot", content: item.ai_response }); // Add AI response if it exists
          }
          return messages; // Return the array of messages for this entry
        });
        setMessages(formattedMessages); // Populate messages with formatted chat history
      } else {
        console.error("No such document!");
      }
    };

    const greetUser = async () => {
        setMessages([{ role: "bot", content: "..." }]);
        setBotTyping(true);
        setRecommendationsLoading(true); // Set loading state for recommendations

        let dotCount = 1;
        const dotInterval = setInterval(() => {
        setDotAnimation((prev) => {
            dotCount = (dotCount % 3) + 1;
            return ".".repeat(dotCount);
        });
        }, 500);



      try {
        const res = await fetch(`http://localhost:8080/generate_greeting`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_email: userInfo.email, first_name: userInfo.name.split(' ')[0] }), 
        });

        if (!res.ok) throw new Error("Failed to fetch greeting");
        const data = await res.json();
  
        setTimeout(() => {
            clearInterval(dotInterval);
            setDotAnimation("");
            setMessages((prev) => [
                ...prev.slice(0, -1), // Remove the loading message
                { role: "bot", content: `${data.message} ${data.recommendations}` }, // Display the greeting from the response
              ]);
            setBotTyping(false);
            setRecommendationsLoading(false); // Reset loading state for recommendations
        }, 2000);
      } catch (error) {
        console.error("Error fetching greeting:", error.message);
        clearInterval(dotInterval);
        setDotAnimation("");
        // Keep the loading message until the new message is added
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove the loading message
          { role: "bot", content: "Sorry, something went wrong." },
        ]);
        setRecommendationsLoading(false); // Reset loading state for recommendations
      } finally {
        setBotTyping(false);
      }
    };

    greetUser(); // Call the existing greetUser function
    fetchChatHistory(); // Call the function to fetch chat history
    
  }, []);

  useEffect(() => console.log(messages), [messages]);

  useEffect(() => {
    let dotCount = 1;
    let dotInterval;

    if (botTyping) {
      dotInterval = setInterval(() => {
        dotCount = (dotCount % 3) + 1;
        setDotAnimation(".".repeat(dotCount));
      }, 500);
    }

    return () => clearInterval(dotInterval);
  }, [botTyping]);

  const handleChat = async (customPrompt) => {
    if (cancelTyping) {
      stopTyping();
      return;
    }

    const messageToSend = customPrompt || prompt.trim();

    // Validate that the prompt is a simple string
    if (!messageToSend || typeof messageToSend !== "string") {
      console.error("Invalid messageToSend:", messageToSend);
      return;
    }

    setLoading(true);
    setCancelTyping(true);

    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    if (!customPrompt) setPrompt("");

    setMessages((prev) => [...prev, { role: "bot", content: "." }]);
    setBotTyping(true);

    const abortController = new AbortController();
    activeRequestRef.current = abortController;

    try {
      const res = await fetch(`http://localhost:8080/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: messageToSend, user_email: userInfo.email }),
        signal: abortController.signal,
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      console.log("Backend response:", data.response); // Log the response

      
      simulateTyping(data.response);
      setBotTyping(false);
    } catch (error) {
      if (abortController.signal.aborted) {
        console.log("Fetch request aborted");
      } else {
        console.error("Error fetching response:", extractErrorDetails(error));
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

  // Helper function to extract error details and avoid circular references
  const extractErrorDetails = (error) => {
    try {
      // If it's a standard Error, log its details
      if (error instanceof Error) {
        return `${error.name}: ${error.message}\n${error.stack || ""}`;
      }

      // Handle circular references for other objects
      return JSON.stringify(error, getCircularReplacer()) || String(error);
    } catch (err) {
      return "Unknown error occurred.";
    }
  };

  // Utility function to handle circular references in objects
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "[Circular]";
        }
        seen.add(value);
      }
      return value;
    };
  };

  const simulateTyping = (text) => {
    // Increment bot response count after finishing typing
    setBotResponseCount((prev) => prev + 1);
    
    let i = -1;
    const words = text.split(" ");
    console.log('words: ', words)

    setMessages((prev) => [
      ...prev.slice(0, -1),
      { role: "bot", content: "" },
    ]);

    stopTypingFlag.current = false;

    typingIntervalRef.current = setInterval(() => {
      if (stopTypingFlag.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        return;
      }


      if (i < words.length-1) {
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "bot", content: prev[prev.length - 1]?.content + (i > 0 ? " " : "") + words[i] },
        ]);
        i++;
      } else {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
        setCancelTyping(false);

        // Add follow-up suggestions here
        setFollowUpQuestions(["Tell me more", "What's next?"]);
      }
    }, 100);
  };

  const stopTyping = () => {
    stopTypingFlag.current = true; // Set the flag to stop typing simulation

    // Abort any ongoing fetch requests
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
      activeRequestRef.current = null;
    }

    // Clear any ongoing typing intervals
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    // Reset states to ensure UI reflects the cancelation
    setCancelTyping(false); // Disable the cancel mode
    setLoading(false); // Remove loading state
    setBotTyping(false); // Reset bot typing indicator
    setDotAnimation(""); // Clear dot animation

    // Update the messages to show that typing was canceled
    setMessages((prev) => [
      ...prev.slice(0, -1), // Remove the last bot message (placeholder)
      { role: "bot", content: "Typing canceled." }, // Add a new message
    ]);
  };

  const handleFollowUpClick = (question) => {
    handleChat(question);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  };

  const handleButtonClick = (question) => {
    handleChat(question); // Handle the click by passing the question as a custom prompt
  };

  return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 border border-gray-700 rounded relative min-h-[600px]" style={{ padding: '1rem' }}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} mb-4`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-2xl ${message.role === "user" ? "bg-[#324A5F] text-white" : "bg-gray-700 text-gray-300"
                  }`}
                dangerouslySetInnerHTML={{ __html: message.content === "." ? dotAnimation : message.content }}
              />
            </div>
          ))}
          {recommendationsLoading && ( // Loader for recommendations
            <div className="flex justify-center items-center h-full mb-4">
                <CircularProgress />
                <span className="ml-2">Getting ready to deliver personalized recommendations for you!</span>
            </div>
          )}
          {/* {followUpQuestions.length > 0 && botResponseCount < 2 && ( // Show follow-ups only if AI has less than 2 responses
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2">
              {followUpQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleFollowUpClick(question)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full mr-2"
                >
                  {question}
                </button>
              ))}
            </div>
          )} */}
        </div>
        <div className="flex gap-2 mt-4">
          <textarea
            rows={1}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 p-2 border border-gray-700 rounded text-black placeholder-gray-500"
            placeholder="Type your message"
          />
          <button
            className={`text-white p-2 rounded ${botTyping ? 'bg-[#34507c]' : 'bg-[#4b6f8f]'}`}
            onClick={() => handleChat()}
            disabled={loading}
          >
            {loading ? "Loading..." : botTyping ? "Cancel" : "Send"}
          </button>
        </div>
      </div>
  );
  
};

export default ChatbotPage;


