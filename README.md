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

## Account di default
Imposta `NEXT_PUBLIC_ADMIN_EMAIL` e `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local` per abilitare l'accesso rapido come amministratore tramite il pulsante "Entra come Admin" nella pagina di login.

## Deploy (Vercel)
- Importa repo da GitHub e imposta le env `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
