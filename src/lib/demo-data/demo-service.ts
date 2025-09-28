// Sales interfaces
export interface DemoSale {
  id: string;
  store_id: string;
  user_id: string;
  product_name: string;
  category: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  sale_date: string;
  payment_method: 'cash' | 'card' | 'digital';
  created_at: string;
}

export interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  salesByCategory: { [category: string]: number };
  salesByStore: { [storeId: string]: { name: string; sales: number; revenue: number } };
  salesByPaymentMethod: { [method: string]: number };
  dailySales: { [date: string]: number };
  topProducts: { name: string; quantity: number; revenue: number }[];
}

// Import demo data directly as a constant
const demoDatabase = {
  "stores": [
    {
      "id": "store_1",
      "name": "Iliad Store Centro",
      "address": "Via Roma 123, Milano",
      "region": "Lombardia",
      "city": "Milano",
      "postal_code": "20100",
      "phone": "+39 02 1234567",
      "email": "centro@iliad.it",
      "manager": "user_2",
      "status": "active",
      "opening_hours": {
        "monday": "09:00-19:00",
        "tuesday": "09:00-19:00", 
        "wednesday": "09:00-19:00",
        "thursday": "09:00-19:00",
        "friday": "09:00-19:00",
        "saturday": "09:00-18:00",
        "sunday": "10:00-17:00"
      },
      "services": ["Vendita", "Assistenza", "Ricarica", "PortabilitÃ "],
      "square_meters": 120,
      "employees_count": 8,
      "created_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": "store_2", 
      "name": "Iliad Store Periferia",
      "address": "Corso Italia 456, Milano",
      "region": "Lombardia",
      "city": "Milano",
      "postal_code": "20122",
      "phone": "+39 02 2345678",
      "email": "periferia@iliad.it",
      "manager": "user_4",
      "status": "active",
      "opening_hours": {
        "monday": "09:00-19:00",
        "tuesday": "09:00-19:00",
        "wednesday": "09:00-19:00", 
        "thursday": "09:00-19:00",
        "friday": "09:00-19:00",
        "saturday": "09:00-18:00",
        "sunday": "10:00-17:00"
      },
      "services": ["Vendita", "Assistenza", "Ricarica"],
      "square_meters": 95,
      "employees_count": 6,
      "created_at": "2024-02-01T10:00:00Z"
    },
    {
      "id": "store_3",
      "name": "Iliad Store Mall",
      "address": "Galleria del Corso 789, Milano",
      "region": "Lombardia",
      "city": "Milano", 
      "postal_code": "20121",
      "phone": "+39 02 3456789",
      "email": "mall@iliad.it",
      "manager": "user_2",
      "status": "active",
      "opening_hours": {
        "monday": "10:00-21:00",
        "tuesday": "10:00-21:00",
        "wednesday": "10:00-21:00",
        "thursday": "10:00-21:00", 
        "friday": "10:00-21:00",
        "saturday": "10:00-21:00",
        "sunday": "10:00-20:00"
      },
      "services": ["Vendita", "Assistenza", "Ricarica", "PortabilitÃ ", "Demo"],
      "square_meters": 150,
      "employees_count": 10,
      "created_at": "2024-02-15T11:00:00Z"
    },
    {
      "id": "store_4",
      "name": "Iliad Store Navigli",
      "address": "Corso di Porta Ticinese 12, Milano",
      "region": "Lombardia",
      "city": "Milano",
      "postal_code": "20143",
      "phone": "+39 02 4567890",
      "email": "navigli@iliad.it",
      "manager": "user_6",
      "status": "active",
      "opening_hours": {
        "monday": "09:00-19:00",
        "tuesday": "09:00-19:00",
        "wednesday": "09:00-19:00",
        "thursday": "09:00-19:00",
        "friday": "09:00-19:00", 
        "saturday": "09:00-18:00",
        "sunday": "10:00-17:00"
      },
      "services": ["Vendita", "Assistenza", "Ricarica"],
      "square_meters": 80,
      "employees_count": 5,
      "created_at": "2024-03-01T09:00:00Z"
    },
    {
      "id": "store_5",
      "name": "Iliad Store Brera",
      "address": "Via Brera 8, Milano",
      "region": "Lombardia",
      "city": "Milano",
      "postal_code": "20121",
      "phone": "+39 02 5678901",
      "email": "brera@iliad.it",
      "manager": "user_7",
      "status": "active",
      "opening_hours": {
        "monday": "09:00-19:00",
        "tuesday": "09:00-19:00",
        "wednesday": "09:00-19:00",
        "thursday": "09:00-19:00",
        "friday": "09:00-19:00",
        "saturday": "09:00-18:00",
        "sunday": "10:00-17:00"
      },
      "services": ["Vendita", "Assistenza", "Ricarica", "PortabilitÃ "],
      "square_meters": 110,
      "employees_count": 7,
      "created_at": "2024-03-15T10:00:00Z"
    }
  ],
  "users": [
    {
      "id": "user_1",
      "name": "Mario Rossi",
      "email": "mario.rossi@demo.com",
      "role": "staff" as const,
      "store_id": "store_1",
      "team": "team_vendite",
      "created_at": "2024-01-10T08:00:00Z"
    },
    {
      "id": "user_2", 
      "name": "Anna Bianchi",
      "email": "anna.bianchi@demo.com",
      "role": "manager" as const,
      "store_id": "store_1",
      "team": "team_manager",
      "created_at": "2024-01-05T09:00:00Z"
    },
    {
      "id": "user_3",
      "name": "Luca Verdi", 
      "email": "luca.verdi@demo.com",
      "role": "staff" as const,
      "store_id": "store_2",
      "team": "team_vendite",
      "created_at": "2024-01-12T10:00:00Z"
    },
    {
      "id": "user_4",
      "name": "Giulia Neri",
      "email": "giulia.neri@demo.com", 
      "role": "manager" as const,
      "store_id": "store_2",
      "team": "team_manager",
      "created_at": "2024-01-08T11:00:00Z"
    },
    {
      "id": "user_5",
      "name": "Marco Blu",
      "email": "marco.blu@demo.com",
      "role": "staff" as const, 
      "store_id": "store_3",
      "team": "team_supporto",
      "created_at": "2024-01-20T12:00:00Z"
    },
    {
      "id": "user_6",
      "name": "Francesco Bianchi",
      "email": "francesco.bianchi@demo.com",
      "role": "manager" as const,
      "store_id": "store_4",
      "team": "team_manager",
      "created_at": "2024-02-20T09:00:00Z"
    },
    {
      "id": "user_7",
      "name": "Sofia Rossi",
      "email": "sofia.rossi@demo.com",
      "role": "manager" as const,
      "store_id": "store_5",
      "team": "team_manager",
      "created_at": "2024-03-01T10:00:00Z"
    },
    {
      "id": "user_8",
      "name": "Alessandro Verde",
      "email": "alessandro.verde@demo.com",
      "role": "staff" as const,
      "store_id": "store_4",
      "team": "team_vendite",
      "created_at": "2024-03-05T11:00:00Z"
    },
    {
      "id": "user_9",
      "name": "Chiara Gialli",
      "email": "chiara.gialli@demo.com",
      "role": "staff" as const,
      "store_id": "store_5",
      "team": "team_vendite",
      "created_at": "2024-03-10T12:00:00Z"
    },
    {
      "id": "user_10",
      "name": "Roberto Marrone",
      "email": "roberto.marrone@demo.com",
      "role": "staff" as const,
      "store_id": "store_1",
      "team": "team_supporto",
      "created_at": "2024-03-15T13:00:00Z"
    },
    {
      "id": "workforce_user",
      "name": "Forza Lavoro Demo",
      "email": "workforce@demo.com",
      "role": "workforce" as const,
      "store_id": "store_1",
      "team": "team_workforce",
      "created_at": "2024-01-25T08:00:00Z"
    }
  ],
  "teams": [
    {
      "id": "team_vendite",
      "name": "Team Vendite",
      "description": "Team dedicato alle vendite e assistenza clienti"
    },
    {
      "id": "team_manager", 
      "name": "Team Manager",
      "description": "Team di gestione e coordinamento"
    },
    {
      "id": "team_supporto",
      "name": "Team Supporto", 
      "description": "Team di supporto tecnico e logistica"
    },
    {
      "id": "team_workforce",
      "name": "Team Forza Lavoro",
      "description": "Team dedicato alla forza lavoro e gestione turni"
    }
  ],
  "leave_balances": [
    {
      "user_id": "workforce_user",
      "annual_leave_days": 26,
      "used_leave_days": 5,
      "sick_leave_days": 5,
      "used_sick_days": 2,
      "remaining_leave_days": 21,
      "carry_over_days": 2
    },
    {
      "user_id": "user_1",
      "annual_leave_days": 26,
      "used_leave_days": 8,
      "sick_leave_days": 5,
      "used_sick_days": 1,
      "remaining_leave_days": 18,
      "carry_over_days": 1
    },
    {
      "user_id": "user_2",
      "annual_leave_days": 26,
      "used_leave_days": 12,
      "sick_leave_days": 5,
      "used_sick_days": 0,
      "remaining_leave_days": 14,
      "carry_over_days": 3
    },
    {
      "user_id": "user_3",
      "annual_leave_days": 26,
      "used_leave_days": 6,
      "sick_leave_days": 5,
      "used_sick_days": 3,
      "remaining_leave_days": 20,
      "carry_over_days": 0
    },
    {
      "user_id": "user_4",
      "annual_leave_days": 26,
      "used_leave_days": 9,
      "sick_leave_days": 5,
      "used_sick_days": 0,
      "remaining_leave_days": 17,
      "carry_over_days": 1
    },
    {
      "user_id": "user_5",
      "annual_leave_days": 26,
      "used_leave_days": 4,
      "sick_leave_days": 5,
      "used_sick_days": 2,
      "remaining_leave_days": 22,
      "carry_over_days": 0
    }
  ],
  "shifts": [
    {
      "id": "shift_1",
      "store_id": "store_1",
      "user_id": "user_1",
      "title": "Turno Mattina - Mario Rossi",
      "start_at": "2025-09-23T09:00:00Z",
      "end_at": "2025-09-23T13:00:00Z",
      "published": true,
      "note": "Turno mattutino - Vendite",
      "created_at": "2024-12-10T14:00:00Z",
      "updated_at": "2024-12-10T14:00:00Z"
    },
    {
      "id": "shift_2",
      "store_id": "store_1", 
      "user_id": "user_2",
      "title": "Turno Pomeriggio - Anna Bianchi",
      "start_at": "2025-09-23T14:00:00Z",
      "end_at": "2025-09-23T18:00:00Z",
      "published": true,
      "note": "Turno pomeridiano - Gestione",
      "created_at": "2024-12-10T14:30:00Z",
      "updated_at": "2024-12-10T14:30:00Z"
    },
    {
      "id": "shift_3",
      "store_id": "store_2",
      "user_id": "user_3", 
      "title": "Turno Sera - Luca Verdi",
      "start_at": "2025-09-23T18:00:00Z",
      "end_at": "2025-09-23T22:00:00Z",
      "published": true,
      "note": "Turno serale - Vendite",
      "created_at": "2024-12-11T09:00:00Z",
      "updated_at": "2024-12-11T09:00:00Z"
    },
    {
      "id": "shift_4",
      "store_id": "store_1",
      "user_id": "user_1",
      "title": "Turno Mattina - Mario Rossi", 
      "start_at": "2025-09-24T09:00:00Z",
      "end_at": "2025-09-24T13:00:00Z",
      "published": false,
      "note": "Bozza turno",
      "created_at": "2024-12-12T10:00:00Z",
      "updated_at": "2024-12-12T10:00:00Z"
    },
    {
      "id": "shift_5",
      "store_id": "store_3",
      "user_id": "user_5",
      "title": "Turno Supporto - Marco Blu",
      "start_at": "2025-09-24T10:00:00Z", 
      "end_at": "2025-09-24T14:00:00Z",
      "published": true,
      "note": "Supporto tecnico",
      "created_at": "2024-12-12T11:00:00Z",
      "updated_at": "2024-12-12T11:00:00Z"
    },
    {
      "id": "shift_6",
      "store_id": "store_2",
      "user_id": "user_4",
      "title": "Turno Gestione - Giulia Neri",
      "start_at": "2025-09-25T08:00:00Z",
      "end_at": "2025-09-25T12:00:00Z", 
      "published": true,
      "note": "Gestione negozio",
      "created_at": "2024-12-13T08:00:00Z",
      "updated_at": "2024-12-13T08:00:00Z"
    },
    {
      "id": "shift_7",
      "store_id": "store_1",
      "user_id": "user_2",
      "title": "Turno Weekend - Anna Bianchi",
      "start_at": "2025-09-28T09:00:00Z",
      "end_at": "2025-09-28T17:00:00Z",
      "published": true,
      "note": "Turno weekend completo",
      "created_at": "2024-12-14T09:00:00Z",
      "updated_at": "2024-12-14T09:00:00Z"
    },
    {
      "id": "shift_8",
      "store_id": "store_3",
      "user_id": "user_5",
      "title": "Turno Supporto - Marco Blu",
      "start_at": "2025-09-26T15:00:00Z",
      "end_at": "2025-09-26T19:00:00Z",
      "published": false,
      "note": "Bozza supporto pomeridiano",
      "created_at": "2024-12-15T10:00:00Z",
      "updated_at": "2024-12-15T10:00:00Z"
    },
    {
      "id": "shift_9",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Forza Lavoro - Forza Lavoro Demo",
      "start_at": "2025-09-23T10:00:00Z",
      "end_at": "2025-09-23T14:00:00Z",
      "published": true,
      "note": "Turno assegnato alla forza lavoro",
      "created_at": "2024-12-14T15:00:00Z",
      "updated_at": "2024-12-14T15:00:00Z"
    },
    {
      "id": "shift_10",
      "store_id": "store_2",
      "user_id": "workforce_user",
      "title": "Turno Forza Lavoro - Forza Lavoro Demo",
      "start_at": "2025-09-24T16:00:00Z",
      "end_at": "2025-09-24T20:00:00Z",
      "published": true,
      "note": "Turno serale forza lavoro",
      "created_at": "2024-12-14T16:00:00Z",
      "updated_at": "2024-12-14T16:00:00Z"
    },
    {
      "id": "shift_11",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Forza Lavoro - Forza Lavoro Demo",
      "start_at": "2025-09-25T08:00:00Z",
      "end_at": "2025-09-25T12:00:00Z",
      "published": true,
      "note": "Turno mattutino forza lavoro",
      "created_at": "2024-12-14T17:00:00Z",
      "updated_at": "2024-12-14T17:00:00Z"
    },
    {
      "id": "shift_12",
      "store_id": "store_3",
      "user_id": "workforce_user",
      "title": "Turno Forza Lavoro - Forza Lavoro Demo",
      "start_at": "2025-09-27T13:00:00Z",
      "end_at": "2025-09-27T17:00:00Z",
      "published": false,
      "note": "Bozza turno forza lavoro",
      "created_at": "2024-12-14T18:00:00Z",
      "updated_at": "2024-12-14T18:00:00Z"
    },
    {
      "id": "shift_13",
      "store_id": "store_2",
      "user_id": "workforce_user",
      "title": "Turno Forza Lavoro - Forza Lavoro Demo",
      "start_at": "2025-09-29T09:00:00Z",
      "end_at": "2025-09-29T13:00:00Z",
      "published": true,
      "note": "Turno weekend forza lavoro",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_14",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Mattina - Forza Lavoro Demo",
      "start_at": "2024-12-26T09:00:00Z",
      "end_at": "2024-12-26T13:00:00Z",
      "published": true,
      "note": "Turno mattutino supporto vendite",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_15",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Pomeriggio - Forza Lavoro Demo",
      "start_at": "2024-12-27T14:00:00Z",
      "end_at": "2024-12-27T18:00:00Z",
      "published": true,
      "note": "Turno pomeridiano assistenza clienti",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_16",
      "store_id": "store_2",
      "user_id": "workforce_user",
      "title": "Turno Completo - Forza Lavoro Demo",
      "start_at": "2024-12-28T09:00:00Z",
      "end_at": "2024-12-28T17:00:00Z",
      "published": true,
      "note": "Turno completo weekend",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_17",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Mattina - Forza Lavoro Demo",
      "start_at": "2024-12-29T08:00:00Z",
      "end_at": "2024-12-29T12:00:00Z",
      "published": true,
      "note": "Turno mattutino pre-festività",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_18",
      "store_id": "store_2",
      "user_id": "workforce_user",
      "title": "Turno Pomeriggio - Forza Lavoro Demo",
      "start_at": "2024-12-30T15:00:00Z",
      "end_at": "2024-12-30T19:00:00Z",
      "published": true,
      "note": "Turno pomeridiano fine anno",
      "created_at": "2024-12-14T19:00:00Z",
      "updated_at": "2024-12-14T19:00:00Z"
    },
    {
      "id": "shift_20",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Mattina - Forza Lavoro Demo",
      "start_at": "2025-09-28T09:00:00Z",
      "end_at": "2025-09-28T13:00:00Z",
      "published": true,
      "note": "Turno mattutino domani",
      "created_at": "2025-09-27T19:00:00Z",
      "updated_at": "2025-09-27T19:00:00Z"
    },
    {
      "id": "shift_21",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Pomeriggio - Forza Lavoro Demo",
      "start_at": "2025-09-29T14:00:00Z",
      "end_at": "2025-09-29T18:00:00Z",
      "published": true,
      "note": "Turno pomeridiano dopodomani",
      "created_at": "2025-09-27T19:00:00Z",
      "updated_at": "2025-09-27T19:00:00Z"
    },
    {
      "id": "shift_22",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Completo - Forza Lavoro Demo",
      "start_at": "2025-09-30T09:00:00Z",
      "end_at": "2025-09-30T17:00:00Z",
      "published": true,
      "note": "Turno completo fine settembre",
      "created_at": "2025-09-27T19:00:00Z",
      "updated_at": "2025-09-27T19:00:00Z"
    },
    {
      "id": "shift_23",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Mattina - Forza Lavoro Demo",
      "start_at": "2025-10-01T08:00:00Z",
      "end_at": "2025-10-01T12:00:00Z",
      "published": true,
      "note": "Turno mattutino inizio ottobre",
      "created_at": "2025-09-27T19:00:00Z",
      "updated_at": "2025-09-27T19:00:00Z"
    },
    {
      "id": "shift_24",
      "store_id": "store_1",
      "user_id": "workforce_user",
      "title": "Turno Pomeriggio - Forza Lavoro Demo",
      "start_at": "2025-10-02T15:00:00Z",
      "end_at": "2025-10-02T19:00:00Z",
      "published": true,
      "note": "Turno pomeridiano ottobre",
      "created_at": "2025-09-27T19:00:00Z",
      "updated_at": "2025-09-27T19:00:00Z"
    },
    {
      "id": "shift_19",
      "store_id": "store_1",
      "user_id": "user_1",
      "title": "Turno Mattina - Mario Rossi",
      "start_at": "2024-12-26T09:00:00Z",
      "end_at": "2024-12-26T13:00:00Z",
      "published": true,
      "note": "Turno mattina",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_15",
      "store_id": "store_1",
      "user_id": "user_2",
      "title": "Turno Pomeriggio - Anna Bianchi",
      "start_at": "2024-12-26T14:00:00Z",
      "end_at": "2024-12-26T18:00:00Z",
      "published": true,
      "note": "Turno pomeriggio",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_16",
      "store_id": "store_2",
      "user_id": "user_3",
      "title": "Turno Sera - Luca Verdi",
      "start_at": "2024-12-26T18:00:00Z",
      "end_at": "2024-12-26T22:00:00Z",
      "published": true,
      "note": "Turno sera",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_17",
      "store_id": "store_3",
      "user_id": "user_5",
      "title": "Turno Supporto - Marco Blu",
      "start_at": "2024-12-26T10:00:00Z",
      "end_at": "2024-12-26T14:00:00Z",
      "published": true,
      "note": "Turno supporto",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_18",
      "store_id": "store_1",
      "user_id": "user_1",
      "title": "Turno Mattina - Mario Rossi",
      "start_at": "2024-12-27T09:00:00Z",
      "end_at": "2024-12-27T13:00:00Z",
      "published": true,
      "note": "Turno mattina",
      "created_at": "2024-12-27T08:00:00Z",
      "updated_at": "2024-12-27T08:00:00Z"
    },
    {
      "id": "shift_19",
      "store_id": "store_2",
      "user_id": "user_4",
      "title": "Turno Gestione - Giulia Neri",
      "start_at": "2024-12-27T10:00:00Z",
      "end_at": "2024-12-27T18:00:00Z",
      "published": true,
      "note": "Turno gestione",
      "created_at": "2024-12-27T08:00:00Z",
      "updated_at": "2024-12-27T08:00:00Z"
    },
    {
      "id": "shift_20",
      "store_id": "store_3",
      "user_id": "user_5",
      "title": "Turno Supporto - Marco Blu",
      "start_at": "2024-12-28T09:00:00Z",
      "end_at": "2024-12-28T17:00:00Z",
      "published": true,
      "note": "Turno supporto weekend",
      "created_at": "2024-12-28T08:00:00Z",
      "updated_at": "2024-12-28T08:00:00Z"
    },
    {
      "id": "shift_21",
      "store_id": "store_1",
      "user_id": "user_1",
      "title": "Turno Mattina - Mario Rossi",
      "start_at": "2024-12-29T09:00:00Z",
      "end_at": "2024-12-29T13:00:00Z",
      "published": true,
      "note": "Turno mattina",
      "created_at": "2024-12-29T08:00:00Z",
      "updated_at": "2024-12-29T08:00:00Z"
    },
    {
      "id": "shift_22",
      "store_id": "store_2",
      "user_id": "user_4",
      "title": "Turno Gestione - Giulia Neri",
      "start_at": "2024-12-29T10:00:00Z",
      "end_at": "2024-12-29T18:00:00Z",
      "published": true,
      "note": "Turno gestione",
      "created_at": "2024-12-29T08:00:00Z",
      "updated_at": "2024-12-29T08:00:00Z"
    },
    {
      "id": "shift_23",
      "store_id": "store_4",
      "user_id": "user_6",
      "title": "Turno Manager - Francesco Bianchi",
      "start_at": "2024-12-26T08:00:00Z",
      "end_at": "2024-12-26T16:00:00Z",
      "published": true,
      "note": "Turno manager",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_24",
      "store_id": "store_4",
      "user_id": "user_7",
      "title": "Turno Staff - Alessandro Verde",
      "start_at": "2024-12-26T16:00:00Z",
      "end_at": "2024-12-26T20:00:00Z",
      "published": true,
      "note": "Turno staff",
      "created_at": "2024-12-26T08:00:00Z",
      "updated_at": "2024-12-26T08:00:00Z"
    },
    {
      "id": "shift_25",
      "store_id": "store_5",
      "user_id": "user_8",
      "title": "Turno Manager - Sofia Rossi",
      "start_at": "2024-12-27T09:00:00Z",
      "end_at": "2024-12-27T17:00:00Z",
      "published": true,
      "note": "Turno manager",
      "created_at": "2024-12-27T08:00:00Z",
      "updated_at": "2024-12-27T08:00:00Z"
    },
    {
      "id": "shift_26",
      "store_id": "store_5",
      "user_id": "user_9",
      "title": "Turno Staff - Chiara Gialli",
      "start_at": "2024-12-27T17:00:00Z",
      "end_at": "2024-12-27T21:00:00Z",
      "published": true,
      "note": "Turno staff",
      "created_at": "2024-12-27T08:00:00Z",
      "updated_at": "2024-12-27T08:00:00Z"
    },
    {
      "id": "shift_27",
      "store_id": "store_1",
      "user_id": "user_2",
      "title": "Turno Manager - Anna Bianchi",
      "start_at": "2024-12-30T10:00:00Z",
      "end_at": "2024-12-30T18:00:00Z",
      "published": true,
      "note": "Turno manager",
      "created_at": "2024-12-30T08:00:00Z",
      "updated_at": "2024-12-30T08:00:00Z"
    },
    {
      "id": "shift_28",
      "store_id": "store_2",
      "user_id": "user_3",
      "title": "Turno Staff - Luca Verdi",
      "start_at": "2024-12-30T14:00:00Z",
      "end_at": "2024-12-30T22:00:00Z",
      "published": true,
      "note": "Turno staff",
      "created_at": "2024-12-30T08:00:00Z",
      "updated_at": "2024-12-30T08:00:00Z"
    },
    {
      "id": "shift_29",
      "store_id": "store_3",
      "user_id": "user_5",
      "title": "Turno Supporto - Marco Blu",
      "start_at": "2024-12-31T09:00:00Z",
      "end_at": "2024-12-31T17:00:00Z",
      "published": true,
      "note": "Turno supporto",
      "created_at": "2024-12-31T08:00:00Z",
      "updated_at": "2024-12-31T08:00:00Z"
    }
  ],
  "sales": [
    {
      "id": "sale_1",
      "store_id": "store_1",
      "user_id": "user_1",
      "product_name": "iPhone 15 Pro",
      "category": "Smartphone",
      "quantity": 1,
      "unit_price": 1199.00,
      "total_amount": 1199.00,
      "sale_date": "2024-12-20T10:30:00Z",
      "payment_method": "card" as const,
      "created_at": "2024-12-20T10:30:00Z"
    },
    {
      "id": "sale_2",
      "store_id": "store_1",
      "user_id": "user_2",
      "product_name": "Samsung Galaxy S24",
      "category": "Smartphone",
      "quantity": 1,
      "unit_price": 1099.00,
      "total_amount": 1099.00,
      "sale_date": "2024-12-20T09:15:00Z",
      "payment_method": "digital" as const,
      "created_at": "2024-12-20T09:15:00Z"
    },
    {
      "id": "sale_3",
      "store_id": "store_2",
      "user_id": "user_3",
      "product_name": "MacBook Pro 14\"",
      "category": "Laptop",
      "quantity": 1,
      "unit_price": 2199.00,
      "total_amount": 2199.00,
      "sale_date": "2024-12-19T14:20:00Z",
      "payment_method": "card" as const,
      "created_at": "2024-12-19T14:20:00Z"
    },
    {
      "id": "sale_4",
      "store_id": "store_3",
      "user_id": "user_5",
      "product_name": "iPad Air",
      "category": "Tablet",
      "quantity": 2,
      "unit_price": 599.00,
      "total_amount": 1198.00,
      "sale_date": "2024-12-19T11:45:00Z",
      "payment_method": "cash" as const,
      "created_at": "2024-12-19T11:45:00Z"
    },
    {
      "id": "sale_5",
      "store_id": "store_1",
      "user_id": "user_1",
      "product_name": "AirPods Pro",
      "category": "Accessori",
      "quantity": 3,
      "unit_price": 249.00,
      "total_amount": 747.00,
      "sale_date": "2024-12-18T16:30:00Z",
      "payment_method": "card" as const,
      "created_at": "2024-12-18T16:30:00Z"
    }
  ]
};

