# Spur Store - AI Customer Support Agent 🛍️

A full-stack AI-powered customer support chat application built for the Spur Founding Full-Stack Engineer take-home assignment.

## 🎯 Live Demo

**Frontend**: https://spur-founding-full-stack-engineer-a.vercel.app/
**Backend**: https://spur-founding-fullstack-engineer-ai-live.onrender.com

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Gemini API Key ([Get one free](https://aistudio.google.com/app/apikey))

### 1. Clone & Install

```bash
git clone https://github.com/2003nayan/Spur_Founding_FullStack_Engineer_AI_Live_Chat_Agent
cd Spur_Founding_FullStack_Engineer_AI_Live_Chat_Agent

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd client
npm install
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env

# Edit .env and add your Gemini API key:
# GEMINI_API_KEY=your_key_here
```

### 3. Run the Application

**Terminal 1 - Backend:**

```bash
cd server
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Open the App

Navigate to **http://localhost:5173** and start chatting!

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│              React + TypeScript + Vite + Tailwind           │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐ │
│  │   App.tsx   │  │ MessageList  │  │     ChatInput       │ │
│  │  (Layout)   │  │  (Display)   │  │   (User Input)      │ │
│  └─────────────┘  └──────────────┘  └─────────────────────┘ │
│                         │                                   │
│                  ┌──────┴──────┐                            │
│                  │  useChat()  │  ← Custom hook             │
│                  └──────┬──────┘                            │
│                         │                                   │
│                  ┌──────┴──────┐                            │
│                  │  api/chat   │  ← API client              │
│                  └──────┬──────┘                            │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP (REST)
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                      Backend                                │
│           Node.js + Express + TypeScript                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              routes/chat.ts + Zod Validation          │  │
│  │  POST /chat/message  │  GET /chat/history/:sessionId  │  │
│  └──────────────────────────────────────────────────────┘   │
│         │                         │                         │
│  ┌──────┴──────┐          ┌──────┴──────┐                   │
│  │ services/   │          │    db/      │                   │
│  │   llm.ts    │          │  index.ts   │                   │
│  │  + p-retry  │          │  (SQLite)   │                   │
│  └──────┬──────┘          └──────┬──────┘                   │
│         │                        │                          │
│  ┌──────┴──────┐                 │                          │
│  │Rate Limiter │                 │                          │
│  └─────────────┘                 │                          │
└─────────────────────────┬────────┼──────────────────────────┘
                          │        │
                          ▼        ▼
                   ┌──────────────┐  ┌───────────────┐
                   │  Gemini API  │  │  SQLite DB    │
                   │  (Google AI) │  │  (chat.db)    │
                   └──────────────┘  └───────────────┘
```

### Backend Structure (Separation of Concerns)

```
server/
├── src/
│   ├── index.ts              # Express server + rate limiting
│   ├── routes/
│   │   └── chat.ts           # API endpoints + Zod validation
│   ├── services/
│   │   └── llm.ts            # LLM integration + retry logic
│   └── db/
│       └── index.ts          # SQLite database layer
├── data/
│   └── chat.db               # SQLite database (auto-created)
├── .env.example              # Environment template
└── package.json
```

### Frontend Structure

```
client/
├── src/
│   ├── App.tsx               # Main layout + sticky header
│   ├── components/
│   │   ├── MessageList.tsx   # Messages + quick actions
│   │   ├── ChatInput.tsx     # Input with validation
│   │   └── Toast.tsx         # Error notifications
│   ├── hooks/
│   │   └── useChat.ts        # Chat state management
│   └── api/
│       └── chat.ts           # API client functions
├── tailwind.config.js
└── package.json
```

---

## 📊 Database Schema

**SQLite** with auto-creation on first run. Easily migratable to PostgreSQL.

```sql
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,              -- UUID
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,    -- FK to conversations
  sender TEXT NOT NULL,             -- 'user' or 'ai'
  content TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
```

---

## 🤖 LLM Integration

### Provider: Google Gemini (gemini-2.5-flash)

### Agent: "Ria"

The support agent has a personality and name for a more human experience.

### Multi-lingual Support 🌐

Responds in the same language the user writes:

- English → English response
- Hindi → हिंदी में जवाब
- Hinglish → Mix mein reply

### System Prompt Features

- Store policies (Returns, Shipping, Support Hours)
- Prices in USD and INR
- Friendly, professional tone with occasional emojis
- Offers to connect with specialists when needed

### Resilience (p-retry)

- 3 automatic retries with exponential backoff
- Handles rate limits, timeouts, and server errors gracefully

---

## ✨ Features

### Core Features (Part 1 - Must Have)

| Feature                                 | Status |
| --------------------------------------- | ------ |
| Chat UI with scrollable messages        | ✅     |
| User/AI message distinction             | ✅     |
| Send on Enter key                       | ✅     |
| Auto-scroll to latest message           | ✅     |
| "Ria is typing..." indicator            | ✅     |
| Disabled input while loading            | ✅     |
| Session persistence (localStorage)      | ✅     |
| History reload on refresh               | ✅     |
| Input validation (empty, max 500 chars) | ✅     |
| Error handling with toast notifications | ✅     |
| Real LLM integration (Gemini)           | ✅     |

### Senior Engineer Features (Part 2)

| Feature                                | Status |
| -------------------------------------- | ------ |
| **Zod validation** for request schemas | ✅     |
| **Exponential backoff** (p-retry)      | ✅     |
| **Rate limiting** (20 msg/min)         | ✅     |
| Structured architecture (SOC)          | ✅     |

### UX Polish Features (Part 3)

| Feature                             | Status |
| ----------------------------------- | ------ |
| Markdown rendering (react-markdown) | ✅     |
| Optimistic UI updates               | ✅     |
| WhatsApp-style quick action buttons | ✅     |
| Welcome screen with suggestions     | ✅     |
| New Chat button                     | ✅     |
| Sticky header                       | ✅     |
| Multi-lingual responses             | ✅     |
| Agent name "Ria"                    | ✅     |

---

## 🔒 Environment Variables

| Variable         | Required | Description                 |
| ---------------- | -------- | --------------------------- |
| `GEMINI_API_KEY` | ✅       | Google AI Studio API key    |
| `PORT`           | ❌       | Server port (default: 3001) |

---

## 🧪 Robustness Testing

The app handles:

- ✅ Empty messages → Blocked with validation error
- ✅ Long messages → 500 char limit with counter
- ✅ API failures → Toast notification
- ✅ Invalid session IDs → Creates new session
- ✅ Rate limiting → Friendly "slow down" message
- ✅ Network errors → User-friendly error message
- ✅ Page refresh → Restores conversation history

---

## 🚀 Deployment

### Backend (Render)

1. Create new Web Service on Render
2. Connect GitHub repo
3. Build: `cd server && npm install && npm run build`
4. Start: `cd server && npm start`
5. Add env var: `GEMINI_API_KEY`

### Frontend (Vercel)

1. Import project to Vercel
2. Root directory: `client`
3. Framework: Vite
4. Build command: `npm run build`

---

## 📝 Trade-offs & Future Improvements

### Current Trade-offs

1. **SQLite** → Used for simplicity; schema works with PostgreSQL
2. **Single LLM** → Only Gemini; could add OpenAI/Anthropic fallback
3. **No Auth** → Anonymous sessions; would add user auth in production

### If I Had More Time...

- Multi-provider LLM fallback (OpenAI, Anthropic)
- WebSocket for real-time typing indicators
- Conversation search functionality
- Admin dashboard with analytics
- Multi-channel support (WhatsApp, Instagram ready)
- Comprehensive test suite (Jest, Playwright)

---

## 🛠️ Tech Stack

| Layer      | Technology                               |
| ---------- | ---------------------------------------- |
| Frontend   | React 18, TypeScript, Vite, Tailwind CSS |
| Backend    | Node.js, Express, TypeScript             |
| Database   | SQLite (better-sqlite3)                  |
| LLM        | Google Gemini (gemini-2.5-flash)         |
| Validation | Zod                                      |
| Resilience | p-retry (exponential backoff)            |
| Security   | express-rate-limit                       |
| Markdown   | react-markdown, @tailwindcss/typography  |

---

## 📄 License

MIT
