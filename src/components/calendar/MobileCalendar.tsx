'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, MapPin, User } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/it';
import { demoDataService, DemoShiftWithDetails } from '@/lib/demo-data/demo-service';
import { useMe } from '@/lib/auth/useMe';

dayjs.locale('it');

interface MobileCalendarProps {
  filters: {
    store: string | null;
    team: string | null;
    person: string | null;
    role: string | null;
    period: {
      from: Date;
      to: Date;
    };
  };
  onShiftDetails?: (shift: any) => void;
  onShiftCreate?: () => void;
  onShiftEdit?: (shift: any) => void;
  onShiftDelete?: (shift: any) => void;
  refreshTrigger?: number;
}

export function MobileCalendar({ 
  filters, 
  onShiftDetails, 
  onShiftCreate, 
  onShiftEdit, 
  onShiftDelete,
  refreshTrigger 
}: MobileCalendarProps) {
  const { me } = useMe();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [shifts, setShifts] = useState<DemoShiftWithDetails[]>([]);

  // Load shifts based on filters
  useEffect(() => {
    const loadShifts = () => {
      const start = filters.period ? new Date(Math.max(currentDate.startOf('month').toDate().getTime(), filters.period.from.getTime())) : currentDate.startOf('month').toDate();
      const end = filters.period ? new Date(Math.min(currentDate.endOf('month').toDate().getTime(), filters.period.to.getTime())) : currentDate.endOf('month').toDate();

      let filterOptions = {
        stores: filters.store ? [filters.store] : undefined,
        teams: filters.team ? [filters.team] : undefined,
        persons: filters.person ? [filters.person] : undefined,
        roles: filters.role ? [filters.role] : undefined,
        period: { from: start, to: end }
      };

      // If user is workforce, dipendente, or agente, only show their own shifts
      if ((me?.role === "workforce" || me?.role === "dipendente" || me?.role === "agente") && me?.id) {
        const hasExplicitFilters = filters.store || filters.team || filters.person || filters.role;
        if (!hasExplicitFilters) {
          filterOptions.persons = [me.id];
        }
      }

      const filteredShifts = demoDataService.filterShifts(filterOptions);
      setShifts(filteredShifts);
    };

    loadShifts();
  }, [currentDate, filters, me, refreshTrigger]);

  // Get shifts for current view
  const getShiftsForView = () => {
    if (view === 'day') {
      return shifts.filter(shift => 
        dayjs(shift.start_at).isSame(currentDate, 'day')
      );
    } else if (view === 'week') {
      const weekStart = currentDate.startOf('week');
      const weekEnd = currentDate.endOf('week');
      return shifts.filter(shift => 
        dayjs(shift.start_at).isBetween(weekStart, weekEnd, 'day', '[]')
      );
    } else {
      return shifts.filter(shift => 
        dayjs(shift.start_at).isSame(currentDate, 'month')
      );
    }
  };

  // Get days for current month
  const getDaysInMonth = () => {
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
    const days = [];
    let day = startOfWeek;
    
    while (day.isBefore(endOfWeek) || day.isSame(endOfWeek, 'day')) {
      days.push(day);
      day = day.add(1, 'day');
    }
    
    return days;
  };

  // Get shifts for a specific day
  const getShiftsForDay = (day: dayjs.Dayjs) => {
    return shifts.filter(shift => 
      dayjs(shift.start_at).isSame(day, 'day')
    );
  };

  // Navigation handlers
  const goToPrevious = () => {
    if (view === 'day') {
      setCurrentDate(currentDate.subtract(1, 'day'));
    } else if (view === 'week') {
      setCurrentDate(currentDate.subtract(1, 'week'));
    } else {
      setCurrentDate(currentDate.subtract(1, 'month'));
    }
  };

  const goToNext = () => {
    if (view === 'day') {
      setCurrentDate(currentDate.add(1, 'day'));
    } else if (view === 'week') {
      setCurrentDate(currentDate.add(1, 'week'));
    } else {
      setCurrentDate(currentDate.add(1, 'month'));
    }
  };

  const goToToday = () => {
    setCurrentDate(dayjs());
  };

  const canEdit = me?.role === 'admin' || me?.role === 'manager';

  // Render day view
  const renderDayView = () => {
    const dayShifts = getShiftsForView();
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentDate.format('dddd, D MMMM YYYY')}
          </h2>
        </div>
        
        {dayShifts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Nessun turno programmato</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {dayShifts.map((shift) => (
              <Card key={shift.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => onShiftDetails?.(shift)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {dayjs(shift.start_at).format('HH:mm')} - {dayjs(shift.end_at).format('HH:mm')}
                        </span>
                        <Badge variant={shift.published ? "default" : "secondary"} className="text-xs">
                          {shift.published ? 'Pubblicato' : 'Bozza'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{shift.store_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{shift.user_name}</span>
                        </div>
                        {shift.note && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{shift.note}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                        {shift.hours}h
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const weekShifts = getShiftsForView();
    const weekStart = currentDate.startOf('week');
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Settimana {weekStart.format('D MMM')} - {weekStart.add(6, 'days').format('D MMM YYYY')}
          </h2>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 7 }, (_, i) => {
            const day = weekStart.add(i, 'days');
            const dayShifts = weekShifts.filter(shift => 
              dayjs(shift.start_at).isSame(day, 'day')
            );
            
            return (
              <Card key={day.format('YYYY-MM-DD')}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span>{day.format('dddd, D MMM')}</span>
                    <Badge variant="outline" className="text-xs">
                      {dayShifts.length} turni
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {dayShifts.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400">Nessun turno</p>
                  ) : (
                    <div className="space-y-2">
                      {dayShifts.slice(0, 3).map((shift) => (
                        <div 
                          key={shift.id} 
                          className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          onClick={() => onShiftDetails?.(shift)}
                        >
                          <div className="font-medium text-blue-900 dark:text-blue-100">
                            {dayjs(shift.start_at).format('HH:mm')} - {dayjs(shift.end_at).format('HH:mm')}
                          </div>
                          <div className="text-blue-700 dark:text-blue-300 truncate">
                            {shift.user_name} • {shift.store_name}
                          </div>
                        </div>
                      ))}
                      {dayShifts.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          +{dayShifts.length - 3} altri turni
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // Render month view
  const renderMonthView = () => {
    const days = getDaysInMonth();
    const weeks = [];
    
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {currentDate.format('MMMM YYYY')}
          </h2>
        </div>
        
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="space-y-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7 gap-1">
              {week.map((day) => {
                const dayShifts = getShiftsForDay(day);
                const isCurrentMonth = day.isSame(currentDate, 'month');
                const isToday = day.isSame(dayjs(), 'day');
                
                return (
                  <div
                    key={day.format('YYYY-MM-DD')}
                    className={`
                      min-h-[60px] p-1 border border-gray-200 dark:border-gray-700 rounded
                      ${isCurrentMonth ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                      ${isToday ? 'ring-2 ring-blue-500' : ''}
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${isCurrentMonth ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>
                        {day.format('D')}
                      </span>
                      {dayShifts.length > 0 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {dayShifts.length}
                        </Badge>
                      )}
                    </div>
                    
                    {dayShifts.length > 0 && (
                      <div className="space-y-1">
                        {dayShifts.slice(0, 2).map((shift) => (
                          <div
                            key={shift.id}
                            className="text-xs p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            onClick={() => onShiftDetails?.(shift)}
                          >
                            <div className="truncate">
                              {dayjs(shift.start_at).format('HH:mm')}
                            </div>
                            <div className="truncate text-xs">
                              {shift.user_name}
                            </div>
                          </div>
                        ))}
                        {dayShifts.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                            +{dayShifts.length - 2}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="p-2"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="p-2"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="text-xs"
        >
          Oggi
        </Button>
      </div>

      {/* View selector */}
      <div className="flex items-center justify-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {(['month', 'week', 'day'] as const).map((viewType) => (
          <Button
            key={viewType}
            variant={view === viewType ? "default" : "ghost"}
            size="sm"
            onClick={() => setView(viewType)}
            className="text-xs px-3 py-1"
          >
            {viewType === 'month' ? 'Mese' : viewType === 'week' ? 'Settimana' : 'Giorno'}
          </Button>
        ))}
      </div>

      {/* Calendar content */}
      <div className="min-h-[400px]">
        {view === 'day' && renderDayView()}
        {view === 'week' && renderWeekView()}
        {view === 'month' && renderMonthView()}
      </div>

      {/* Add shift button */}
      {canEdit && onShiftCreate && (
        <div className="fixed bottom-4 right-4">
          <Button
            onClick={onShiftCreate}
            className="rounded-full w-12 h-12 shadow-lg"
          >
            +
          </Button>
        </div>
      )}
    </div>
  );
}
