# Project Structure and Component Details

This document describes the purpose of each folder, key file, and major application section for the KiddoAI repository. It is intended to help developers understand how the frontend, backend, and Docker setup work together.

## Repository Overview

The repository is organized as a multi-container application with a client-side frontend and a server-side backend.

- `backend/` contains the Node.js Express API proxy.
- `frontend/` contains the React application built with Vite.
- `.env.example` provides environment variable hints.
- `docker-compose.yml` describes how the backend and frontend services are built and run together.
- `README.md` provides setup and usage instructions.
- `CONTRIBUTING.md` describes contribution guidelines.
- `LICENSE` provides licensing terms.

## Docker Compose

File: `docker-compose.yml`

This file defines two services:

- `backend`: Builds the backend service from `./backend`, exposes port `5000`, and reads the `GEMINI_API_KEY` environment variable from the host environment.
- `frontend`: Builds the frontend service from `./frontend`, exposes port `3000`, and provides the backend URL as a build argument.

The frontend service depends on the backend service, so Docker Compose starts the backend first.

## Backend

Folder: `backend/`

### `package.json`

- Lists backend dependencies: `express`, `cors`, `dotenv`, and `@google/generative-ai`.
- Defines the backend start command: `node server.js`.

### `server.js`

This file implements the backend server and AI proxy.

Key responsibilities:

- Load environment variables using `dotenv`.
- Start an Express server on `PORT` or default port `5000`.
- Enable CORS and JSON request parsing with a 5 MB payload limit.
- Provide a single POST endpoint at `/api/chat`.

Detailed behavior:

1. **Safety guardrails**: A string block of rules is appended to conversational context to enforce child-friendly responses, prevent personal data collection, block unsafe content, and keep replies simple.
2. **Buddy prompts**: Four persona prompts are defined: `sparky`, `luna`, `owl`, and `coco`. Each persona includes a custom instruction and shares the safety guardrails.
3. **Offline fallback**: If the `GEMINI_API_KEY` is missing or empty, the backend responds locally using `getOfflineResponse`. This function returns canned responses based on the user input and selected buddy persona.
4. **API calls**: If an API key is present, the backend initializes the Google Gemini client and sends the user message and optional image data to the model.
5. **Image handling**: If an image is provided, the backend strips the base64 prefix and includes the image as inline data in the AI request, along with a text prompt that asks the model to transcribe and explain the image in a kid-friendly way.
6. **Error handling**: The backend catches API errors and returns a friendly response text.

## Frontend

Folder: `frontend/`

### `package.json`

- Lists dependencies: `react`, `react-dom`, `lucide-react`.
- Lists dev dependencies: `vite`, `@vitejs/plugin-react`, `oxlint`, and TypeScript definitions.
- Defines scripts: `dev`, `build`, `lint`, and `preview`.

### `vite.config.js`

- Provides Vite configuration for building and serving the React application.

### `src/main.jsx`

- Bootstraps the React application by rendering `<App />` into the DOM root.
- Registers a service worker in production using `registerSW.js`.

### `src/registerSW.js`

- Registers the service worker only when the browser supports it and when Vite is running in production mode.
- This enables offline caching and faster page loads in production builds.

### `src/App.jsx`

This is the main application component.

Core responsibilities:

- Manage application state for:
  - active buddy persona
  - active view (chat, draw, quiz, rewards)
  - chat messages
  - user input text
  - attached image data
  - AI thinking/loading state
  - star points and unlocked badges
  - parental settings and time limits
  - voice recognition state
- Persist chat history, star count, badges, and time limit to `localStorage`.
- Handle navigation between views.
- Perform chat submissions and send data to the backend.
- Animate and update the UI with relevant responses and gamification.

Detailed behavior:

1. **Buddy selection**: The selected persona controls theme colors, voice parameters, introduced text, and the safety prompt used by the backend.
2. **Chat handling**: `handleSendMessage` packages the user message and optional base64 image, compresses the image if needed, stores the user message, sends the request to the backend via `fetchAIResponse`, and then stores the response.
3. **Star and badge system**: The app awards stars for chat interactions, quiz success, and specific persona activities. It unlocks badges automatically when conditions are met.
4. **Voice control**: The app uses `SpeechToTextEngine` for voice input and `speakText` for text-to-speech output.
5. **Time limit enforcement**: The app runs a timer when a time limit is configured. When the limit is reached, it displays a lock screen and allows parent override via a math challenge.
6. **User interface composition**: The main view renders one of the child components depending on the current active tab.

### `src/components/BuddySelector.jsx`

- Displays a card for each buddy persona.
- Writes selected persona theme colors to CSS variables on the document root.
- Calls `speakText` with the persona introduction when a buddy is selected.

Exports:

- `BuddySelector` component for the selection UI.
- `BUDDY_LIST` array with defined personas.

### `src/components/ChatFeed.jsx`

- Displays chat messages from the user and the AI buddy.
- Scrolls automatically to the latest message.
- Provides input controls for text, microphone, scanner, and send button.
- Shows an optional attached image preview.
- Uses `stopSpeaking()` on unmount to cancel speech.

### `src/components/DrawingBoard.jsx`