// Define the database type
type DemoDatabase = {
  stores: DemoStore[];
  users: DemoUser[];
  teams: DemoTeam[];
  leave_balances: DemoLeaveBalance[];
  shifts: DemoShift[];
  sales: DemoSale[];
};

export interface DemoStore {
  id: string;
  name: string;
  address: string;
  region: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  manager: string;
  status: string;
  opening_hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  services: string[];
  square_meters: number;
  employees_count: number;
  created_at: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'staff' | 'viewer' | 'workforce' | 'dipendente' | 'agente' | 'admin';
  store_id: string | null;
  team: string;
  created_at: string;
}

export interface DemoTeam {
  id: string;
  name: string;
  description: string;
}

export interface DemoShift {
  id: string;
  store_id: string;
  user_id: string;
  title: string;
  start_at: string;
  end_at: string;
  published: boolean;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface DemoShiftWithDetails extends DemoShift {
  store: DemoStore;
  user: DemoUser;
  team: DemoTeam;
  hours: number;
}

export interface DemoLeaveBalance {
  user_id: string;
  annual_leave_days: number;
  used_leave_days: number;
  sick_leave_days: number;
  used_sick_days: number;
  remaining_leave_days: number;
  carry_over_days: number;
}

export interface PersonalTimesheetStats {
  user: DemoUser;
  totalHours: number;
  regularHours: number;
  overtimeHours: number;
  weeklyHours: number;
  weeklyHoursRemaining: number;
  shiftsCount: number;
  publishedShiftsCount: number;
  draftShiftsCount: number;
  leaveBalance: DemoLeaveBalance | null;
  recentShifts: DemoShiftWithDetails[];
}

class DemoDataService {
  private data: DemoDatabase = { ...demoDatabase };
  private readonly initial: DemoDatabase = { ...demoDatabase };
  private storageKey = 'iliad_demo_database';

