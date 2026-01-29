<div align="center">
  <img src="apps/web/public/logo.svg" alt="ConvoFlow Logo" width="120" height="120">
  
  # ConvoFlow
  
  **Real-time transcription for Google Meet and Zoom meetings**
  
  Transform your virtual meetings into searchable, actionable transcripts with AI-powered real-time transcription.
</div>

---

## 📑 Table of Contents

- [Getting Started](#-getting-started)
- [How It Works](#-how-it-works)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Setup Guide](#-setup-guide)

---

## 🚀 Getting Started

ConvoFlow makes it easy to capture and transcribe your online meetings in real-time. Here's how to get started:

### First Time Setup

When you open the ConvoFlow extension for the first time, you'll see the welcome screen:

![ConvoFlow Welcome Screen](screenshots/hero.png)

Click **"Get Started"** to sign in with your Google account and start capturing your meetings.

### Recording a Meeting

Once you're logged in, open the extension from any Google Meet or Zoom meeting:

![ConvoFlow Home](screenshots/home.png)

Click the **"Record"** button to start capturing the meeting audio. The extension will begin transcribing in real-time.

### Viewing Transcripts

Access your meeting transcripts on the web dashboard where you can see live transcription as the meeting progresses:

![Meeting Transcript](screenshots/transcript.png)

Your transcripts are automatically saved and organized by workspace for easy access later.

---

## 🏗️ Architecture

ConvoFlow is built as a monorepo with three interconnected applications that work together to deliver seamless meeting transcription:

```mermaid
graph TB
    User([User])
    
    subgraph Browser["🌐 Browser"]
        Extension["Chrome Extension<br/>(Recording & Audio Capture)"]
        WebApp["Web Application<br/>(Dashboard & Transcripts)"]
    end
    
    subgraph Backend["☁️ Backend Services"]
        TranscriptAPI["Transcript API<br/>(WebSocket + SSE Server)"]
        Deepgram["Deepgram AI<br/>(Speech-to-Text)"]
        Database[(PostgreSQL Database)]
    end
    
    User -->|Opens meeting| Extension
    User -->|Views transcripts| WebApp
    
    Extension -->|Sends audio stream| TranscriptAPI
    Extension -->|Creates/updates meetings| WebApp
    
    TranscriptAPI -->|Transcribes audio| Deepgram
    Deepgram -->|Returns text| TranscriptAPI
    TranscriptAPI -->|Saves segments| Database
    
    Database -->|Real-time updates| TranscriptAPI
    TranscriptAPI -->|Streams transcripts| WebApp
    
    WebApp -->|Reads data| Database
    
    style Extension fill:#4285f4,color:#fff
    style WebApp fill:#34a853,color:#fff
    style TranscriptAPI fill:#fbbc04,color:#000
    style Deepgram fill:#ea4335,color:#fff
    style Database fill:#9333ea,color:#fff
```

**How it works:**

1. **Extension** captures audio from Google Meet or Zoom meetings and streams it via WebSocket
2. **Transcript API** receives the audio, sends it to Deepgram for transcription, and saves segments to the database
3. **Web App** displays real-time transcripts using Server-Sent Events (SSE) and provides a dashboard to manage meetings

---

## ✨ Features

- ✅ **Real-time Transcription** - Live transcription of Google Meet and Zoom meetings
- ✅ **Chrome Extension** - Easy-to-use browser extension for one-click recording
- ✅ **Web Dashboard** - Beautiful interface to view and manage your transcripts
- ✅ **Workspace Management** - Organize meetings by workspace with role-based access
- ✅ **Live Meeting Status** - See which meetings are currently being recorded
- ✅ **Speaker Diarization** - Identify different speakers in your transcripts
- ✅ **Secure Authentication** - Google OAuth integration for secure access
- 🔜 **Meeting Summary** - AI-generated summaries of your meetings (Coming Soon)
- 🔜 **Action Items** - Automatically extract action items from transcripts (Coming Soon)

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful UI components
- **[Plasmo](https://www.plasmo.com/)** - Chrome extension framework

### Backend
- **[Express](https://expressjs.com/)** - HTTP server for SSE endpoints
- **[WebSocket (ws)](https://github.com/websockets/ws)** - Real-time audio streaming
- **[Deepgram](https://deepgram.com/)** - AI-powered speech-to-text
- **[PostgreSQL](https://www.postgresql.org/)** - Primary database with real-time notifications
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library

### DevOps & Tools
- **[Turborepo](https://turbo.build/repo)** - Monorepo build system
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[ESLint](https://eslint.org/)** - Code linting
- **[TypeScript](https://www.typescriptlang.org/)** - Static type checking

---

## 📦 Setup Guide

### Prerequisites

- **Node.js** >= 20
- **pnpm** >= 10.4.1
- **PostgreSQL** database (we recommend [Neon](https://neon.tech/) for serverless Postgres)
- **Deepgram API Key** - Get one at [deepgram.com](https://deepgram.com/)
- **Google OAuth Credentials** - Set up at [Google Cloud Console](https://console.cloud.google.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ConvoFlow.git
   cd ConvoFlow
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create `.env` files in the following locations with the required variables:

   #### `packages/db/.env`
   ```env
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&connect_timeout=15&pool_timeout=15"
   DIRECT_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

   #### `apps/web/.env`
   ```env
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&channel_binding=require"
   
   # Authentication (Google OAuth)
   AUTH_GOOGLE_ID="your-google-client-id"
   AUTH_GOOGLE_SECRET="your-google-client-secret"
   BETTER_AUTH_SECRET="your-random-secret-key"
   
   # API URLs
   NEXT_PUBLIC_API_BASE_URL="http://localhost:8080"
   ```

   #### `apps/transcript-api/.env`
   ```env
   # Deepgram API
   DEEPGRAM_API_KEY="your-deepgram-api-key"
   
   # Database
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&channel_binding=require"
   
   # CORS Configuration
   WEB_APP_URL="http://localhost:3000"
   EXTENSION_URL="chrome-extension://your-extension-id"
   
   # Server Port (optional, defaults to 8080)
   PORT=8080
   ```

   #### `apps/extension/.env`
   ```env
   # Backend URL
   PLASMO_PUBLIC_BACKEND_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   pnpm db:generate  # Generate Prisma client
   pnpm db:push      # Push schema to database
   ```

5. **Start the development servers**

   In separate terminal windows:

   ```bash
   # Terminal 1: Web application
   cd apps/web
   pnpm dev
   
   # Terminal 2: Transcript API
   cd apps/transcript-api
   pnpm dev
   
   # Terminal 3: Chrome extension
   cd apps/extension
   pnpm dev
   ```

6. **Load the extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `apps/extension/build/chrome-mv3-dev` directory

### Production Deployment

1. **Build all applications**
   ```bash
   pnpm build
   ```

2. **Run database migrations**
   ```bash
   pnpm db:deploy
   ```

3. **Deploy the services**
   - **Web App**: Deploy to [Vercel](https://vercel.com/) or any Next.js hosting platform
   - **Transcript API**: Deploy to a Node.js server or container platform
   - **Extension**: Package with `cd apps/extension && pnpm package` and submit to Chrome Web Store

### Environment Variables Reference

| Variable | App | Required | Description |
|----------|-----|----------|-------------|
| `DATABASE_URL` | All | ✅ | PostgreSQL connection string |
| `DIRECT_URL` | db | ✅ | Direct database connection (for migrations) |
| `AUTH_GOOGLE_ID` | web | ✅ | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | web | ✅ | Google OAuth client secret |
| `BETTER_AUTH_SECRET` | web | ✅ | Secret key for Better Auth |
| `NEXT_PUBLIC_API_BASE_URL` | web | ✅ | Transcript API base URL |
| `DEEPGRAM_API_KEY` | transcript-api | ✅ | Deepgram API key for speech-to-text |
| `WEB_APP_URL` | transcript-api | ❌ | Web app URL for CORS (default: `http://localhost:3000`) |
| `EXTENSION_URL` | transcript-api | ❌ | Extension URL for CORS |
| `PORT` | transcript-api | ❌ | Server port (default: `8080`) |
| `PLASMO_PUBLIC_BACKEND_URL` | extension | ✅ | Backend web app URL |

