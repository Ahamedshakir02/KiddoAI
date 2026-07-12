# Joy - AI Kiddo Companion

Joy is a full-stack application that provides a child-focused AI companion experience. The project uses Docker Compose to run a React frontend and a Node.js backend proxy.

## Repository Structure

- `backend/`
  - `server.js`: Express API server and proxy logic.
  - `package.json`: backend dependencies and start script.
- `frontend/`
  - `vite.config.js`: Vite configuration.
  - `src/`: React application source files.
  - `package.json`: frontend dependencies and scripts.
- `.env.example`: environment variable template.
- `docker-compose.yml`: service definitions for frontend and backend.

## Requirements

- Docker Desktop installed.
- Optional: Google Gemini API key for online AI features.

## Configuration

1. Copy `.env.example` to `.env` in the repository root.
2. Set `GEMINI_API_KEY` if you want the backend to use the Gemini API.

Example `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

If `GEMINI_API_KEY` is not configured, the backend runs in offline simulation mode.

## Running the Application

From the repository root:

```bash
docker-compose up --build
```

The frontend is served at `http://localhost:3000`.

The backend is served at `http://localhost:5000`.

### With an API Key

On Windows PowerShell:

```powershell
$env:GEMINI_API_KEY="your_api_key_here"; docker-compose up --build
```

On Linux or macOS:

```bash
GEMINI_API_KEY="your_api_key_here" docker-compose up --build
```

## Features

- React frontend served from `frontend/`.
- Express backend proxy in `backend/`.
- Docker Compose for local development.
- Offline fallback mode when no API key is present.
- Safety guardrails in the backend for child-friendly interaction.

## Contribution

See `CONTRIBUTING.md` for contribution guidelines.

## License

This project is licensed under the MIT License. See `LICENSE` for details.
