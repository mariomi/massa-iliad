# Requirements & Features

## Requisiti di Sistema
- **Browser**: Chrome, Firefox, Safari, Edge (ultime 2 versioni)
- **Risoluzione**: Desktop (1024x768+), Tablet (768x1024+)
- **JavaScript**: Abilitato
- **Connessione**: Internet per sincronizzazione dati

## Funzionalità Principali

### 1. Autenticazione e Autorizzazione
- **Login/Logout**: Sistema di autenticazione sicuro
- **Ruoli Utente**: Admin, Manager, Staff, Viewer, Workforce
- **Controllo Accessi**: RBAC per proteggere le funzionalità sensibili

### 2. Gestione Turni (Workforce Calendar)
- **Visualizzazione Calendario**: Vista mensile, settimanale, giornaliera
- **Creazione Turni**: Solo per utenti autorizzati (Admin, Manager)
- **Modifica Turni**: Editing in tempo reale
- **Dettagli Turno**: 
  - **Funzionalità**: Cliccare su un turno mostra automaticamente:
    - Nome del negozio
    - Orario del turno (inizio e fine)
    - Giorno della settimana e data
    - Indirizzo del negozio
    - Durata del turno
    - Persona assegnata
    - Stato (Pubblicato/Bozza)
    - Note aggiuntive

### 3. Gestione Negozi
- **Lista Negozi**: Visualizzazione di tutti i punti vendita
- **Dettagli Negozio**: Informazioni complete (indirizzo, orari, servizi)
- **Creazione Negozi**: Solo per Admin
- **Modifica Negozi**: Solo per Admin

### 4. Gestione Vendite
- **Registrazione Vendite**: Form per inserimento vendite
- **Statistiche Vendite**: Grafici e report
- **Filtri Vendite**: Per negozio, periodo, prodotto

### 5. Report e Analytics
- **Report Ore**: Calendario avanzato con filtri
- **Statistiche Vendite**: Dashboard con KPI
- **Export Dati**: Possibilità di esportare report

## Regole di Business

### Ruoli e Permessi
- **Admin**: Accesso completo a tutte le funzionalità
- **Manager**: Gestione turni e vendite per negozi assegnati
- **Staff**: Registrazione vendite e visualizzazione turni
- **Viewer**: Solo lettura
- **Workforce**: Visualizzazione turni personali con dettagli

### Gestione Turni
- I turni possono essere creati solo da Admin e Manager
- I turni possono essere in stato "Bozza" o "Pubblicato"
- Solo i turni pubblicati sono visibili al personale
- I turni possono essere modificati solo da chi li ha creati

### Sicurezza
- Tutte le operazioni sensibili richiedono autenticazione
- I dati sono protetti da Row Level Security (RLS) in Supabase
- Le chiavi API non sono mai esposte al client

## Casi Edge
- **Turni Sovrapposti**: Il sistema previene la creazione di turni sovrapposti
- **Accesso Negato**: Messaggi di errore chiari per accessi non autorizzati
- **Dati Mancanti**: Gestione graceful di dati non disponibili
- **Connessione Persa**: Indicatori di stato per problemi di rete
