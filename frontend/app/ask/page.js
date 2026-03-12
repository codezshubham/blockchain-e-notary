"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Upload, CheckCircle, MessageCircle, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function AskPage() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const hashFromURL = searchParams.get("hash");

  const [hash, setHash] = useState(hashFromURL || "");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);


  const handleAsk = async () => {

    if (!hash || !question) {
      alert("Hash and question required");
      return;
    }

    try {

      setLoading(true);

      const newMessages = [
        ...messages,
        { role: "user", content: question }
      ];

      setMessages(newMessages);

      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hash, question })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Backend error");
      }

      setMessages([
        ...newMessages,
        { role: "assistant", content: data.answer }
      ]);

      setQuestion("");

    } catch (err) {

      alert(err.message);

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="
      min-h-screen flex flex-col items-center py-10 px-4
      bg-gradient-to-br
      from-gray-50 via-white to-gray-200
      dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e293b]
      text-gray-900 dark:text-white
      transition-colors duration-500
    ">


      {/* Navigation */}

      <div className="
  w-full max-w-4xl
  backdrop-blur-xl
  bg-white/70 dark:bg-white/10
  border border-gray-200 dark:border-white/20
  shadow-xl rounded-2xl
  flex gap-2
  p-2 mb-14
">

  {/* Upload */}
  <button
    onClick={() => router.push("/")}
    className="
      flex-1 flex items-center justify-center gap-2
      px-6 py-3 rounded-xl
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-white/10
      hover:text-black dark:hover:text-white
      transition
    "
  >
    <Upload size={18}/>
    Upload
  </button>


  {/* Verify */}
  <button
    onClick={() => router.push("/verify")}
    className="
      flex-1 flex items-center justify-center gap-2
      px-6 py-3 rounded-xl
      text-gray-700 dark:text-gray-300
      hover:bg-gray-200 dark:hover:bg-white/10
      hover:text-black dark:hover:text-white
      transition
    "
  >
    <CheckCircle size={18}/>
    Verify
  </button>


  {/* Ask */}
  <button
    onClick={() => router.push("/ask")}
    className="
      flex-1 flex items-center justify-center gap-2
      px-6 py-3 rounded-xl
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white font-semibold
      shadow-md
      hover:opacity-90
      transition
    "
  >
    <MessageCircle size={18}/>
    Ask
  </button>

</div>


      {/* Heading */}

      <h1 className="
        text-4xl font-extrabold
        bg-gradient-to-r from-blue-500 to-purple-600
        bg-clip-text text-transparent
        mb-6
      ">
        AI Document Chat
      </h1>



      {/* Hash Input */}

      <div className="
        w-full max-w-4xl
        backdrop-blur-xl
        bg-white/70 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        rounded-2xl
        p-6 mb-6
      ">

        <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
          Document Hash
        </label>

        <input
          type="text"
          value={hash}
          onChange={(e) => setHash(e.target.value)}
          className="
            w-full
            bg-white dark:bg-white/10
            border border-gray-300 dark:border-white/20
            rounded-lg px-4 py-3 text-sm
            text-gray-900 dark:text-white
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
          placeholder="Enter document hash"
        />

      </div>



      {/* Chat Container */}

      <div className="
        w-full max-w-4xl
        backdrop-blur-xl
        bg-white/70 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        rounded-3xl shadow-2xl
        flex flex-col
        h-[550px]
        overflow-hidden
      ">


        {/* Messages */}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {messages.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center mt-16">
              Ask anything about your document...
            </p>
          )}


          {messages.map((msg, index) => (

            <div
              key={index}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div
                className={`
                  px-5 py-3 rounded-2xl max-w-[75%]
                  text-sm shadow-lg transition-all

                  ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      : "bg-gray-100 dark:bg-white/10 border border-gray-200 dark:border-white/20 text-gray-800 dark:text-gray-200"
                  }
                `}
              >

                <ReactMarkdown>
                  {msg.content}
                </ReactMarkdown>

              </div>

            </div>

          ))}



          {loading && (

            <div className="flex justify-start">

              <div className="
                px-5 py-3 rounded-2xl
                bg-gray-100 dark:bg-white/10
                border border-gray-200 dark:border-white/20
                text-gray-500 dark:text-gray-400
                animate-pulse
              ">
                Thinking...
              </div>

            </div>

          )}

          <div ref={messagesEndRef}/>

        </div>



        {/* Input Area */}

        <div className="
          p-5
          border-t border-gray-200 dark:border-white/10
          bg-white/60 dark:bg-black/20
          backdrop-blur-xl
        ">

          <div className="flex gap-4">

            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask something about the document..."
              className="
                flex-1
                bg-white dark:bg-white/10
                border border-gray-300 dark:border-white/20
                rounded-xl px-4 py-3
                text-gray-900 dark:text-white
                placeholder-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />

            <button
              onClick={handleAsk}
              disabled={loading}
              className="
                px-6 py-3 rounded-xl
                bg-gradient-to-r from-blue-500 to-purple-600
                hover:opacity-90
                disabled:opacity-50
                transition shadow-lg
              "
            >
              <Send size={18}/>
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}