import express from "express";
import cors from "cors";
import multer from "multer";
import crypto from "crypto";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import { ethers } from "ethers";
import fs from "fs";
import pdfParse from "pdf-parse";
import Groq from "groq-sdk";
dotenv.config();

/* ------------------ EXPRESS SETUP ------------------ */

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

/* ------------------ BLOCKCHAIN SETUP ------------------ */

const contractJSON = JSON.parse(
  fs.readFileSync(
    "./artifacts/contracts/ENotary.sol/ENotary.json",
    "utf8"
  )
);

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

const wallet = new ethers.Wallet(
  process.env.PRIVATE_KEY,
  provider
);

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractJSON.abi,
  wallet
);

/* ------------------ GEMINI SETUP ------------------ */

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* ------------------ DOCUMENT STORE (Memory RAG) ------------------ */
// hash -> full document text
let documentStore = {};

/* ------------------ UPLOAD ROUTE ------------------ */

app.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ error: "No file received" });
    }

    const fileBuffer = fs.readFileSync(req.file.path);

    /* 1️⃣ Generate SHA-256 hash */
    const hash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");

    /* 2️⃣ Check if already notarized on blockchain */
    const existingDoc = await contract.verifyDocument(hash);
    const existingTimestamp = Number(existingDoc[1]);

    if (existingTimestamp !== 0) {
      return res.json({
        message: "Document already notarized. Not uploading again.",
        hash,
        cid: existingDoc[0],
        owner: existingDoc[2],
        timestamp: existingTimestamp
      });
    }

    /* 3️⃣ Upload to Pinata ONLY if new */
    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: req.file.originalname,
    });

    const pinataResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: "Infinity",
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          ...formData.getHeaders(),
        },
      }
    );

    const cid = pinataResponse.data.IpfsHash;

    /* 4️⃣ Store on blockchain */
    const tx = await contract.notarizeDocument(hash, cid);
    await tx.wait();

    /* 5️⃣ Extract PDF text for RAG */
    const pdfData = await pdfParse(fileBuffer);
    const fullText = pdfData.text;

    documentStore[hash] = fullText;

    res.json({
      message: "Uploaded and notarized successfully",
      hash,
      cid,
      transaction: tx.hash,
    });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

/* ------------------ ASK ROUTE (Simple RAG) ------------------ */

app.post("/ask", async (req, res) => {
  try {
    const { hash, question } = req.body;

    if (!hash || !question) {
      return res.status(400).json({ error: "Hash and question required" });
    }

    const result = await contract.verifyDocument(hash);
    const timestamp = Number(result[1]);

    if (timestamp === 0) {
      return res.status(400).json({
        error: "Document not verified on blockchain",
      });
    }

    const fullText = documentStore[hash];

    if (!fullText) {
      return res.status(400).json({
        error: "Document not available in memory",
      });
    }

    const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [
    {
      role: "system",
      content: `
You are a professional document analysis assistant.

Rules:
1. Answer ONLY using the provided document.
2. If the answer is not present, say: "Not found in document."
3. Format the answer clearly using Markdown.
4. Use headings, bullet points, or numbered lists when helpful.
5. Keep answers concise and well structured.
`,
    },
    {
      role: "user",
      content: `
DOCUMENT:
${fullText.slice(0, 3000)}

QUESTION:
${question}

FORMAT RESPONSE LIKE THIS:

### Answer
<clear explanation>

### Key Points
- point 1
- point 2
- point 3
`,
    },
  ],
});



    const answer = completion.choices[0].message.content;

    res.json({ answer });

  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
});

/* ------------------ VERIFY ROUTE ------------------ */

app.post("/verify", async (req, res) => {
  try {
    const { hash } = req.body;

    const result = await contract.verifyDocument(hash);

    const cid = result[0];
    const timestamp = Number(result[1]);
    const owner = result[2];

    if (timestamp === 0) {
      return res.json({ verified: false });
    }

    return res.json({
      verified: true,
      cid,
      timestamp,
      owner,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ START SERVER ------------------ */

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
