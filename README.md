# DevResolve AI

AI-powered troubleshooting platform that combines AI assistance with community-validated technical knowledge.

> Solve it once. Validate it together. Remember it forever.

---

## What It Does

When a developer submits a technical problem, DevResolve AI:

1. Retrieves relevant solutions from the community knowledge base (semantic search)
2. Feeds that context to an AI model (Google Gemini)
3. Generates a grounded troubleshooting response
4. Lets the community validate whether the solution worked
5. Builds trust scores over time

The result is answers that get better as more developers use the platform.

---

## Workflow

```
Developer submits problem
        |
        v
Semantic search (embeddings) finds similar solved problems
        |
        v
AI receives problem + community knowledge as context
        |
        v
AI generates structured analysis:
  - Problem understanding
  - Likely causes
  - Recommended solution
  - Step-by-step troubleshooting
  - Confidence level
        |
        v
Developer reviews solution
        |
        v
Community validates (worked / didn't work)
        |
        v
Trust score updated, solution becomes reusable knowledge
```

---

## Project Structure

```
devcommunity-ai/
│
├── backend/
│   ├── main.py                          # FastAPI app entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   ├── data/
│   │   ├── knowledge.json               # Persistent knowledge base
│   │   └── embeddings.json              # Cached embedding vectors
│   └── app/
│       ├── models/
│       │   ├── problem.py               # Problem submission schemas
│       │   ├── analysis.py              # AI analysis response schema
│       │   └── knowledge.py             # Knowledge entry schemas
│       ├── routes/
│       │   ├── problems.py              # Problem CRUD endpoints
│       │   ├── analysis.py              # AI analysis endpoint
│       │   └── knowledge.py             # Knowledge base endpoints
│       ├── services/
│       │   ├── ai_service.py            # Gemini AI integration
│       │   └── embedding_service.py     # Gemini embeddings for semantic search
│       └── storage/
│           ├── memory_store.py          # In-memory problem storage
│           └── knowledge_store.py       # Knowledge base with persistence
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts                   # Vite + API proxy config
│   ├── tsconfig.json
│   └── src/
│       ├── main.tsx                     # React entry point
│       ├── App.tsx                      # Layout + routing
│       ├── index.css                    # Tailwind + custom styles
│       ├── services/
│       │   └── api.ts                   # Backend API client
│       ├── components/
│       │   ├── Header.tsx               # Top navigation bar
│       │   ├── Sidebar.tsx              # Left sidebar navigation
│       │   ├── RightSidebar.tsx         # Stats + popular tags
│       │   └── KnowledgeCard.tsx        # Knowledge feed card
│       └── pages/
│           ├── HomePage.tsx             # Knowledge feed (Latest / Top)
│           ├── AskPage.tsx              # Problem submission + AI results
│           ├── KnowledgePage.tsx        # Searchable knowledge base
│           └── KnowledgeDetailPage.tsx  # Full solution + trust score
│
├── .gitignore
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Backend | Python, FastAPI, Pydantic |
| AI | Google Gemini (gemini-flash-latest) |
| Embeddings | Gemini Embedding API (gemini-embedding-001, 3072 dims) |
| Storage | JSON file persistence (MVP), in-memory for problems |

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| POST | `/api/problems/` | Submit a technical problem |
| GET | `/api/problems/` | List all problems |
| GET | `/api/problems/{id}` | Get a specific problem |
| POST | `/api/problems/{id}/analyze` | Trigger AI analysis |
| POST | `/api/knowledge/` | Save a solution as knowledge |
| GET | `/api/knowledge/` | List all knowledge entries |
| GET | `/api/knowledge/search?q=...&technology=...` | Search knowledge base |
| GET | `/api/knowledge/{id}` | Get a knowledge entry |

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A Google Gemini API key ([get one here](https://aistudio.google.com/apikey))

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Run the server
uvicorn main:app --reload
```

Backend runs at http://localhost:8000. API docs at http://localhost:8000/docs.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run dev server
npm run dev
```

Frontend runs at http://localhost:5173. API calls are proxied to the backend automatically.

---

## Environment Variables

Create `backend/.env`:

```env
# Server
HOST=0.0.0.0
PORT=8000

# Google Gemini
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

Never commit your `.env` file.

---

## How the AI Works

1. User submits a problem (technology, description, error message, logs)
2. The system generates a query embedding from the problem text
3. Cosine similarity finds the top 5 most relevant knowledge entries
4. Those entries are injected into the AI prompt as community context
5. Gemini generates a structured JSON response with:
   - Problem understanding
   - Likely causes (2-5)
   - Recommended solution
   - Troubleshooting steps (3-7)
   - Confidence level (low/medium/high)
6. If no knowledge matches, the AI still answers from its general training

---

## Features

- **Knowledge Feed** — browse solved problems like a dev community
- **Ask a Question** — submit problems and get AI-powered analysis
- **Semantic Search** — find solutions using natural language (not just keywords)
- **Trust Scores** — see how many developers validated each solution
- **Technology Filtering** — filter by Docker, Git, AWS, Python, etc.
- **Community Validation** — upvote/downvote solutions to build trust

---

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1. Backend Foundation | Done | FastAPI + problem submission |
| 2. AI Troubleshooting | Done | Gemini integration |
| 3. Knowledge Base | Done | Storage + keyword search |
| 4. RAG Integration | Done | Semantic search with embeddings |
| 5. Frontend | Done | React community-feed UI |
| 6. Community Validation | Planned | Upvote/downvote + trust scoring |

---

## License

Hackathon project. License TBD.
