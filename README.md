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

---

## Ruoli e permessi (RBAC)
- Admin: accesso completo. Gestisce negozi e membership, modifica planner, registra vendite, vede tutto.
- Manager: per negozi assegnati. Modifica planner, registra vendite, vede report.
- Staff: per negozi assegnati. Registra vendite, vede planner.
- Viewer: sola lettura del negozio.

Mappatura attuale nell'app:
- Planner: modificabile da Admin e Manager; Staff/Viewer in sola lettura.
- Vendite: bottone “Nuova vendita” visibile per Admin, Manager, Staff.
- Admin: sezioni “Members” (lista) e “Admin Stores” (lista + crea) visibili solo ad Admin.

## Nuove rotte e API
- UI: `/admin/stores` per elenco e creazione punti vendita.
- API: `GET /api/auth/me` → ruolo corrente; `GET|POST /api/admin/stores` (solo admin).

## Variabili d'ambiente aggiuntive
- `SUPABASE_SERVICE_ROLE` (solo server): usata dalle API admin per operazioni privilegiate su Supabase.

## Setup rapido (aggiornato)
1. Configura Supabase (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
2. Imposta `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `SUPABASE_SERVICE_ROLE`.
3. Avvia l'app con `npm run dev`.

## Note su sicurezza
- La chiave `SUPABASE_SERVICE_ROLE` non deve mai essere esposta al client. È usata solo lato server in `src/lib/supabase/admin.ts`.
- Le policy RLS devono riflettere i ruoli di negozio su `store_memberships`.

## Prossimi step suggeriti
- Editor membership completo (CRUD) lato admin.
- Endpoint server per registrare vendite/turni in modalità admin se necessario.