  constructor() {
    this.data = this.loadFromStorage() || { ...demoDatabase };
    
    // Ensure sales field exists
    if (!this.data.sales) {
      this.data.sales = [];
    }
  }

  private loadFromStorage(): DemoDatabase | null {
    if (typeof window === 'undefined') {
      return null;
    }
    
    try {
      const stored = localStorage.getItem(this.storageKey);
      
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Ensure all required fields exist
        if (!parsed.sales) {
          parsed.sales = [];
        }
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return null;
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Method to reset data to initial state (useful for debugging)
  resetToInitialData(): void {
    this.data = { ...demoDatabase };
    this.saveToStorage();
    console.log('🔄 Demo data reset to initial state');
  }

  // Public method to force save data to localStorage
  forceSaveToStorage(): void {
    this.saveToStorage();
  }

  // Reset to initial demo dataset (useful after edits during dev)
  resetData() {
    this.data = JSON.parse(JSON.stringify(this.initial));
    this.saveToStorage();
  }

  // Stores
  getStores(): DemoStore[] {
    return this.data.stores;
  }

  getAllStores(): DemoStore[] {
    return this.data.stores;
  }

  getStoreById(id: string): DemoStore | undefined {
    return this.data.stores.find(store => store.id === id);
  }

  addStore(store: Omit<DemoStore, 'id' | 'created_at'>): DemoStore {
    const newStore: DemoStore = {
      ...store,
      id: `store_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    this.data.stores.push(newStore);
    this.saveToStorage();
    return newStore;
  }

  updateStore(id: string, updates: Partial<DemoStore>): DemoStore | null {
    const storeIndex = this.data.stores.findIndex(store => store.id === id);
    if (storeIndex === -1) return null;
    
    this.data.stores[storeIndex] = { ...this.data.stores[storeIndex], ...updates };
    this.saveToStorage();
    return this.data.stores[storeIndex];
  }

  deleteStore(id: string): boolean {
    const storeIndex = this.data.stores.findIndex(store => store.id === id);
    if (storeIndex === -1) return false;
    
    this.data.stores.splice(storeIndex, 1);
    this.saveToStorage();
    return true;
  }

  // Users
  getUsers(): DemoUser[] {
    return this.data.users;
  }

  getAllUsers(): DemoUser[] {
    return this.data.users;
  }

  getUserById(id: string): DemoUser | undefined {
    return this.data.users.find(user => user.id === id);
  }

  getUsersByStore(storeId: string): DemoUser[] {
    return this.data.users.filter(user => user.store_id === storeId);
  }

  getUsersByRole(role: string): DemoUser[] {
    return this.data.users.filter(user => user.role === role);
  }

  getUsersByTeam(teamId: string): DemoUser[] {
    return this.data.users.filter(user => user.team === teamId);
  }

  addUser(user: Omit<DemoUser, 'id' | 'created_at'>): DemoUser {
    const newUser: DemoUser = {
      ...user,
      id: `user_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    this.data.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }

  updateUser(id: string, updates: Partial<DemoUser>): DemoUser | null {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
    this.saveToStorage();
    return this.data.users[userIndex];
  }

  deleteUser(id: string): boolean {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    this.data.users.splice(userIndex, 1);
    this.saveToStorage();
    return true;
  }

  // CSV Import functionality
  parseCSVUsers(csvContent: string): { users: Omit<DemoUser, 'id'>[], errors: string[] } {
    const lines = csvContent.split('\n').filter(line => line.trim());
    const errors: string[] = [];
    const users: Omit<DemoUser, 'id'>[] = [];

    // Skip header row
    const dataLines = lines.slice(1);

    dataLines.forEach((line, index) => {
      const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
      const columns = this.parseCSVLine(line);
      
      if (columns.length < 4) {
        errors.push(`Riga ${rowNumber}: Numero insufficiente di colonne (minimo 4 richieste)`);
        return;
      }

      const [name, email, role, password] = columns;
      
      // Validate required fields
      if (!name?.trim()) {
        errors.push(`Riga ${rowNumber}: Nome Ã¨ obbligatorio`);
        return;
      }
      
      if (!email?.trim()) {
        errors.push(`Riga ${rowNumber}: Email Ã¨ obbligatoria`);
        return;
      }
      
      if (!this.isValidEmail(email.trim())) {
        errors.push(`Riga ${rowNumber}: Email non valida: ${email}`);
        return;
      }
      
      if (!role?.trim()) {
        errors.push(`Riga ${rowNumber}: Ruolo Ã¨ obbligatorio`);
        return;
      }
      
      const validRoles = ['admin', 'manager', 'staff', 'workforce', 'dipendente', 'agente'];
      if (!validRoles.includes(role.trim().toLowerCase())) {
        errors.push(`Riga ${rowNumber}: Ruolo non valido: ${role}. Ruoli validi: ${validRoles.join(', ')}`);
        return;
      }
      
      if (!password?.trim()) {
        errors.push(`Riga ${rowNumber}: Password Ã¨ obbligatoria`);
        return;
      }

      // Check for duplicate email
      if (this.data.users.some(user => user.email.toLowerCase() === email.trim().toLowerCase())) {
        errors.push(`Riga ${rowNumber}: Email giÃ  esistente: ${email}`);
        return;
      }

      // Check for duplicate in current batch
      if (users.some(user => user.email.toLowerCase() === email.trim().toLowerCase())) {
        errors.push(`Riga ${rowNumber}: Email duplicata nel file: ${email}`);
        return;
      }

      users.push({
        name: name.trim(),
        email: email.trim(),
        role: role.trim().toLowerCase() as 'admin' | 'manager' | 'staff' | 'workforce' | 'dipendente' | 'agente',
        store_id: null,
        team: "team_general",
        created_at: new Date().toISOString()
      });
    });

    return { users, errors };
  }

  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  bulkCreateUsers(users: Omit<DemoUser, 'id'>[]): DemoUser[] {
    const createdUsers: DemoUser[] = [];
    
    users.forEach(user => {
      const newUser = this.addUser(user);
      createdUsers.push(newUser);
    });
    
    return createdUsers;
  }

  generateCSVTemplate(): string {
    const header = 'Nome,Email,Ruolo,Password';
    const examples = [
      'Mario Rossi,mario.rossi@example.com,staff,password123',
      'Giulia Bianchi,giulia.bianchi@example.com,manager,password123',
      'Luca Verdi,luca.verdi@example.com,dipendente,password123',
      'Anna Neri,anna.neri@example.com,agente,password123'
    ];
    
    return [header, ...examples].join('\n');
  }

  // Region Manager functionality
  getManagers(): DemoUser[] {
    return this.data.users.filter(user => user.role === 'manager');
  }

  searchManagers(query: string): DemoUser[] {
    if (!query.trim()) return this.getManagers();
    
    const lowercaseQuery = query.toLowerCase();
    return this.getManagers().filter(manager => 
      manager.name.toLowerCase().includes(lowercaseQuery) ||
      manager.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  getRegionManager(regionName: string): DemoUser | null {
    // For demo purposes, we'll store region-manager mappings in localStorage
    const regionManagers = this.getRegionManagers();
    const managerId = regionManagers[regionName];
    if (!managerId) return null;
    
    return this.getUserById(managerId) || null;
  }

  assignManagerToRegion(regionName: string, managerId: string): boolean {
    try {
      const regionManagers = this.getRegionManagers();
      regionManagers[regionName] = managerId;
      localStorage.setItem('demo_region_managers', JSON.stringify(regionManagers));
      return true;
    } catch (error) {
      console.error('Error assigning manager to region:', error);
      return false;
    }
  }

  removeManagerFromRegion(regionName: string): boolean {
    try {
      const regionManagers = this.getRegionManagers();
      delete regionManagers[regionName];
      localStorage.setItem('demo_region_managers', JSON.stringify(regionManagers));
      return true;
    } catch (error) {
      console.error('Error removing manager from region:', error);
      return false;
    }
  }

  private getRegionManagers(): Record<string, string> {
    try {
      const stored = localStorage.getItem('demo_region_managers');
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Error loading region managers:', error);
      return {};
    }
  }

  getRegionsWithManagers(): Array<{ region: string; manager: DemoUser | null }> {
    const regions = this.getRegions();
    return regions.map(region => ({
      region,
      manager: this.getRegionManager(region)
    }));
  }

  // Regions (simple list based on unique regions from stores)
  getRegions(): string[] {
    const regions = new Set(this.data.stores.map(store => store.region));
    return Array.from(regions).sort();
  }

  addRegion(name: string): boolean {
    const regions = this.getRegions();
    if (regions.includes(name)) {
      return false; // Region already exists
    }
    
    // Create a default store for the new region
    const newStore = this.addStore({
      name: `Store ${name}`,
      address: `Via Roma 1, ${name}`,
      region: name,
      city: name,
      postal_code: "00000",
      phone: "+39 000 0000000",
      email: `store@${name.toLowerCase()}.it`,
      manager: this.data.users.find(u => u.role === "manager")?.id || "",
      status: "active",
      opening_hours: {
        monday: "09:00-19:00",
        tuesday: "09:00-19:00",
        wednesday: "09:00-19:00",
        thursday: "09:00-19:00",
        friday: "09:00-19:00",
        saturday: "09:00-18:00",
        sunday: "10:00-17:00"
      },
      services: ["Vendita", "Assistenza", "Ricarica"],
      square_meters: 100,
      employees_count: 5
    });
    
    return true;
  }

  // Teams
  getTeams(): DemoTeam[] {
    return this.data.teams;
  }

  getTeamById(id: string): DemoTeam | undefined {
    return this.data.teams.find(team => team.id === id);
  }

  getTeamsByStore(storeId: string): DemoTeam[] {
    // Get unique teams from users assigned to this store
    const storeUsers = this.data.users.filter(user => user.store_id === storeId);
    const teamIds = [...new Set(storeUsers.map(user => user.team).filter(Boolean))];
    
    return this.data.teams.filter(team => teamIds.includes(team.id));
  }

  getRolesByStore(storeId: string): string[] {
    // Get unique roles from users assigned to this store
    const storeUsers = this.data.users.filter(user => user.store_id === storeId);
    return [...new Set(storeUsers.map(user => user.role))];
  }

  getRolesByTeam(teamId: string): string[] {
    // Get unique roles from users assigned to this team
    const teamUsers = this.data.users.filter(user => user.team === teamId);
    return [...new Set(teamUsers.map(user => user.role))];
  }

  // Shifts
  getShifts(): DemoShift[] {
    return this.data.shifts;
  }

  getShiftsByStore(storeId: string): DemoShift[] {
    return this.data.shifts.filter(shift => shift.store_id === storeId);
  }

  getShiftsByUser(userId: string): DemoShift[] {
    return this.data.shifts.filter(shift => shift.user_id === userId);
  }

  getShiftsByDateRange(startDate: Date, endDate: Date): DemoShift[] {
    return this.data.shifts.filter(shift => {
      const shiftStart = new Date(shift.start_at);
      const shiftEnd = new Date(shift.end_at);
      return shiftStart >= startDate && shiftEnd <= endDate;
    });
  }

  getShiftsWithDetails(): DemoShiftWithDetails[] {
    return this.data.shifts.map(shift => {
      const store = this.getStoreById(shift.store_id);
      const user = this.getUserById(shift.user_id);
      const team = this.getTeamById(user?.team || '') || { id: "unknown", name: "Senza team", description: "" };
      const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);

      // Skip shifts with missing store or user data
      if (!store || !user) {
        console.warn(`Skipping shift ${shift.id}: missing store (${shift.store_id}) or user (${shift.user_id})`);
        return null;
      }

      return {
        ...shift,
        store,
        user,
        team,
        hours
      };
    }).filter((shift): shift is DemoShiftWithDetails => shift !== null);
  }

  getShiftById(id: string): DemoShiftWithDetails | undefined {
    const shift = this.data.shifts.find(s => s.id === id);
    if (!shift) return undefined;

    const store = this.getStoreById(shift.store_id);
    const user = this.getUserById(shift.user_id);
    const team = this.getTeamById(user?.team || '') || { id: "unknown", name: "Senza team", description: "" };
    const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);

    // Return undefined if store or user is missing
    if (!store || !user) {
      console.warn(`Cannot get shift ${id}: missing store (${shift.store_id}) or user (${shift.user_id})`);
      return undefined;
    }

    return {
      ...shift,
      store,
      user,
      team,
      hours
    };
  }

  // CRUD Operations for Shifts
  createShift(shiftData: Omit<DemoShift, 'id' | 'created_at' | 'updated_at'>): DemoShift {
    const newShift: DemoShift = {
      ...shiftData,
      id: `shift_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    this.data.shifts.push(newShift);
    this.saveToStorage();
    return newShift;
  }

  updateShift(id: string, updates: Partial<Omit<DemoShift, 'id' | 'created_at'>>): DemoShift | null {
    const shiftIndex = this.data.shifts.findIndex(shift => shift.id === id);
    if (shiftIndex === -1) return null;

    this.data.shifts[shiftIndex] = {
      ...this.data.shifts[shiftIndex],
      ...updates,
      updated_at: new Date().toISOString()
    };

    this.saveToStorage();
    return this.data.shifts[shiftIndex];
  }

  deleteShift(id: string): boolean {
    const shiftIndex = this.data.shifts.findIndex(shift => shift.id === id);
    if (shiftIndex === -1) return false;

    this.data.shifts.splice(shiftIndex, 1);
    this.saveToStorage();
    return true;
  }

  // Filter methods
  filterShifts(filters: {
    stores?: string[];
    teams?: string[];
    persons?: string[];
    roles?: string[];
    period?: { from: Date; to: Date };
  }): DemoShiftWithDetails[] {
    let shifts = this.getShiftsWithDetails();

    if (filters.stores && filters.stores.length > 0) {
      shifts = shifts.filter(shift => filters.stores!.includes(shift.store_id));
    }

    if (filters.teams && filters.teams.length > 0) {
      shifts = shifts.filter(shift => filters.teams!.includes(shift.team.id));
    }

    if (filters.persons && filters.persons.length > 0) {
      shifts = shifts.filter(shift => filters.persons!.includes(shift.user_id));
    }

    if (filters.roles && filters.roles.length > 0) {
      shifts = shifts.filter(shift => filters.roles!.includes(shift.user.role));
    }

    if (filters.period) {
      // include events that overlap the range [from, to]
      shifts = shifts.filter(shift => {
        const shiftStart = new Date(shift.start_at);
        const shiftEnd = new Date(shift.end_at);
        return shiftEnd >= filters.period!.from && shiftStart <= filters.period!.to;
      });
    }

    return shifts;
  }

  // Statistics
  getTotalHours(): number {
    return this.data.shifts.reduce((total, shift) => {
      const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);
  }

  getTotalShifts(): number {
    return this.data.shifts.length;
  }

  getPublishedShifts(): number {
    return this.data.shifts.filter(shift => shift.published).length;
  }

  getDraftShifts(): number {
    return this.data.shifts.filter(shift => !shift.published).length;
  }

  // Leave Balances
  getLeaveBalances(): DemoLeaveBalance[] {
    return this.data.leave_balances || [];
  }

  getLeaveBalanceByUserId(userId: string): DemoLeaveBalance | null {
    return this.data.leave_balances?.find(balance => balance.user_id === userId) || null;
  }

  // Sales Management
  getAllSales(): DemoSale[] {
    const sales = this.data.sales || [];
    // Sort by sale_date descending (most recent first)
    return sales.sort((a, b) => new Date(b.sale_date).getTime() - new Date(a.sale_date).getTime());
  }

  getSalesByStore(storeId: string): DemoSale[] {
    return this.data.sales?.filter(sale => sale.store_id === storeId) || [];
  }

  getSalesByUser(userId: string): DemoSale[] {
    return this.data.sales?.filter(sale => sale.user_id === userId) || [];
  }

  getSalesByDateRange(from: Date, to: Date): DemoSale[] {
    return this.data.sales?.filter(sale => {
      const saleDate = new Date(sale.sale_date);
      return saleDate >= from && saleDate <= to;
    }) || [];
  }

  addSale(sale: Omit<DemoSale, 'id' | 'created_at'>): DemoSale {
    const newSale: DemoSale = {
      ...sale,
      id: `sale_${Date.now()}`,
      created_at: new Date().toISOString()
    };
    
    if (!this.data.sales) {
      this.data.sales = [];
    }
    
    this.data.sales.push(newSale);
    this.saveToStorage();
    return newSale;
  }

  getSalesStats(period?: { from: Date; to: Date }): SalesStats {
    let sales = this.data.sales || [];
    
    if (period) {
      sales = sales.filter(sale => {
        const saleDate = new Date(sale.sale_date);
        return saleDate >= period.from && saleDate <= period.to;
      });
    }

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total_amount, 0);
    const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Sales by category
    const salesByCategory: { [category: string]: number } = {};
    sales.forEach(sale => {
      salesByCategory[sale.category] = (salesByCategory[sale.category] || 0) + sale.total_amount;
    });

    // Sales by store
    const salesByStore: { [storeId: string]: { name: string; sales: number; revenue: number } } = {};
    sales.forEach(sale => {
      const store = this.getStoreById(sale.store_id);
      if (!salesByStore[sale.store_id]) {
        salesByStore[sale.store_id] = {
          name: store?.name || 'Store Unknown',
          sales: 0,
          revenue: 0
        };
      }
      salesByStore[sale.store_id].sales += 1;
      salesByStore[sale.store_id].revenue += sale.total_amount;
    });

    // Sales by payment method
    const salesByPaymentMethod: { [method: string]: number } = {};
    sales.forEach(sale => {
      salesByPaymentMethod[sale.payment_method] = (salesByPaymentMethod[sale.payment_method] || 0) + sale.total_amount;
    });

    // Daily sales
    const dailySales: { [date: string]: number } = {};
    sales.forEach(sale => {
      const date = new Date(sale.sale_date).toISOString().split('T')[0];
      dailySales[date] = (dailySales[date] || 0) + sale.total_amount;
    });

    // Top products
    const productStats: { [name: string]: { quantity: number; revenue: number } } = {};
    sales.forEach(sale => {
      if (!productStats[sale.product_name]) {
        productStats[sale.product_name] = { quantity: 0, revenue: 0 };
      }
      productStats[sale.product_name].quantity += sale.quantity;
      productStats[sale.product_name].revenue += sale.total_amount;
    });

    const topProducts = Object.entries(productStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalSales,
      totalRevenue,
      averageOrderValue,
      salesByCategory,
      salesByStore,
      salesByPaymentMethod,
      dailySales,
      topProducts
    };
  }

  // Get sales data for line charts
  getSalesByStoreOverTime(storeIds?: string[], days: number = 30): { [storeId: string]: { [date: string]: number } } {
    const sales = this.data.sales || [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const result: { [storeId: string]: { [date: string]: number } } = {};
    
    // Initialize all dates with 0
    const allDates: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split('T')[0]);
    }
    
    // Get all stores or filter by storeIds
    const stores = storeIds ? 
      this.data.stores.filter(store => storeIds.includes(store.id)) :
      this.data.stores;
    
    stores.forEach(store => {
      result[store.id] = {};
      allDates.forEach(date => {
        result[store.id][date] = 0;
      });
    });
    
    // Fill with actual sales data
    sales.forEach(sale => {
      const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
      if (saleDate >= allDates[0] && saleDate <= allDates[allDates.length - 1]) {
        if (!storeIds || storeIds.includes(sale.store_id)) {
          if (result[sale.store_id]) {
            result[sale.store_id][saleDate] = (result[sale.store_id][saleDate] || 0) + sale.total_amount;
          }
        }
      }
    });
    
    return result;
  }

  getSalesByProductOverTime(productNames?: string[], days: number = 30): { [productName: string]: { [date: string]: number } } {
    const sales = this.data.sales || [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);
    
    const result: { [productName: string]: { [date: string]: number } } = {};
    
    // Initialize all dates with 0
    const allDates: string[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      allDates.push(d.toISOString().split('T')[0]);
    }
    
    // Get all products or filter by productNames
    const allProducts = [...new Set(sales.map(sale => sale.product_name))];
    const products = productNames ? 
      allProducts.filter(product => productNames.includes(product)) :
      allProducts;
    
    products.forEach(product => {
      result[product] = {};
      allDates.forEach(date => {
        result[product][date] = 0;
      });
    });
    
    // Fill with actual sales data
    sales.forEach(sale => {
      const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
      if (saleDate >= allDates[0] && saleDate <= allDates[allDates.length - 1]) {
        if (!productNames || productNames.includes(sale.product_name)) {
          if (result[sale.product_name]) {
            result[sale.product_name][saleDate] = (result[sale.product_name][saleDate] || 0) + sale.total_amount;
          }
        }
      }
    });
    
    return result;
  }

  // Personal Timesheet Statistics
  getPersonalTimesheetStats(userId: string, period?: { from: Date; to: Date }): PersonalTimesheetStats {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Get shifts for this user within the specified period
    let userShifts = this.getShiftsByUser(userId);

    if (period) {
      userShifts = userShifts.filter(shift => {
        const shiftStart = new Date(shift.start_at);
        const shiftEnd = new Date(shift.end_at);
        return shiftEnd >= period.from && shiftStart <= period.to;
      });
    }

    // Calculate hours and overtime
    let totalHours = 0;
    let regularHours = 0;
    let overtimeHours = 0;

    userShifts.forEach(shift => {
      const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);
      totalHours += hours;

      // Assuming 8 hours is regular workday
      if (hours <= 8) {
        regularHours += hours;
      } else {
        regularHours += 8;
        overtimeHours += hours - 8;
      }
    });

    // Calculate weekly hours (from Monday of current week to today)
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Adjust for Sunday
    const mondayOfWeek = new Date(now);
    mondayOfWeek.setDate(now.getDate() + mondayOffset);
    mondayOfWeek.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date(now);
    endOfToday.setHours(23, 59, 59, 999);

    // Get shifts from Monday to today (completed shifts)
    const completedWeeklyShifts = userShifts.filter(shift => {
      const shiftDate = new Date(shift.start_at);
      return shiftDate >= mondayOfWeek && shiftDate <= endOfToday;
    });

    const weeklyHours = completedWeeklyShifts.reduce((total, shift) => {
      const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    // Get shifts from tomorrow to end of week (remaining shifts)
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const sundayOfWeek = new Date(mondayOfWeek);
    sundayOfWeek.setDate(mondayOfWeek.getDate() + 6);
    sundayOfWeek.setHours(23, 59, 59, 999);

    const remainingWeeklyShifts = userShifts.filter(shift => {
      const shiftDate = new Date(shift.start_at);
      return shiftDate >= tomorrow && shiftDate <= sundayOfWeek;
    });

    const weeklyHoursRemaining = remainingWeeklyShifts.reduce((total, shift) => {
      const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);
      return total + hours;
    }, 0);

    // Get shifts with details for recent shifts (sort by date descending, take first 10)
    const shiftsWithDetails = this.getShiftsWithDetails()
      .filter(shift => shift.user_id === userId)
      .sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime())
      .slice(0, 10);

    // Get leave balance
    const leaveBalance = this.getLeaveBalanceByUserId(userId);

    return {
      user,
      totalHours: Math.round(totalHours * 100) / 100,
      regularHours: Math.round(regularHours * 100) / 100,
      overtimeHours: Math.round(overtimeHours * 100) / 100,
      weeklyHours: Math.round(weeklyHours * 100) / 100,
      weeklyHoursRemaining: Math.round(weeklyHoursRemaining * 100) / 100,
      shiftsCount: userShifts.length,
      publishedShiftsCount: userShifts.filter(s => s.published).length,
      draftShiftsCount: userShifts.filter(s => !s.published).length,
      leaveBalance,
      recentShifts: shiftsWithDetails
    };
  }

  // CSV Export for Personal Timesheet
  exportPersonalTimesheetToCSV(userId: string, period?: { from: Date; to: Date }): string {
    const stats = this.getPersonalTimesheetStats(userId, period);

    // CSV Header
    let csv = 'Data,Orario Inizio,Orario Fine,Ore,Negozio,Note,Pubblicato\n';

    // Add shifts data
    stats.recentShifts.forEach(shift => {
      const startDate = new Date(shift.start_at);
      const endDate = new Date(shift.end_at);
      const date = startDate.toLocaleDateString('it-IT');
      const startTime = startDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
      const endTime = endDate.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      csv += `"${date}","${startTime}","${endTime}","${shift.hours}","${shift.store.name}","${shift.note || ''}","${shift.published ? 'Si' : 'No'}"\n`;
    });

    // Add summary at the end
    csv += '\n';
    csv += `"Riepilogo","Ore Totali: ${stats.totalHours}","Ore Settimanali: ${stats.weeklyHours}","Ore Rimanenti: ${stats.weeklyHoursRemaining}","Turni: ${stats.shiftsCount}"\n`;

    if (stats.leaveBalance) {
      csv += `"Ferie","Totale: ${stats.leaveBalance.annual_leave_days}","Usate: ${stats.leaveBalance.used_leave_days}","Rimanenti: ${stats.leaveBalance.remaining_leave_days}"\n`;
      csv += `"Permessi Malattia","Totale: ${stats.leaveBalance.sick_leave_days}","Usati: ${stats.leaveBalance.used_sick_days}"\n`;
    }

    return csv;
  }

  // Store Opening Hours Management for Admin Calendar
  getStoreOpeningHours(storeId: string, date: Date): { open: boolean; openTime?: string; closeTime?: string } {
    const store = this.getStoreById(storeId);
    if (!store || !store.opening_hours) {
      return { open: false };
    }

    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayOfWeek = dayNames[date.getDay()] as keyof typeof store.opening_hours;
    const hours = store.opening_hours[dayOfWeek];
    
    if (!hours || hours === 'closed') {
      return { open: false };
    }

    const [openTime, closeTime] = hours.split('-');
    return { open: true, openTime, closeTime };
  }

  getStoresOpenOnDate(date: Date): Array<{ store: DemoStore; openTime: string; closeTime: string }> {
    const openStores: Array<{ store: DemoStore; openTime: string; closeTime: string }> = [];
    
    this.data.stores.forEach(store => {
      const hours = this.getStoreOpeningHours(store.id, date);
      if (hours.open && hours.openTime && hours.closeTime) {
        openStores.push({
          store,
          openTime: hours.openTime,
          closeTime: hours.closeTime
        });
      }
    });

    return openStores;
  }

  getStoreShiftsForDate(storeId: string, date: Date): DemoShiftWithDetails[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.getShiftsWithDetails().filter(shift => {
      const shiftDate = new Date(shift.start_at);
      return shift.store_id === storeId && 
             shiftDate >= startOfDay && 
             shiftDate <= endOfDay;
    });
  }

  getStoreShiftsTimeline(storeId: string, date: Date): Array<{
    user: DemoUser;
    shift: DemoShiftWithDetails;
    startTime: string;
    endTime: string;
    duration: string;
  }> {
    const shifts = this.getStoreShiftsForDate(storeId, date);
    
    return shifts.map(shift => {
      const startDate = new Date(shift.start_at);
      const endDate = new Date(shift.end_at);
      
      const startTime = startDate.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const endTime = endDate.toLocaleTimeString('it-IT', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      const duration = `${shift.hours}h`;
      
      return {
        user: shift.user,
        shift,
        startTime,
        endTime,
        duration
      };
    }).sort((a, b) => a.startTime.localeCompare(b.startTime));
  }
}

// Export singleton instance
export const demoDataService = new DemoDataService();
