# Iliad Ambassador — Web App (Next.js + Supabase + Tailwind)

App web per gestione turni, conteggio ore e vendite dei Brand Ambassador.

## Setup rapido
1. Crea un progetto Supabase e incolla `supabase_schema.sql` nel SQL Editor.
2. Crea `.env.local` partendo da `.env.local.example`.
3. Installa e avvia:
   ```bash
   npm install
   npm run dev
   ```

## Rotte
/login • /dashboard • /stores • /stores/[id]/planner • /stores/[id]/sales • /reports/hours • /admin/members

## Autenticazione
- Imposta credenziali admin server-side in `.env.local`:
  - `ADMIN_EMAIL="admin@example.com"`
  - `ADMIN_PASSWORD="super-strong-password"`
  - `AUTH_SECRET` chiave segreta usata per firmare i token (es. `openssl rand -base64 32`).
- La pagina di login accetta email/password; se coincidono con quelle admin sarai autenticato come `admin`.
- Viene creato un cookie di sessione HTTP-only firmato. Il middleware protegge tutte le rotte; le rotte sotto `/admin` richiedono ruolo `admin`.

## Deploy (Vercel)
- Importa repo da GitHub e imposta le env `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Aggiungi anche `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET` nelle variabili d'ambiente del progetto.
