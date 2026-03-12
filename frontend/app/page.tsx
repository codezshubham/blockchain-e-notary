"use client";

import { useState, useRef } from "react";
import {
  Upload as UploadIcon,
  CheckCircle,
  MessageCircle,
  FileText,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Upload() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleUpload = async () => {
    if (!file) {
      fileInputRef.current?.click();
      return;
    }

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are allowed");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();

      setResult(data);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) setFile(droppedFile);
  };

  const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text);
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
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white font-semibold
      shadow-md
      hover:opacity-90
      transition
    "
        >
          <UploadIcon size={18} />
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

      {/* Heading */}

      <h1
        className="
        text-5xl font-extrabold
        bg-gradient-to-r
        from-blue-500 to-purple-600
        bg-clip-text text-transparent
        mb-4 text-center
      "
      >
        Secure Blockchain Notary
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-12 text-center max-w-xl">
        Upload your document, anchor it on blockchain, and chat with it using
        AI.
      </p>

      {/* Upload Card */}

      <div
        className="
        w-full max-w-3xl
        backdrop-blur-xl
        bg-white/70 dark:bg-white/5
        border border-gray-200 dark:border-white/10
        rounded-3xl shadow-2xl
        p-10
        transition-all duration-300
        hover:scale-[1.01]
      "
      >
        {/* Drop Zone */}

        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`
            flex flex-col items-center justify-center
            border-2 border-dashed
            rounded-2xl h-72 cursor-pointer
            transition-all duration-300

            ${
              dragActive
                ? "border-blue-500 bg-blue-500/10"
                : "border-gray-300 dark:border-gray-500/30 hover:border-blue-400"
            }
          `}
        >
          {file ? (
            <>
              <FileText size={42} className="text-blue-500 mb-4" />
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Ready to upload
              </p>
            </>
          ) : (
            <>
              <UploadIcon size={42} className="text-gray-400 mb-4" />
              <p className="text-lg font-medium">Drag & Drop your PDF here</p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                or click to browse
              </p>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="hidden"
          />
        </div>

        {/* Upload Button */}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="
            w-full mt-8 py-4 rounded-xl font-semibold text-lg
            bg-gradient-to-r from-blue-500 to-purple-600
            hover:opacity-90
            disabled:opacity-50
            transition-all duration-300
            shadow-lg
          "
        >
          {loading ? "Processing..." : "Upload & Notarize"}
        </button>

        {/* Result Section */}

        {result && (
  <div
    className="
    mt-10 p-6
    backdrop-blur-xl
    bg-white/80 dark:bg-white/5
    border border-green-200 dark:border-green-500/30
    rounded-2xl
    shadow-xl
    space-y-4
  "
  >
    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
      <CheckCircle size={20} />
      Document Successfully Notarized
    </div>

    {/* Hash */}
    <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 rounded-lg p-3">
      <div className="text-sm break-all">
        <p className="text-gray-500 dark:text-gray-400 text-xs">HASH</p>
        <p className="font-mono">{result.hash}</p>
      </div>

      <button
        onClick={() => copyToClipboard(result.hash)}
        className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition"
      >
        Copy
      </button>
    </div>

    {/* CID */}
    <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 rounded-lg p-3">
      <div className="text-sm break-all">
        <p className="text-gray-500 dark:text-gray-400 text-xs">IPFS CID</p>
        <p className="font-mono">{result.cid}</p>
      </div>

      <button
        onClick={() => copyToClipboard(result.cid)}
        className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition"
      >
        Copy
      </button>
    </div>

    {/* Transaction */}
    {result.transaction && (
      <div className="flex items-center justify-between bg-gray-100 dark:bg-white/5 rounded-lg p-3">
        <div className="text-sm break-all">
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            BLOCKCHAIN TRANSACTION
          </p>
          <p className="font-mono">{result.transaction}</p>
        </div>

        <button
          onClick={() => copyToClipboard(result.transaction)}
          className="text-sm px-3 py-1 rounded-md bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 transition"
        >
          Copy
        </button>
      </div>
    )}

    {/* Action Button */}
    <button
      onClick={() => router.push(`/ask?hash=${result.hash}`)}
      className="
      w-full mt-4 py-3 rounded-xl
      bg-gradient-to-r from-blue-500 to-purple-600
      text-white font-semibold
      hover:opacity-90
      shadow-lg
      transition-all
    "
    >
      Ask AI About This Document
    </button>
  </div>
)}
      </div>
    </div>
  );
}
