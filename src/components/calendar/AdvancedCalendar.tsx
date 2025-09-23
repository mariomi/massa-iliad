"use client";
import { useEffect, useState, useMemo } from "react";
import { Calendar, dayjsLocalizer, View, SlotInfo, Event } from "react-big-calendar";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Users, Filter, Plus } from "lucide-react";
import { useMe } from "@/lib/auth/useMe";
import { canEditPlanner } from "@/lib/auth/rbac";
import { demoDataService, DemoShiftWithDetails } from "@/lib/demo-data/demo-service";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Custom styles for clean calendar appearance
const customCalendarStyles = `
  .rbc-calendar {
    background: transparent !important;
    font-family: inherit;
  }

  .rbc-header {
    background: #f9fafb;
    border-bottom: 2px solid #e5e7eb;
    font-weight: 600;
    padding: 10px 6px;
    font-size: 14px;
    color: #374151;
  }

  .dark .rbc-header {
    background: #1f2937 !important;
    border-bottom: 2px solid #374151 !important;
    color: #f9fafb !important;
  }

  .rbc-month-view {
    background: transparent;
  }

  .dark .rbc-month-view {
    background: #111827 !important;
  }

  .rbc-date-cell {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    padding: 4px;
    transition: background-color 0.2s;
    color: #111827;
  }

  .dark .rbc-date-cell {
    background: #111827 !important;
    border: 1px solid #374151 !important;
    color: #f9fafb !important;
  }

  .rbc-date-cell:hover {
    background: #f3f4f6;
  }

  .dark .rbc-date-cell:hover {
    background: #1f2937 !important;
  }

  .rbc-date-cell.rbc-now {
    background: #dbeafe;
    border-color: #3b82f6;
  }

  .dark .rbc-date-cell.rbc-now {
    background: #1e3a8a !important;
    border-color: #60a5fa !important;
  }

  .rbc-week-view, .rbc-time-view {
    background: transparent;
  }

  .dark .rbc-week-view, .dark .rbc-time-view {
    background: #111827 !important;
  }

  .rbc-time-header {
    background: #f9fafb;
  }

  .dark .rbc-time-header {
    background: #1f2937 !important;
  }

  .rbc-time-content {
    background: transparent;
  }

  .dark .rbc-time-content {
    background: #111827 !important;
  }

  .rbc-time-gutter {
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
  }

  .dark .rbc-time-gutter {
    background: #1f2937 !important;
    border-right: 1px solid #374151 !important;
  }

  .rbc-day-bg {
    background: #ffffff;
  }

  .dark .rbc-day-bg {
    background: #111827 !important;
  }

  .rbc-agenda-view {
    background: transparent;
  }

  .dark .rbc-agenda-view {
    background: #111827 !important;
  }

  .rbc-agenda-table {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .dark .rbc-agenda-table {
    background: #111827 !important;
    border: 1px solid #374151 !important;
  }

  .rbc-agenda-view table {
    font-size: 14px;
  }

  .rbc-agenda-view th {
    background: #f3f4f6;
    font-weight: 600;
    padding: 12px 8px;
    border-bottom: 2px solid #d1d5db;
    color: #374151;
  }

  .dark .rbc-agenda-view th {
    background: #1f2937 !important;
    border-bottom: 2px solid #374151 !important;
    color: #f9fafb !important;
  }

  .rbc-agenda-view td {
    padding: 8px 12px;
    border-bottom: 1px solid #f3f4f6;
  }

  .dark .rbc-agenda-view td {
    border-bottom: 1px solid #374151 !important;
    color: #f9fafb !important;
  }

  .rbc-agenda-view .rbc-agenda-time-cell {
    font-weight: 500;
    color: #6b7280;
  }

  .dark .rbc-agenda-view .rbc-agenda-time-cell {
    color: #9ca3af !important;
  }

  .rbc-event {
    border-radius: 8px !important;
    border: 2px solid !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
    margin: 2px 0 !important;
    min-height: 35px !important;
    transition: all 0.2s ease;
  }

  .dark .rbc-event {
    box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
  }

  .rbc-event:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15) !important;
  }

  .dark .rbc-event:hover {
    box-shadow: 0 4px 8px rgba(0,0,0,0.4) !important;
  }

  .rbc-event.rbc-selected {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  .dark .rbc-event.rbc-selected {
    outline: 2px solid #60a5fa !important;
  }

  .rbc-show-more {
    background: #3b82f6 !important;
    color: white !important;
    border-radius: 6px !important;
    font-weight: 500 !important;
    padding: 4px 8px !important;
    font-size: 12px !important;
  }

  .rbc-today {
    background: #dbeafe !important;
  }

  .dark .rbc-today {
    background: #1e3a8a !important;
  }

  .rbc-toolbar {
    background: #f9fafb;
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 16px;
    display: none; /* Nasconde la toolbar di default */
  }

  .dark .rbc-toolbar {
    background: #1f2937 !important;
  }

  .rbc-time-slot {
    border-top: 1px solid #f3f4f6;
  }

  .dark .rbc-time-slot {
    border-top: 1px solid #374151 !important;
  }

  /* Additional dark mode styles */
  .dark .rbc-header {
    background: #1f2937 !important;
    color: #f9fafb !important;
    border-bottom: 1px solid #374151 !important;
  }

  .dark .rbc-header + .rbc-header {
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-month-row + .rbc-month-row {
    border-top: 1px solid #374151 !important;
  }

  .dark .rbc-date-cell + .rbc-date-cell {
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-off-range {
    color: #6b7280 !important;
  }

  .dark .rbc-off-range-bg {
    background: #1f2937 !important;
  }

  /* Calendar numbers */
  .dark .rbc-date-cell > a {
    color: #f9fafb !important;
  }

  .dark .rbc-off-range > a {
    color: #6b7280 !important;
  }

  /* Time view specific */
  .dark .rbc-time-header-gutter {
    background: #1f2937 !important;
    color: #f9fafb !important;
  }

  .dark .rbc-time-slot {
    color: #9ca3af !important;
  }

  .dark .rbc-timeslot-group {
    border-bottom: 1px solid #374151 !important;
  }

  /* Agenda view improvements */
  .dark .rbc-agenda-view .rbc-agenda-event-cell {
    color: #f9fafb !important;
  }

  .dark .rbc-agenda-view .rbc-agenda-date-cell {
    color: #f9fafb !important;
    font-weight: 600 !important;
  }

  .dark .rbc-agenda-view .rbc-agenda-time-cell {
    color: #9ca3af !important;
  }

  /* Event improvements */
  .dark .rbc-event-content {
    color: #ffffff !important;
  }

  .dark .rbc-event-label {
    color: #ffffff !important;
  }

  /* Calendar outline and borders */
  .rbc-calendar {
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    overflow: hidden;
  }

  .dark .rbc-calendar {
    border: 1px solid #374151 !important;
  }

  .rbc-month-view {
    border: none;
  }

  .dark .rbc-month-view {
    border: none !important;
  }

  .rbc-month-row {
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .rbc-month-row {
    border-bottom: 1px solid #374151 !important;
  }

  .rbc-date-cell {
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .rbc-date-cell {
    border-right: 1px solid #374151 !important;
    border-bottom: 1px solid #374151 !important;
  }

  .rbc-date-cell:last-child {
    border-right: none;
  }

  /* Week and day view borders */
  .rbc-time-view {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .dark .rbc-time-view {
    border: 1px solid #374151 !important;
  }

  .rbc-time-header {
    border-bottom: 2px solid #e5e7eb;
  }

  .dark .rbc-time-header {
    border-bottom: 2px solid #374151 !important;
  }

  /* Agenda view borders */
  .rbc-agenda-view {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }

  .dark .rbc-agenda-view {
    border: 1px solid #374151 !important;
  }

  /* Fix for white vertical lines in dark mode */
  .dark .rbc-month-view .rbc-date-cell {
    border-right: 1px solid #374151 !important;
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-month-view .rbc-row {
    border-right: 1px solid #374151 !important;
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-month-view .rbc-row-content {
    border-right: 1px solid #374151 !important;
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-month-view .rbc-row-segment {
    border-right: 1px solid #374151 !important;
    border-left: 1px solid #374151 !important;
  }

  /* More specific selectors for vertical lines */
  .dark .rbc-calendar .rbc-month-view .rbc-date-cell {
    border-right: 1px solid #374151 !important;
  }

  .dark .rbc-calendar .rbc-month-view .rbc-row {
    border-right: 1px solid #374151 !important;
  }

  /* Override any white borders */
  .dark .rbc-month-view * {
    border-color: #374151 !important;
  }

  /* Specific fix for the grid lines */
  .dark .rbc-month-view .rbc-date-cell + .rbc-date-cell {
    border-left: 1px solid #374151 !important;
  }

  /* Ultra-specific selectors to override react-big-calendar defaults */
  .dark .rbc-calendar .rbc-month-view .rbc-date-cell,
  .dark .rbc-calendar .rbc-month-view .rbc-row,
  .dark .rbc-calendar .rbc-month-view .rbc-row-content,
  .dark .rbc-calendar .rbc-month-view .rbc-row-segment {
    border-right: 1px solid #374151 !important;
    border-left: 1px solid #374151 !important;
    border-color: #374151 !important;
  }

  /* Force all borders to be dark gray */
  .dark .rbc-month-view *[style*="border"] {
    border-color: #374151 !important;
  }

  /* Target specific react-big-calendar classes */
  .dark .rbc-month-view .rbc-date-cell[style*="border"] {
    border-color: #374151 !important;
  }

  /* Use CSS custom properties if available */
  .dark .rbc-calendar {
    --rbc-border-color: #374151;
  }

  .dark .rbc-month-view {
    --rbc-border-color: #374151;
  }

  /* Fix for all calendar views - Week, Day, Agenda */
  .dark .rbc-time-view .rbc-time-gutter {
    border-right: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-time-content {
    border-left: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-time-slot {
    border-top: 1px solid #374151 !important;
    border-bottom: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-day-slot {
    border-right: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-timeslot-group {
    border-bottom: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-time-header {
    border-bottom: 1px solid #374151 !important;
  }

  .dark .rbc-time-view .rbc-time-header-content {
    border-right: 1px solid #374151 !important;
  }

  /* Week view specific */
  .dark .rbc-week-view .rbc-day-slot {
    border-right: 1px solid #374151 !important;
  }

  .dark .rbc-week-view .rbc-time-slot {
    border-top: 1px solid #374151 !important;
  }

  /* Day view specific */
  .dark .rbc-day-view .rbc-time-slot {
    border-top: 1px solid #374151 !important;
  }

  /* Agenda/List view specific */
  .dark .rbc-agenda-view .rbc-agenda-table {
    border: 1px solid #374151 !important;
  }

  .dark .rbc-agenda-view .rbc-agenda-table th {
    border-bottom: 1px solid #374151 !important;
    border-right: 1px solid #374151 !important;
  }

  .dark .rbc-agenda-view .rbc-agenda-table td {
    border-bottom: 1px solid #374151 !important;
    border-right: 1px solid #374151 !important;
  }

  /* Override any remaining white borders in all views */
  .dark .rbc-time-view *,
  .dark .rbc-week-view *,
  .dark .rbc-day-view *,
  .dark .rbc-agenda-view * {
    border-color: #374151 !important;
  }

  .rbc-current-time-indicator {
    background: #ef4444;
    height: 2px;
  }

  /* Improve week view alignment */
  .rbc-week-view .rbc-event {
    margin: 2px 4px !important;
    min-height: 45px !important;
  }

  .rbc-week-view .rbc-event-content {
    padding: 4px 8px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: space-between !important;
  }

  .rbc-week-view .rbc-time-header-content {
    text-align: center;
  }

  .rbc-week-view .rbc-header {
    text-align: center;
    font-weight: 600;
  }

  /* Day view improvements */
  .rbc-day-view .rbc-event {
    margin: 3px 0 !important;
    min-height: 50px !important;
  }

  .rbc-day-view .rbc-event-content {
    padding: 6px 10px !important;
  }

  /* Month view with better overflow handling */
  .rbc-month-view .rbc-event {
    margin: 1px 2px !important;
    min-height: 20px !important;
    font-size: 11px !important;
    padding: 2px 4px !important;
    border-radius: 4px !important;
  }

  .rbc-month-view .rbc-event:hover {
    background: rgba(59, 130, 246, 0.1) !important;
  }

  /* Better overflow indicator */
  .rbc-month-view .rbc-show-more {
    background: rgba(59, 130, 246, 0.8) !important;
    color: white !important;
    border-radius: 4px !important;
    font-weight: 500 !important;
    padding: 2px 6px !important;
    font-size: 10px !important;
    margin-top: 2px !important;
  }

  /* Migliora overlay popup */
  .rbc-overlay {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    padding: 16px;
    max-width: 350px;
  }

  .rbc-overlay-header {
    font-weight: 600;
    margin-bottom: 8px;
    color: #111827;
    font-size: 16px;
  }

  /* Migliora time slots */
  .rbc-timeslot-group {
    min-height: 36px;
  }

  /* Focus states migliorati */
  .rbc-event:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    .rbc-calendar {
      font-size: 12px !important;
    }

    .rbc-header {
      padding: 6px 3px;
      font-size: 12px;
    }

    .rbc-agenda-view th,
    .rbc-agenda-view td {
      padding: 6px 8px;
    }

    .rbc-event {
      min-height: 30px !important;
      font-size: 11px !important;
    }
  }
`;

