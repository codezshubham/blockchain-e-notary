# DocProof: Blockchain E-Notary & AI Document Verifier

## Table of Contents

- [DocProof: Blockchain E-Notary & AI Document Verifier](#docproof-blockchain-e-notary--ai-document-verifier)
  - [Description](#description)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Backend API Setup](#2-backend-api-setup)
    - [3. Smart Contract Deployment](#3-smart-contract-deployment)
    - [4. Frontend Application Setup](#4-frontend-application-setup)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Contributing](#contributing)
  - [License](#license)

## Description

DocProof is a cutting-edge decentralized application (dApp) that seamlessly integrates blockchain technology, InterPlanetary File System (IPFS), and artificial intelligence to offer a comprehensive solution for secure document notarization, verifiable authenticity, and intelligent querying. Users can upload documents, which are then hashed (SHA-256) and stored on IPFS via Pinata, with their unique identifiers immutably recorded on a Solidity smart contract. This provides undeniable proof of a document's existence and integrity at a specific time.

Beyond notarization, DocProof features an AI-powered chat interface that leverages Retrieval-Augmented Generation (RAG). This allows users to ask natural language questions about uploaded PDF documents, receiving contextual and accurate answers directly extracted from the document's content. DocProof is designed for developers and organizations seeking a robust, transparent, and intelligent system for managing critical documents.

## Features

*   **Blockchain Notarization**: Securely record document SHA-256 hashes and IPFS Content Identifiers (CIDs) on an `ENotary` smart contract, ensuring immutable proof of existence and integrity.
*   **Decentralized Storage**: Documents are uploaded and pinned to IPFS via Pinata, ensuring decentralized, available, and censorship-resistant storage.
*   **Document Verification**: Quickly verify the authenticity and notarization status of any document by comparing its generated SHA-256 hash against blockchain records.
*   **AI-Powered Document Chat (RAG)**: Engage in natural language conversations with your documents. Ask questions about uploaded PDF content, and an AI (Groq's Llama-3.3-70b-versatile) provides direct, context-aware answers.
*   **Modern User Interface**: A responsive and intuitive web application built with Next.js and Tailwind CSS, featuring a customizable dark/light mode toggle.
*   **Local Development Ready**: Configured for easy local testing and development with Hardhat for smart contracts and a Node.js Express server for the API.

## Tech Stack

**Frontend**:
*   [Next.js](https://nextjs.org/) (React Framework)
*   [TypeScript](https://www.typescriptlang.org/)
*   [Tailwind CSS](https://tailwindcss.com/) (Styling)
*   [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) (Icons)
*   [React Markdown](https://github.com/remarkjs/react-markdown) (Markdown rendering for AI responses)

**Backend (API Server)**:
*   [Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/)
*   [Ethers.js](https://docs.ethers.org/v6/) (Ethereum Wallet & Smart Contract interaction)
*   [Multer](https://www.npmjs.com/package/multer) (File upload handling)
*   [Crypto](https://nodejs.org/api/crypto.html) (Native SHA-256 hashing)
*   [Axios](https://axios-http.com/) (HTTP client for Pinata API)
*   [FormData](https://www.npmjs.com/package/form-data) (Multipart form data creation)
*   [PDF-Parse](https://www.npmjs.com/package/pdf-parse) (PDF text extraction)
*   [Groq SDK](https://groq.com/docs/api) (AI integration for RAG, using `llama-3.3-70b-versatile`)
*   [Dotenv](https://www.npmjs.com/package/dotenv) (Environment variable management)

**Blockchain**:
*   [Solidity](https://soliditylang.org/) (Smart Contract Language - `ENotary.sol`)
*   [Hardhat](https://hardhat.org/) (Ethereum development environment for compilation, testing, deployment)
*   [Ethers.js](https://docs.ethers.org/v6/) (Client-side interaction with smart contract)

**Decentralized Storage**:
*   [IPFS](https://ipfs.io/) via [Pinata](https://www.pinata.cloud/) (Decentralized file storage and pinning service)

## Getting Started

Follow these steps to set up and run the DocProof application locally.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher (includes npm).
*   **Git**: For cloning the repository.
*   **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`.
*   **MetaMask**: A browser extension for interacting with Ethereum dApps.
*   **API Keys**:
    *   **Pinata JWT**: Obtain a JSON Web Token (JWT) from [Pinata](https://app.pinata.cloud/developers/api-keys) for IPFS pinning.
    *   **Groq API Key**: Get an API key from [Groq Console](https://console.groq.com/keys) for AI chat functionality.

### 1. Clone the Repository

Clone the project repository to your local machine:

```bash
git clone <repository-url>
cd blockchain-e-notary # Or the directory where you cloned the project
```

### 2. Backend API Setup

The backend API handles file uploads, IPFS pinning, and AI interactions.

Navigate to the `api` directory:

```bash
cd api
npm install
```

Create a `.env` file in the `api` directory and populate it with your environment variables:

```env
PRIVATE_KEY="YOUR_HARDHAT_ACCOUNT_PRIVATE_KEY" # Example: 0xac0974bec39a17e36ba4a6b4d238ff944bac478c940c5f247ee67d3220a23ff0 (from Hardhat local accounts)
CONTRACT_ADDRESS="YOUR_DEPLOYED_CONTRACT_ADDRESS" # This will be set after contract deployment in the next step
PINATA_JWT="YOUR_PINATA_JWT_TOKEN"
GROQ_API_KEY="YOUR_GROQ_API_KEY"
```

Keep this terminal open; you will start the backend server here later.

### 3. Smart Contract Deployment

Deploy the `ENotary` smart contract to a local Hardhat network.

Open a **new terminal** and navigate back to the project root directory (where `hardhat.config.js` is located).

```bash
# If you are in the 'api' directory, go back to the root:
cd ..
npm install # Install Hardhat dependencies
npx hardhat compile # Compile the smart contracts
```

Start a local Hardhat Network instance. This creates a local Ethereum blockchain environment and provides test accounts.

```bash
npx hardhat node
```

In yet another **new terminal**, deploy the `ENotary` contract to your running local Hardhat network:

```bash
# Ensure you are in the project root directory
npx hardhat run scripts/deploy.js --network localhost
```

You will see an output similar to `ENotary deployed to: <ADDRESS>`. Copy this address.

**Important Updates**:
*   Update the `CONTRACT_ADDRESS` in the `.env` file in your `api` directory.
*   Update the `contractAddress` variable in `lib/ethers.ts` (e.g., `const contractAddress = "<YOUR_DEPLOYED_CONTRACT_ADDRESS>";`).
*   Copy the compiled contract ABI for the frontend:
    ```bash
    cp artifacts/contracts/ENotary.sol/ENotary.json abi/ENotary.json
    ```

Keep the Hardhat node terminal running throughout your development session.

### 4. Frontend Application Setup

The frontend is a Next.js application that interacts with the backend API and the blockchain.

Open a **new terminal** and navigate to the project root directory (where `next.config.ts` and `app/` are located).

```bash
npm install # Install Next.js application dependencies
```

Now, start all three components:

**In your backend terminal (from step 2):**

```bash
npm start # Or node api/index.js
```

You should see: `Server running on port 5000`

**In your frontend terminal (from step 4):**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

The frontend will start on `http://localhost:3000`.

## Usage

1.  **Connect Wallet**: Open `http://localhost:3000` in your browser. Ensure your MetaMask wallet is connected to your local Hardhat network (typically `http://127.0.0.1:8545`). You may need to import one of the Hardhat test accounts into MetaMask using the private keys displayed in the `npx hardhat node` terminal.
2.  **Upload & Notarize**:
    *   Navigate to the "Upload" section (usually the home page `/`).
    *   Select a PDF document from your local machine.
    *   Click the "Upload & Notarize" button.
    *   The application will compute its SHA-256 hash, pin it to IPFS, and record the hash and CID on the blockchain. You will receive details like the document hash, IPFS CID, and blockchain transaction hash.
3.  **Verify Document**:
    *   Go to the "Verify" section (`/verify`).
    *   Upload the same document or any document you want to verify.
    *   The system will generate its hash and check if it has been notarized on the blockchain.
    *   If found, it will display the notarization details, including the IPFS CID, the owner's blockchain address, and the timestamp of notarization.
4.  **Ask AI**:
    *   Visit the "Ask" section (`/ask`).
    *   Enter the SHA-256 hash of a previously uploaded document (or paste it from the "Upload" result).
    *   Type your question about the document in the chat input.
    *   The AI will process your query and provide an answer based on the document's content.

## API Endpoints

The backend API server, running on `http://localhost:5000`, exposes the following endpoints:

*   **`POST /upload`**
    *   **Description**: Receives a PDF file, computes its SHA-256 hash, checks for existing notarization, pins it to Pinata (IPFS), notarizes the hash and CID on the `ENotary` smart contract, and extracts document text for AI RAG.
    *   **Request**: `multipart/form-data` with a file attached under the field name `file`.
    *   **Response**: `application/json`
        ```json
        {
          "message": "Uploaded and notarized successfully",
          "hash": "document_sha256_hash",
          "cid": "ipfs_content_id",
          "transaction": "blockchain_transaction_hash"
        }
        ```
        (If already notarized)
        ```json
        {
          "message": "Document already notarized. Not uploading again.",
          "hash": "document_sha256_hash",
          "cid": "existing_ipfs_content_id",
          "owner": "document_owner_address",
          "timestamp": 1678886400
        }
        ```
*   **`POST /verify`**
    *   **Description**: Verifies if a given SHA-256 document hash exists on the `ENotary` smart contract.
    *   **Request**: `application/json`
        ```json
        {
          "hash": "document_sha256_hash"
        }
        ```
    *   **Response**: `application/json`
        ```json
        {
          "verified": true,
          "cid": "ipfs_content_id",
          "timestamp": 1678886400,
          "owner": "document_owner_address"
        }
        ```
        (If not found)
        ```json
        {
          "verified": false
        }
        ```
*   **`POST /ask`**
    *   **Description**: Queries the AI about a document using its SHA-256 hash and a natural language question. The AI uses the document's extracted text (stored in memory after upload) for RAG.
    *   **Request**: `application/json`
        ```json
        {
          "hash": "document_sha256_hash",
          "question": "What is the summary of this document?"
        }
        ```
    *   **Response**: `application/json`
        ```json
        {
          "answer": "The AI's generated answer based on the document content."
        }
        ```

## Contributing

Contributions are highly encouraged! If you have suggestions for improvements, identify bugs, or wish to add new features, please feel free to:

1.  **Open an issue**: Describe the bug or feature request in detail.
2.  **Submit a pull request**: Fork the repository, make your changes, and submit a pull request with a clear description of your modifications.

## License

This project is open-source and released under the [MIT License](LICENSE).
