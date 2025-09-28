# Iliad Ambassador - Project Overview

## Background
App web per gestione turni, conteggio ore e vendite dei Brand Ambassador di Iliad. L'applicazione permette la gestione completa della forza lavoro, dalla pianificazione dei turni al monitoraggio delle vendite.

## Visione Core
Creare una piattaforma integrata che semplifichi la gestione operativa dei punti vendita Iliad, migliorando l'efficienza del personale e la qualità del servizio clienti.

## Obiettivi Principali
1. **Gestione Turni**: Pianificazione e monitoraggio dei turni di lavoro
2. **Conteggio Ore**: Tracciamento preciso delle ore lavorate
3. **Gestione Vendite**: Registrazione e analisi delle vendite
4. **Amministrazione**: Gestione completa di negozi, utenti e permessi

## Problemi Risolti
- **Fragilità nella pianificazione**: Sistema centralizzato per la gestione dei turni
- **Tracciamento ore impreciso**: Automazione del conteggio delle ore lavorate
- **Gestione vendite dispersa**: Piattaforma unificata per le vendite
- **Controllo accessi complesso**: Sistema RBAC (Role-Based Access Control) integrato

## Tecnologie Utilizzate
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **UI Components**: Lucide React, React Big Calendar
- **State Management**: React Context, Local Storage
- **Deployment**: Vercel

## Architettura
L'applicazione segue un'architettura moderna con separazione tra:
- **Presentation Layer**: Componenti React per l'interfaccia utente
- **Business Logic**: Servizi e hook personalizzati
- **Data Layer**: Supabase per persistenza e autenticazione
- **Authentication**: Sistema RBAC con ruoli gerarchici