// Inject custom styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = customCalendarStyles;
  document.head.appendChild(styleSheet);
}

dayjs.locale("it");
const localizer = dayjsLocalizer(dayjs);

export interface ShiftEvent extends Event {
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

export interface CalendarFilters {
  stores: string[];
  teams: string[];
  persons: string[];
  roles: string[];
  period: {
    from: Date;
    to: Date;
  };
}

interface AdvancedCalendarProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  onShiftCreate?: (slot: SlotInfo) => void;
  onShiftEdit?: (event: ShiftEvent) => void;
  onShiftDelete?: (event: ShiftEvent) => void;
  onShowFilters?: () => void;
  refreshTrigger?: number;
}

export function AdvancedCalendar({ 
  filters, 
  onFiltersChange, 
  onShiftCreate, 
  onShiftEdit, 
  onShiftDelete,
  onShowFilters,
  refreshTrigger
}: AdvancedCalendarProps) {
  const { me } = useMe();
  const [events, setEvents] = useState<ShiftEvent[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const canEdit = canEditPlanner(me?.role ?? "user", null);

  // Helper to compute visible range based on current view/date
  const getVisibleRange = (currentDate: Date, currentView: View) => {
    const d = new Date(currentDate);
    if (currentView === "month") {
      const start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
    if (currentView === "week" || currentView === "agenda") {
      const jsDay = d.getDay(); // 0=Sun..6=Sat
      const mondayOffset = (jsDay + 6) % 7; // number of days since Monday
      const start = new Date(d);
      start.setDate(d.getDate() - mondayOffset);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
    // day
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    return { start, end };
  };

  // Load events based on filters and current visible range
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const { start: viewStart, end: viewEnd } = getVisibleRange(date, view);
        const start = filters.period ? new Date(Math.max(viewStart.getTime(), filters.period.from.getTime())) : viewStart;
        const end = filters.period ? new Date(Math.min(viewEnd.getTime(), filters.period.to.getTime())) : viewEnd;

        // Get filtered shifts from demo data
        let filterOptions = {
          stores: filters.stores.length > 0 ? filters.stores : undefined,
          teams: filters.teams.length > 0 ? filters.teams : undefined,
          persons: filters.persons.length > 0 ? filters.persons : undefined,
          roles: filters.roles.length > 0 ? filters.roles : undefined,
          period: { from: start, to: end }
        };

        // If user is workforce, only show their own shifts
        if (me?.role === "workforce" && me?.id) {
          filterOptions.persons = [me.id];
        }

        const filteredShifts = demoDataService.filterShifts(filterOptions);

        // Convert to calendar events
        const calendarEvents: ShiftEvent[] = filteredShifts.map(shift => ({
          id: shift.id,
          title: shift.title,
          start: new Date(shift.start_at),
          end: new Date(shift.end_at),
          resource: {
            storeId: shift.store_id,
            storeName: shift.store.name,
            userId: shift.user_id,
            userName: shift.user.name,
            role: shift.user.role,
            published: shift.published,
            note: shift.note,
            hours: shift.hours,
            team: shift.team.name
          }
        }));

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error loading events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, [filters, refreshTrigger, date, view, me]);

  const handleSelectSlot = (slot: SlotInfo) => {
    if (canEdit && onShiftCreate) {
      onShiftCreate(slot);
    }
  };

  const handleSelectEvent = (event: ShiftEvent) => {
    if (canEdit && onShiftEdit) {
      onShiftEdit(event);
    }
  };

  const eventStyleGetter = (event: ShiftEvent) => {
    const isPublished = event.resource.published;
    const isManager = event.resource.role === "manager";
    const isWorkforce = event.resource.role === "workforce";
    
    let backgroundColor, borderColor;
    
    if (!isPublished) {
      backgroundColor = "#92400e"; // Giallo scuro per dark mode
      borderColor = "#f59e0b";
    } else if (isManager) {
      backgroundColor = "#1e3a8a"; // Blu scuro
      borderColor = "#3b82f6";
    } else if (isWorkforce) {
      backgroundColor = "#581c87"; // Viola scuro
      borderColor = "#8b5cf6";
    } else {
      backgroundColor = "#065f46"; // Verde scuro
      borderColor = "#10b981";
    }
    
    return {
      style: {
        backgroundColor,
        borderColor,
        color: "#ffffff",
        borderRadius: "6px",
        border: `1px solid ${borderColor}`,
        fontSize: "14px",
        padding: "6px 10px",
        minHeight: "32px",
        margin: "2px 0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
      }
    };
  };

  const weeklyHours = useMemo(() => {
    const { start, end } = getVisibleRange(date, "week");
    return events
      .filter(event => {
        const eventDate = new Date(event.start);
        return eventDate >= start && eventDate <= end;
      })
      .reduce((total, event) => total + (event.resource.hours || 0), 0);
  }, [events, date]);

  return (
    <div className="space-y-6">
      {/* Header semplificato */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon size={24} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Calendario Turni</h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>{weeklyHours.toFixed(1)}h questa settimana</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{events.length} turni</span>
            </div>
          </div>
        </div>

        {/* Pulsanti semplificati */}
        <div className="flex items-center gap-3">
          {/* Only show filters button for non-workforce users */}
          {me?.role !== "workforce" && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowFilters}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              <span className="hidden sm:inline">Filtri</span>
            </Button>
          )}
          {canEdit && (
            <Button
              size="sm"
              onClick={() => onShiftCreate && onShiftCreate({ start: new Date(), end: new Date(), slots: [new Date()] })}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Nuovo Turno</span>
            </Button>
          )}
        </div>
      </div>

      {/* Controlli navigazione e vista */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        {/* Controlli navigazione */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(date);
              if (view === "month") {
                newDate.setMonth(newDate.getMonth() - 1);
              } else if (view === "week") {
                newDate.setDate(newDate.getDate() - 7);
              } else if (view === "day") {
                newDate.setDate(newDate.getDate() - 1);
              }
              setDate(newDate);
            }}
            className="flex items-center gap-1"
          >
            <span className="text-lg">⬅️</span>
            <span className="hidden sm:inline">Precedente</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setDate(new Date())}
            className="flex items-center gap-1"
          >
            <span className="text-sm">📅</span>
            <span className="hidden sm:inline">Oggi</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const newDate = new Date(date);
              if (view === "month") {
                newDate.setMonth(newDate.getMonth() + 1);
              } else if (view === "week") {
                newDate.setDate(newDate.getDate() + 7);
              } else if (view === "day") {
                newDate.setDate(newDate.getDate() + 1);
              }
              setDate(newDate);
            }}
            className="flex items-center gap-1"
          >
            <span className="hidden sm:inline">Successivo</span>
            <span className="text-lg">➡️</span>
          </Button>
        </div>

        {/* Selettore vista */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">Vista:</span>
          <div className="flex items-center gap-1">
            <Button
              variant={view === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("month")}
              className="text-xs"
            >
              📅 Mese
            </Button>
            <Button
              variant={view === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("week")}
              className="text-xs"
            >
              📊 Settimana
            </Button>
            <Button
              variant={view === "day" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("day")}
              className="text-xs"
            >
              📆 Giorno
            </Button>
            <Button
              variant={view === "agenda" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("agenda")}
              className="text-xs"
            >
              📋 Lista
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar con stile pulito */}
      <div className="bg-transparent rounded-xl overflow-hidden" style={{
        '--rbc-border-color': '#374151'
      } as React.CSSProperties}>
        <Calendar
          culture="it"
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onView={setView}
          onNavigate={setDate}
          selectable={canEdit}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          views={["month", "week", "day", "agenda"]}
          defaultView="month"
          style={{
            height: "70vh",
            width: "100%",
            fontSize: "18px",
            backgroundColor: "transparent"
          }}
          step={30}
          showMultiDayTimes={true}
          resizable={false}
          popup={true}
          popupOffset={{ x: 30, y: 20 }}
          components={{
            event: ({ event }) => {
              const title = event?.title ?? "";
              return (
                <div className="font-medium truncate flex items-center justify-between">
                  <span className="truncate flex-1 text-white">{title}</span>
                  {event?.resource?.hours ? (
                    <span className="text-xs font-bold ml-1 opacity-90 text-white">{event.resource.hours}h</span>
                  ) : null}
                </div>
              );
            },
            agenda: {
              event: ({ event }) => {
                // Gestione sicura dell'evento
                const title = event?.title || 'Turno senza nome';
                const storeName = event?.resource?.storeName || 'Negozio';
                const hours = event?.resource?.hours;
                const isPublished = event?.resource?.published !== false;
                const person = event?.resource?.userName || 'Operatore';
                const role = event?.resource?.role || '';

                return (
                  <div className="flex items-center justify-between w-full py-3 px-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-base truncate text-gray-900 dark:text-gray-100">{title}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span>📍</span>
                        <span className="truncate">{storeName}</span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
                        <span>👤</span>
                        <span className="truncate">{person}{role ? ` • ${role}` : ''}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 ml-4">
                      {hours && (
                        <div className="text-sm font-bold bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {hours}h
                        </div>
                      )}
                      {!isPublished && (
                        <div className="text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded">
                          Bozza
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
              time: ({ event }) => {
                if (!event) return <span>--:--</span>;

                try {
                  const startTime = event.start ? new Date(event.start) : null;
                  const endTime = event.end ? new Date(event.end) : null;

                  if (!startTime || !endTime) {
                    return <span>--:--</span>;
                  }

                  const startStr = startTime.toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  const endStr = endTime.toLocaleTimeString('it-IT', {
                    hour: '2-digit',
                    minute: '2-digit'
                  });

                  return <span className="font-medium text-gray-900 dark:text-gray-100">{startStr} - {endStr}</span>;
                } catch (error) {
                  return <span>--:--</span>;
                }
              },
              date: ({ event }) => {
                if (!event) return <span>--/--/----</span>;

                try {
                  const eventDate = event.start ? new Date(event.start) : null;

                  if (!eventDate) {
                    return <span>--/--/----</span>;
                  }

                  const day = eventDate.getDate().toString().padStart(2, '0');
                  const month = (eventDate.getMonth() + 1).toString().padStart(2, '0');
                  const year = eventDate.getFullYear();

                  return <span className="font-medium text-gray-900 dark:text-gray-100">{day}/{month}/{year}</span>;
                } catch (error) {
                  return <span>--/--/----</span>;
                }
              }
            },
            month: {
              event: ({ event }) => (
                <div className="text-xs font-medium truncate px-1 py-0.5">
                  <div className="flex items-center justify-between">
                    <span className="truncate flex-1 text-white">{event.title}</span>
                    {event.resource?.hours && (
                      <span className="text-xs opacity-75 ml-1 text-white">{event.resource.hours}h</span>
                    )}
                  </div>
                </div>
              )
            },
            week: {
              event: ({ event }) => (
                <div className="font-medium truncate flex items-center justify-between px-2">
                  <span className="truncate flex-1 text-white">{event.title}</span>
                  {event.resource?.hours && (
                    <span className="text-xs font-bold ml-1 opacity-90 text-white">
                      {event.resource.hours}h
                    </span>
                  )}
                </div>
              )
            },
            day: {
              event: ({ event }) => (
                <div className="font-medium flex items-center justify-between px-2">
                  <span className="truncate flex-1 text-white">{event.title}</span>
                  {event.resource?.hours && (
                    <span className="text-xs font-bold ml-1 opacity-90 text-white">
                      {event.resource.hours}h
                    </span>
                  )}
                </div>
              )
            }
          }}
          formats={{
            dayHeaderFormat: (date: Date) => dayjs(date).format("dddd DD/MM"),
            dayRangeHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${dayjs(start).format("DD/MM")} - ${dayjs(end).format("DD/MM")}`,
            agendaHeaderFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${dayjs(start).format("DD/MM/YYYY")} - ${dayjs(end).format("DD/MM/YYYY")}`,
            timeGutterFormat: (date: Date) => dayjs(date).format("HH:mm"),
            monthHeaderFormat: (date: Date) => dayjs(date).format("MMMM YYYY"),
            dayFormat: (date: Date) => dayjs(date).format("DD"),
            weekdayFormat: (date: Date) => dayjs(date).format("dd"),
            agendaDateFormat: (date: Date) => dayjs(date).format("ddd DD/MM"),
            agendaTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) => `${dayjs(start).format("HH:mm")} - ${dayjs(end).format("HH:mm")}`
          }}
          messages={{
            allDay: "Tutto il giorno",
            previous: "⬅️ Precedente",
            next: "Successivo ➡️",
            today: "🏠 Oggi",
            month: "📅 Vista Mese",
            week: "📊 Vista Settimana",
            day: "📆 Vista Giorno",
            agenda: "📋 Vista Agenda",
            date: "Data",
            time: "Ora",
            event: "Turno",
            noEventsInRange: "🎯 Nessun turno programmato in questo periodo",
            showMore: (total) => `📊 +${total} turni aggiuntivi`
          }}
        />
      </div>

      {/* Legenda semplificata */}
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-6 text-sm text-gray-900 dark:text-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{backgroundColor: "#065f46"}}></div>
            <span>Staff</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{backgroundColor: "#1e3a8a"}}></div>
            <span>Manager</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{backgroundColor: "#581c87"}}></div>
            <span>Forza Lavoro</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{backgroundColor: "#92400e"}}></div>
            <span>Bozza</span>
          </div>
        </div>
      </div>
    </div>
  );
}
