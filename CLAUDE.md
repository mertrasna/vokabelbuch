# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vokabelbuch ("vocabulary book") is a vocabulary learning app. The stack:
- **Frontend:** React 19 + Vite + TypeScript — in `frontend/`
- **Backend:** Go HTTP server — not yet created, will live in `backend/` (or similar)
- **Database:** Supabase (PostgreSQL)

This is a learning project focused on Go backend development, SQL/Supabase, and REST API design.

## Frontend Commands

Run from the `frontend/` directory:

```bash
npm run dev       # start dev server (HMR)
npm run build     # type-check + production build
npm run lint      # eslint
npm run preview   # preview production build locally
```

## Architecture

The intended data flow:

```
React (frontend/) → HTTP → Go backend → Supabase (PostgreSQL)
```

The frontend uses `@supabase/supabase-js` (already installed) — this may be used for direct Supabase access from the frontend, or only the Go backend will talk to Supabase. That decision is TBD as the backend is built.

Supabase credentials go in `frontend/.env.local` (gitignored) as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
