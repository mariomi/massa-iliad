# User Flow & Project Structure

## User Journey

### 1. Autenticazione
```
Login Page → Credenziali → Dashboard
    ↓
Verifica Ruolo → Redirect a Sezione Appropriata
```

### 2. Workforce User Journey
```
Dashboard → Reports/Hours → Calendar View
    ↓
Click su Turno → Shift Details Modal
    ↓
Visualizza: Negozio, Orario, Data, Indirizzo
```

### 3. Admin/Manager Journey
```
Dashboard → Stores/Reports → Calendar Management
    ↓
Create/Edit Shifts → Publish → Monitor
```

## Data Flow

### Shift Details Flow
```
User Click → AdvancedCalendar.handleSelectEvent()
    ↓
Check User Role → onShiftDetails() callback
    ↓
HoursReport.handleShiftDetails() → Set Selected Shift
    ↓
ShiftDetailsModal → Fetch Store Data → Display Info
```

### Store Information Flow
```
ShiftDetailsModal → demoDataService.getStoreById()
    ↓
Store Object → Display Name, Address, etc.
```

## Project File Structure

### Componenti Calendario
```
src/components/calendar/
├── AdvancedCalendar.tsx      # Calendario principale
├── ShiftDetailsModal.tsx     # Modal dettagli turno (NUOVO)
├── ShiftModal.tsx           # Modal creazione/modifica turno
├── CalendarFilters.tsx      # Filtri calendario
└── AdminStoreCalendar.tsx   # Calendario admin
```

### Pagine Principali
```
src/app/(app)/
├── reports/hours/page.tsx   # Pagina report ore (MODIFICATA)
├── dashboard/page.tsx       # Dashboard principale
├── stores/                  # Gestione negozi
├── sales/                   # Gestione vendite
└── admin/                   # Sezione admin
```

### Servizi e Utilities
```
src/lib/
├── demo-data/
│   └── demo-service.ts      # Servizio dati demo
├── auth/
│   ├── rbac.ts             # Controllo accessi
│   └── useMe.ts            # Hook utente corrente
└── supabase/
    └── client.ts           # Client Supabase
```

## Interfacce TypeScript

### ShiftEvent Interface
```typescript
interface ShiftEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    storeId: string;
    storeName: string;
    userId?: string;
    userName?: string;
    role?: string;
    published: boolean;
    note?: string;
    hours: number;
    team?: string;
  };
}
```

### ShiftDetailsModal Props
```typescript
interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: ShiftEvent | null;
}
```

## Flusso di Dati

### 1. Caricamento Turni
```
AdvancedCalendar → demoDataService.filterShifts()
    ↓
Filter by User Role → Convert to Calendar Events
    ↓
Display in Calendar → Enable Click Handlers
```

### 2. Click su Turno
```
User Click → handleSelectEvent()
    ↓
Check canEdit → onShiftEdit() OR onShiftDetails()
    ↓
HoursReport → Set Modal State → Show Modal
```

### 3. Visualizzazione Dettagli
```
ShiftDetailsModal → Get Store Info
    ↓
Format Data → Display UI
    ↓
User Close → Reset State
```

## Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Componenti Responsive
- **ShiftDetailsModal**: Full width su mobile, max-width su desktop
- **Calendar**: Stack su mobile, grid su desktop
- **Navigation**: Collapsible su mobile

## Accessibilità

### ARIA Labels
- Tutti i bottoni hanno aria-label
- I modal hanno role="dialog"
- I form hanno label associate

### Keyboard Navigation
- Tab navigation per tutti i controlli
- Escape per chiudere modal
- Enter per attivare bottoni

### Screen Reader Support
- Testi alternativi per icone
- Descrizioni per elementi interattivi
- Annunci per cambi di stato

## Performance Considerations

### Lazy Loading
- Componenti pesanti caricati on-demand
- Modal caricati solo quando necessari
- Immagini ottimizzate

### State Management
- Stato locale per componenti
- Context per stato globale
- Memoization per calcoli pesanti

### Bundle Optimization
- Code splitting per route
- Tree shaking per librerie
- Minification per produzione
