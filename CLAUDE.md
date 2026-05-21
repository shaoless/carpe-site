# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npx drizzle-kit push # Push schema changes to SQLite
npx tsx src/lib/db/seed.ts  # Seed database (default admin: admin/admin123)
```

## Architecture

This is a single Next.js 16 (App Router) project serving both a public-facing company website and an admin CMS — all backed by a SQLite database.

```
src/app/
├── (public)/          # Route group — public company site
│   ├── layout.tsx     #   Header + Footer wrapper
│   ├── page.tsx       #   Home (hero, featured projects/news)
│   ├── about/         #   Company culture & timeline
│   ├── projects/      #   Project portfolio
│   └── news/          #   News articles
├── admin/
│   ├── login/         #   Login page (no auth)
│   └── (protected)/   #   Route group — all require login
│       ├── layout.tsx #     Auth guard + sidebar
│       ├── dashboard/ #     Stats overview
│       ├── projects/  #     CRUD table
│       ├── news/      #     CRUD table
│       ├── culture/   #     Culture items management
│       └── settings/  #     Site config + media upload
└── api/               # REST API routes
    ├── auth/          #   login, logout, me (iron-session)
    ├── projects/      #   CRUD
    ├── news/          #   CRUD
    ├── culture/       #   CRUD
    ├── settings/      #   Key-value site settings
    └── upload/        #   File upload to public/uploads/
```

## Database (SQLite + Drizzle ORM)

- Schema: `src/lib/db/schema.ts` — tables: `users`, `projects`, `news`, `culture`, `media`, `site_settings`
- Connection: `src/lib/db/index.ts` — singleton, WAL mode, 10s busy timeout
- All DB access is server-side only (server components + API routes). No client-side DB calls.

## Auth

- Iron-session based (v8), session stored in an encrypted cookie
- `src/lib/auth.ts` exports `getSession()` (read) and `requireAuth()` (check or throw)
- Admin layout at `src/app/admin/(protected)/layout.tsx` calls `getSession()` and redirects to `/admin/login` if not logged in
- Login API at `/api/auth/login` validates bcrypt-hashed password against `users` table

## Patterns

- **Public pages** read directly from DB in server components (no `use client` needed)
- **Admin pages** are `"use client"` components that call API routes with `fetch`
- All API routes that modify data are protected via `requireAuth()`
- Site settings stored as key-value pairs in `site_settings` table, read via `getSiteSettings()` from `src/lib/utils.ts`
- File uploads go to `public/uploads/`, paths stored in `media` table
