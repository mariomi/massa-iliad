# Technical Specifications

## Stack Tecnologico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Linguaggio**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Componenti personalizzati + Lucide React
- **State Management**: React Context + Local Storage
- **Calendar**: React Big Calendar
- **Date Handling**: date-fns

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **API**: Next.js API Routes
- **Storage**: Supabase Storage

### Deployment
- **Platform**: Vercel
- **Environment**: Production, Staging
- **CDN**: Vercel Edge Network

## Architettura del Codice

### Struttura Progetto
```
src/
├── app/                    # Next.js App Router
│   ├── (app)/             # Route group per app autenticata
│   │   ├── admin/         # Pagine admin
│   │   ├── dashboard/     # Dashboard principale
│   │   ├── reports/       # Report e analytics
│   │   ├── sales/         # Gestione vendite
│   │   ├── stores/        # Gestione negozi
│   │   └── settings/      # Impostazioni
│   ├── api/               # API Routes
│   └── globals.css        # Stili globali
├── components/            # Componenti React
│   ├── calendar/          # Componenti calendario
│   ├── shell/             # Layout e navigazione
│   ├── ui/                # Componenti UI base
│   └── ...
├── lib/                   # Utilities e servizi
│   ├── auth/              # Autenticazione e RBAC
│   ├── demo-data/         # Servizi dati demo
│   ├── supabase/          # Client Supabase
│   └── ...
└── middleware.ts          # Middleware Next.js
```

### Pattern di Design

#### Componenti
- **Composizione**: Uso di componenti composabili
- **Props Interface**: TypeScript interfaces per tutte le props
- **Lazy Loading**: Caricamento lazy per componenti pesanti
- **Error Boundaries**: Gestione errori a livello componente

#### State Management
- **Context API**: Per stato globale (autenticazione, tema)
- **Local State**: useState per stato locale componente
- **Custom Hooks**: Per logica riutilizzabile

#### Data Flow
- **Server Components**: Per rendering lato server
- **Client Components**: Per interattività
- **API Routes**: Per operazioni server-side

## Standard di Codifica

### TypeScript
- **Strict Mode**: Abilitato
- **Interfaces**: Per tutti i tipi di dati
- **Type Safety**: Controlli rigorosi sui tipi
- **No Any**: Evitare uso di `any`

### React
- **Functional Components**: Uso esclusivo di function components
- **Hooks**: Custom hooks per logica riutilizzabile
- **Props Destructuring**: Destructuring delle props
- **Conditional Rendering**: Uso di operatori ternari e &&

### CSS
- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: Supporto tema scuro
- **Responsive**: Design mobile-first
- **Custom Classes**: Per componenti complessi

## Database Design

### Schema Principale
```sql
-- Stores (Negozi)
stores (
  id, name, address, region, city, 
  postal_code, phone, email, manager,
  status, opening_hours, services,
  square_meters, employees_count, created_at
)

-- Shifts (Turni)
shifts (
  id, store_id, start_at, end_at,
  published, note, created_by, updated_by,
  created_at, updated_at
)

-- Shift Assignments (Assegnazioni Turni)
shift_assignments (
  shift_id, user_id
)

-- Time Entries (Registrazioni Orario)
time_entries (
  id, user_id, store_id, clock_in, clock_out,
  break_start, break_end, total_hours, created_at
)

-- Sales (Vendite)
sales (
  id, store_id, user_id, product_name, category,
  quantity, unit_price, total_amount, sale_date,
  payment_method, created_at
)
```

### Relazioni
- **Stores** → **Shifts** (1:N)
- **Shifts** → **Shift Assignments** (1:N)
- **Users** → **Shift Assignments** (1:N)
- **Stores** → **Sales** (1:N)
- **Users** → **Sales** (1:N)

## Sicurezza

### Autenticazione
- **JWT Tokens**: Gestiti da Supabase
- **Session Management**: Cookie HTTP-only
- **Password Hashing**: Bcrypt (gestito da Supabase)

### Autorizzazione
- **RBAC**: Role-Based Access Control
- **Row Level Security**: Policy Supabase
- **API Protection**: Middleware di autenticazione

### Validazione
- **Input Validation**: Validazione lato client e server
- **SQL Injection**: Prevenuta da Supabase
- **XSS Protection**: Sanitizzazione output

## Performance

### Ottimizzazioni
- **Code Splitting**: Lazy loading componenti
- **Image Optimization**: Next.js Image component
- **Caching**: Vercel Edge Caching
- **Bundle Size**: Tree shaking e minification

### Monitoring
- **Error Tracking**: Console logging
- **Performance**: Web Vitals
- **Analytics**: Vercel Analytics

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE=
ADMIN_EMAIL=
ADMIN_PASSWORD=
AUTH_SECRET=
```

### Build Process
1. **Install Dependencies**: `npm install`
2. **Type Check**: `npm run type-check`
3. **Build**: `npm run build`
4. **Deploy**: Automatico su Vercel

### CI/CD
- **GitHub Integration**: Deploy automatico su push
- **Preview Deployments**: Per ogni PR
- **Environment Management**: Staging e Production

## Componenti Principali

### Calendar Component
- **Library**: React Big Calendar
- **Features**: 
  - Vista mensile, settimanale, giornaliera
  - Filtri per negozio, team, persona, ruolo
  - Creazione e modifica turni
  - Visualizzazione dettagli turno con modal
  - Design minimal simile a Notion
  - Stessi dati mostrati in tutte le viste
- **Styling**: Custom CSS per aspetto pulito e minimal
- **Data**: Demo data service per sviluppo
- **Navigation**: Pulsanti minimal con frecce SVG
- **Event Loading**: Carica sempre 3 mesi di dati per garantire coerenza tra tutte le viste
- **Event Colors**: Tutti i turni sono blu (pubblicati: blu standard, bozze: blu scuro)
