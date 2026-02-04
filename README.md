# AI-Powered Learning Assistant for Textbooks, Code, and Videos

## Overview
A production-ready full-stack learning assistant that lets authenticated users upload documents, chat with their content, analyze YouTube videos, explain code, and generate quizzes. The system uses a modular FastAPI backend, Supabase Auth + Storage + Postgres, and a Vite + React + Tailwind frontend.

## Architecture
- **Frontend**: React (Vite) + Tailwind CSS + React Three Fiber (3D login background)
- **Backend**: FastAPI with service-layer abstractions
- **Auth & Storage**: Supabase Auth, Supabase Storage
- **LLM/Embeddings**: Hugging Face Inference API (swap via environment variables)

## Project Structure
```
chatbot-app/
├── frontend/
└── backend/
```

## Backend Setup (FastAPI)
1. Create and configure your `.env` file using the template:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Install dependencies:
   ```bash
   cd chatbot-app/backend
   pip install -r requirements.txt
   ```
3. Set the following in `backend/.env` (keep service role key server-side only):
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `SUPABASE_ANON_KEY`
   - `HF_API_KEY`
4. Run the API:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Supabase Tables
Create the following tables in Supabase (SQL editor). Enable Row Level Security (RLS).

```sql
create table users (
  id uuid primary key,
  first_name text,
  last_name text,
  email text unique
);

create table documents (
  id uuid primary key default uuid_generate_v4(),
  file_name text,
  file_path text,
  created_at timestamp default now()
);

create table document_chunks (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  chunk_index int,
  content text,
  embedding jsonb
);

create table chat_history (
  id uuid primary key default uuid_generate_v4(),
  document_id uuid references documents(id) on delete cascade,
  question text,
  answer text,
  created_at timestamp default now()
);

create table youtube_analysis (
  id uuid primary key default uuid_generate_v4(),
  video_url text,
  transcript text,
  summary text,
  created_at timestamp default now()
);

create table quiz_results (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id),
  score int,
  created_at timestamp default now()
);
```

### Storage
Create a Supabase Storage bucket named `documents` with private access.

## Frontend Setup (Vite + React)
1. Install dependencies:
   ```bash
   cd chatbot-app/frontend
   npm install
   ```
2. Create a `.env` file:
   ```bash
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   VITE_API_BASE_URL=http://localhost:8000
   ```
   - Do not commit `.env` files. Use Vercel environment variables for production.
3. Run the frontend:
   ```bash
   npm run dev
   ```

## Deployment
- **Frontend (Vercel)**: Deploy `chatbot-app/frontend`. Set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `VITE_API_BASE_URL` in Vercel environment variables.
- **Backend (Render)**: Deploy `chatbot-app/backend` as a FastAPI service. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, and `HF_API_KEY` in Render environment variables.

## Features
- ✅ Supabase Auth signup/login with profile storage
- ✅ Document upload + extraction + embedding + context-grounded Q&A
- ✅ YouTube transcript analysis + follow-up Q&A
- ✅ Code/text explainer with structured summaries
- ✅ Quiz generation with scoring
- ✅ Light/dark mode dashboard
- ✅ 3D login background

## Notes
- Hugging Face Inference API requires a free API key. Configure `HF_API_KEY` in backend `.env`.
- YouTube transcription falls back to Whisper if transcripts are unavailable.