- Implements a canvas drawing UI.
- Supports mouse and touch drawing.
- Provides color selection and pen size adjustment.
- Offers buttons to clear the canvas and send the drawing to the chat feed.
- Serializes the canvas contents into a compressed JPEG base64 string.

### `src/components/HomeworkScanner.jsx`

- Uses the browser camera (`getUserMedia`) to capture a photo.
- Allows front/back camera switching on capable devices.
- Offers an upload fallback for image files.
- Captures a still frame from the video feed and returns a JPEG base64 string.

### `src/components/LearnQuiz.jsx`

- Renders a quiz interface with predefined questions.
- Allows the user to choose an answer and reveals correctness.
- Awards stars for correct answers and provides hints.
- Advances through questions on completion.

### `src/components/ParentDashboard.jsx`

- Provides a parent gate that requires solving a math problem before exposing settings.
- Allows parents to set a daily time limit for use.
- Shows recent user message activity from the chat history.
- Saves the selected time limit to `localStorage` and communicates the setting back to `App`.

### `src/components/RewardsCenter.jsx`

- Displays the current star count and progress toward the next milestone.
- Lists all available badges and highlights unlocked ones.
- Uses the `unlockedBadges` array to determine which badges are earned.

### `src/services/aiService.js`

- Provides the `fetchAIResponse` function used to send chat payloads to the backend proxy.
- Sets the backend endpoint from `import.meta.env.VITE_BACKEND_URL` or defaults to `http://localhost:5000`.
- Sends JSON payload with `message`, `image`, and `buddyId`.
- Handles response statuses and returns a fallback error message if the request fails.

### `src/services/voiceService.js`

- Implements `speakText` for text-to-speech using the Web Speech API.
- Configures voice pitch and rate based on the selected buddy persona.
- Provides `stopSpeaking` to cancel active speech synthesis.
- Defines `SpeechToTextEngine` for browser speech recognition using `SpeechRecognition` or `webkitSpeechRecognition`.
- Handles recognition lifecycle events and returns transcribed text via callbacks.

### `src/services/imageOptimizer.js`

- Compresses base64 image data before sending it to the backend.
- Resizes image dimensions to a maximum of 800x800 pixels while preserving aspect ratio.
- Converts images to JPEG format at 80% quality.
- Logs compression statistics to the browser console.

## Frontend Styles and Assets

- `frontend/src/App.css`: Contains application-specific styling for layout, panels, buttons, and the chat UI.
- `frontend/src/index.css`: Global styles and CSS variable definitions.
- `frontend/assets/`: Static asset folder used by the React app.

## Environment Variables

File: `.env.example`

- `GEMINI_API_KEY`: Optional key used by the backend to authorize requests to the Gemini API.
- `PORT`: Optional backend port override.

## How the Flow Works

1. The user opens `http://localhost:3000`.
2. The React app loads and initializes `App.jsx`.
3. The user selects a buddy persona, which sets theme colors and voice behavior.
4. The user enters text, speaks a question, attaches an image, or draws on the canvas.
5. The app stores the chat history and sends the request to the backend via `fetchAIResponse`.
6. The backend receives the request at `/api/chat`.
7. If `GEMINI_API_KEY` is configured, the backend forwards the prompt and any image data to the Gemini model with safety guardrails.
8. If no API key is configured, the backend returns a local fallback response.
9. The frontend displays the AI response, optionally speaks the response aloud, and awards stars or badges.

## Notes

- The backend is responsible for keeping the AI key secure and preventing direct browser access to the key.
- The frontend includes offline and mobile-friendly components such as camera capture, drawing, voice input, and local persistence.
- The parent dashboard and time limit logic are designed to provide basic supervision controls.

## File Summary

| Path | Purpose |
|------|---------|
| `backend/server.js` | Main backend API proxy and safety layer |
| `backend/package.json` | Backend dependencies and start script |
| `frontend/src/App.jsx` | Main frontend application state and routing |
| `frontend/src/main.jsx` | React app bootstrap |
| `frontend/src/registerSW.js` | Service worker registration |
| `frontend/src/services/aiService.js` | Backend request helper |
| `frontend/src/services/voiceService.js` | Speech synthesis and recognition logic |
| `frontend/src/services/imageOptimizer.js` | Client-side image compression |
| `frontend/src/components/BuddySelector.jsx` | Buddy persona selector |
| `frontend/src/components/ChatFeed.jsx` | Chat user interface and input controls |
| `frontend/src/components/DrawingBoard.jsx` | Canvas drawing and send logic |
| `frontend/src/components/HomeworkScanner.jsx` | Camera capture and image upload modal |
| `frontend/src/components/LearnQuiz.jsx` | Quiz interface and scoring logic |
| `frontend/src/components/ParentDashboard.jsx` | Parental settings and lock screen control |
| `frontend/src/components/RewardsCenter.jsx` | Stars and badge display |
| `docker-compose.yml` | Defines multi-container service orchestration |
| `.env.example` | Environment variable template |

## Conclusion

This document describes how the KiddoAI repository is structured and how each major part functions. Use this as a reference for development, debugging, and extending the application.