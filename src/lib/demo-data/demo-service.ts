// Import demo data directly as a constant
const demoDatabase = {
  "stores": [
    {
      "id": "store_1",
      "name": "Negozio Centro",
      "address": "Via Roma 123, Milano",
      "region": "Lombardia",
      "manager": "user_2",
      "created_at": "2024-01-15T09:00:00Z"
    },
    {
      "id": "store_2", 
      "name": "Negozio Periferia",
      "address": "Corso Italia 456, Milano",
      "region": "Lombardia",
      "manager": "user_4",
      "created_at": "2024-02-01T10:00:00Z"
    },
    {
      "id": "store_3",
      "name": "Negozio Mall",
      "address": "Galleria del Corso 789, Milano",
      "region": "Lombardia", 
      "manager": "user_2",
      "created_at": "2024-02-15T11:00:00Z"
    }
  ],
  "users": [
    {
      "id": "user_1",
      "name": "Mario Rossi",
      "email": "mario.rossi@demo.com",
      "role": "staff",
      "store_id": "store_1",
      "team": "team_vendite",
      "created_at": "2024-01-10T08:00:00Z"
    },
    {
      "id": "user_2", 
      "name": "Anna Bianchi",
      "email": "anna.bianchi@demo.com",
      "role": "manager",
      "store_id": "store_1",
      "team": "team_manager",
      "created_at": "2024-01-05T09:00:00Z"
    },
    {
      "id": "user_3",
      "name": "Luca Verdi", 
      "email": "luca.verdi@demo.com",
      "role": "staff",
      "store_id": "store_2",
      "team": "team_vendite",
      "created_at": "2024-01-12T10:00:00Z"
    },
    {
      "id": "user_4",
      "name": "Giulia Neri",
      "email": "giulia.neri@demo.com", 
      "role": "manager",
      "store_id": "store_2",
      "team": "team_manager",
      "created_at": "2024-01-08T11:00:00Z"
    },
    {
      "id": "user_5",
      "name": "Marco Blu",
      "email": "marco.blu@demo.com",
      "role": "staff", 
      "store_id": "store_3",
      "team": "team_supporto",
      "created_at": "2024-01-20T12:00:00Z"
    },
    {
      "id": "workforce_user",
      "name": "Forza Lavoro Demo",
      "email": "workforce@demo.com",
      "role": "workforce",
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
    }
  ]
};

export interface DemoStore {
  id: string;
  name: string;
  address: string;
  region: string;
  manager: string;
  created_at: string;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'manager' | 'staff' | 'viewer' | 'workforce';
  store_id: string;
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
  private data: {
    stores: DemoStore[];
    users: DemoUser[];
    teams: DemoTeam[];
    leave_balances: DemoLeaveBalance[];
    shifts: DemoShift[];
  } = { ...demoDatabase };
  private readonly initial: {
    stores: DemoStore[];
    users: DemoUser[];
    teams: DemoTeam[];
    leave_balances: DemoLeaveBalance[];
    shifts: DemoShift[];
  } = { ...demoDatabase };

  // Reset to initial demo dataset (useful after edits during dev)
  resetData() {
    this.data = JSON.parse(JSON.stringify(this.initial));
  }

  // Stores
  getStores(): DemoStore[] {
    return this.data.stores;
  }

  getStoreById(id: string): DemoStore | undefined {
    return this.data.stores.find(store => store.id === id);
  }

  // Users
  getUsers(): DemoUser[] {
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

  // Teams
  getTeams(): DemoTeam[] {
    return this.data.teams;
  }

  getTeamById(id: string): DemoTeam | undefined {
    return this.data.teams.find(team => team.id === id);
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

      return {
        ...shift,
        store: store!,
        user: user!,
        team,
        hours
      };
    });
  }

  getShiftById(id: string): DemoShiftWithDetails | undefined {
    const shift = this.data.shifts.find(s => s.id === id);
    if (!shift) return undefined;

    const store = this.getStoreById(shift.store_id);
    const user = this.getUserById(shift.user_id);
    const team = this.getTeamById(user?.team || '');
    const hours = (new Date(shift.end_at).getTime() - new Date(shift.start_at).getTime()) / (1000 * 60 * 60);

    return {
      ...shift,
      store: store!,
      user: user!,
      team: team!,
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

    return this.data.shifts[shiftIndex];
  }

  deleteShift(id: string): boolean {
    const shiftIndex = this.data.shifts.findIndex(shift => shift.id === id);
    if (shiftIndex === -1) return false;

    this.data.shifts.splice(shiftIndex, 1);
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
}

// Export singleton instance
export const demoDataService = new DemoDataService();
