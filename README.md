# Joy - Secure AI Kiddo Companion (Dockerized Full-Stack)

Joy is a responsive, highly interactive, and kid-friendly AI assistant designed for educational guidance, storytelling, math riddles, and creative whiteboard drawing.

This repository is organized as a production-grade **Dockerized multi-container stack** separating the client-side frontend from the server-side API proxy.

---

## 🛠️ Architecture & Port Mappings

```
                    ┌─────────────────────────┐
                    │       Web Browser       │ (Access via http://localhost:3000)
                    └────────────┬────────────┘
                                 │ HTTP / JSON (CORS)
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Docker Compose Network                      │
│                                                                 │
│   ┌──────────────────────┐             ┌─────────────────────┐  │
│   │       Frontend       │             │       Backend       │  │
│   │     (React + Nginx)  ├────────────>│  (Node.js + Express)│  │
│   │                      │   API Proxy │                     │  │
│   │       Port 3000      │   Port 5000 │      Port 5000      │  │
│   └──────────────────────┘             └──────────┬──────────┘  │
└───────────────────────────────────────────────────┼─────────────┘
                                                    │ HTTPS / JSON
                                                    ▼
                                         ┌─────────────────────┐
                                         │  Google Gemini API  │ (Securely Authenticated)
                                         └─────────────────────┘
```

1. **Frontend (`frontend/`)**: React (built with Vite) served by a high-performance, single-stage **Nginx** server on port **3000**. Employs browser-native SpeechRecognition, SpeechSynthesis, and Canvas touch drawing.
2. **Backend Proxy (`backend/`)**: Node.js & Express API routing server on port **5000**. Handles CORS, system safety directives, memory-state simulation fallbacks, and secure API requests to the Google Gemini 1.5 model.

---

## 🔒 Security & Privacy Guidelines

- **No Exposure of API Keys**: The Gemini API key is *never* exposed to the browser. The frontend queries the backend proxy, which appends the key from secure system environment variables on the server-side.
- **Kid Safety System Instruction**: A mandatory safety wrapper is injected into every Gemini request on the server-side to enforce strict parameters:
  - **No PII collection**: Gently blocks and filters phone numbers, addresses, last names, or passwords.
  - **Jailbreak resistance**: Ignores instructions to ignore safety instructions.
  - **5th Grade Reading Level Limit**: Simplifies vocabulary and utilizes friendly analogies.
  - **Adult/Sensitive Topic blocks**: Steering queries toward discussions with a parent or teacher.

---

## 🚀 How to Run the Application

You can launch the complete full-stack environment instantly using Docker.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed on your machine.

### Quick Start (Offline Local Simulation)
To run the app locally without any Gemini API key (running in the local companion mock mode):
```bash
docker-compose up --build
```
Once the containers boot, open your browser to **[http://localhost:3000](http://localhost:3000)**!

### Active Online Mode (With Gemini AI OCR & Handwriting help)
To enable real handwriting recognition, multi-language translation, and live conversations, pass your Google Gemini API key:

#### Option A: CLI Variable (Command Line)
On Windows PowerShell:
```powershell
$env:GEMINI_API_KEY="your_api_key_here"; docker-compose up --build
```
On Linux/macOS:
```bash
GEMINI_API_KEY="your_api_key_here" docker-compose up --build
```

#### Option B: Environment File (`.env`)
Create a `.env` file in the root workspace directory:
```env
GEMINI_API_KEY=your_actual_api_key_here
```
And simply run:
```bash
docker-compose up --build
```
Now, children can upload snapshots of handwriting, drawings, and calculations, and get intelligent, guided visual learning corrections!
