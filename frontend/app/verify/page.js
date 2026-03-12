"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  CheckCircle,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  MessageCircle,
} from "lucide-react";

export default function Verify() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hash, setHash] = useState("");

  const handleVerify = async () => {
    if (!file) {
      setError("Please upload a document");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      /* Generate SHA256 hash */
      const buffer = await file.arrayBuffer();

      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);

      const hashArray = Array.from(new Uint8Array(hashBuffer));

      const generatedHash = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      setHash(generatedHash);

      console.log("Generated Hash:", generatedHash);

      /* Send hash to backend */

      const res = await fetch("http://localhost:5000/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash: generatedHash }),
      });

      const data = await res.json();

      setResult(data);
    } catch (err) {
      setError("Server error. Make sure backend is running.");
    }

    setLoading(false);
  };

  return (
    <div
      className="
      min-h-screen flex flex-col items-center py-12 px-4
      bg-gradient-to-br
      from-gray-50 via-white to-gray-200
      dark:from-[#0f172a] dark:via-[#111827] dark:to-[#1e293b]
      text-gray-900 dark:text-white
      transition-colors duration-500
    "
    >
      {/* Navigation */}

      <div
        className="
        w-full max-w-4xl
        backdrop-blur-xl
        bg-white/70 dark:bg-white/10
        border border-gray-200 dark:border-white/20
        shadow-xl rounded-2xl
        flex gap-2
        p-2 mb-14
      "
      >
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
          <Upload size={18} />
          Upload
        </button>

        {/* Verify */}
        <button
          onClick={() => router.push("/verify")}
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
          <CheckCircle size={18} />
          Verify
        </button>

        {/* Ask */}
        <button
          onClick={() => router.push("/ask")}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-3 rounded-xl
            text-gray-700 dark:text-gray-300
            hover:bg-gray-200 dark:hover:bg-white/10
            hover:text-black dark:hover:text-white
            transition
          "
        >
          <MessageCircle size={18} />
          Ask
        </button>
      </div>

      {/* Card */}

      <div
        className="
        w-full max-w-xl
        backdrop-blur-xl
        bg-white/70 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        rounded-3xl shadow-2xl
        p-10
        transition-all duration-300
        hover:scale-[1.01]
      "
      >
        {/* Header */}

        <div className="flex items-center gap-4 mb-6">
          <ShieldCheck size={32} className="text-blue-500 dark:text-blue-400" />

          <h1
            className="
            text-3xl font-extrabold
            bg-gradient-to-r from-blue-500 to-purple-600
            bg-clip-text text-transparent
          "
          >
            Verify Document
          </h1>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Enter the SHA-256 hash to validate document authenticity on
          blockchain.
        </p>

        {/* Input */}

        <label
          className="
    w-full flex flex-col items-center justify-center
    border-2 border-dashed border-gray-300 dark:border-white/20
    rounded-xl p-8
    cursor-pointer
    bg-white dark:bg-white/10
    hover:bg-gray-100 dark:hover:bg-white/20
    transition
  "
        >
          <Upload size={32} className="text-blue-500 mb-2" />

          <span className="text-sm text-gray-700 dark:text-gray-300">
            {file ? file.name : "Click to upload document"}
          </span>

          <input
            type="file"
            className="hidden"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>

        {error && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-3">{error}</p>
        )}

        {/* Button */}

        <button
          onClick={handleVerify}
          disabled={loading}
          className="
            mt-8 w-full py-4 rounded-xl font-semibold
            bg-gradient-to-r from-blue-500 to-purple-600
            hover:opacity-90 disabled:opacity-50
            transition shadow-lg
            flex items-center justify-center gap-3
          "
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Verifying...
            </>
          ) : (
            "Verify on Blockchain"
          )}
        </button>

        {/* Result */}

        {result && (
          <div
            className="
            mt-10 p-6 rounded-2xl
            border border-gray-200 dark:border-white/10
            bg-gray-50 dark:bg-white/5
            animate-fadeIn
          "
          >
            {result.verified ? (
              <div>
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold mb-4">
                  <CheckCircle size={20} />
                  Document Verified Successfully
                </div>

                <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                  <p>
                    <b>Status:</b> Verified
                  </p>

                  <p className="break-all">
                    <b>Generated Hash:</b> {hash}
                  </p>

                  <p className="break-all">
                    <b>Blockchain Hash:</b> {hash}
                  </p>

                  <p className="break-all">
                    <b>CID:</b> {result.cid}
                  </p>

                  <p className="break-all">
                    <b>Owner:</b> {result.owner}
                  </p>

                  <p>
                    <b>Timestamp:</b>{" "}
                    {new Date(result.timestamp * 1000).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-red-600 dark:text-red-400 font-semibold space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={20} />
                  Document Not Found on Blockchain
                </div>

                <p className="text-sm break-all text-gray-600 dark:text-gray-400">
                  <b>Generated Hash:</b> {hash}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
