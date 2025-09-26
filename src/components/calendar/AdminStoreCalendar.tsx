'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as BigCalendar, View, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'moment/locale/it';
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Store, Users, X } from "lucide-react";
import { demoDataService, DemoStore, DemoUser, DemoShiftWithDetails } from "@/lib/demo-data/demo-service";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configure moment for Italian locale
moment.locale('it');
moment.tz.setDefault('Europe/Rome');
const localizer = momentLocalizer(moment);

interface StoreEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: {
    storeId: string;
    storeName: string;
    openTime: string;
    closeTime: string;
  };
}

interface AdminStoreCalendarProps {
  onShowFilters?: () => void;
  refreshTrigger?: number;
}

interface SelectedStoreData {
  store: DemoStore;
  date: Date;
  timeline: Array<{
    user: DemoUser;
    shift: DemoShiftWithDetails;
    startTime: string;
    endTime: string;
    duration: string;
  }>;
}

export function AdminStoreCalendar({ onShowFilters, refreshTrigger }: AdminStoreCalendarProps) {
  const [events, setEvents] = useState<StoreEvent[]>([]);
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [selectedStore, setSelectedStore] = useState<SelectedStoreData | null>(null);

  // Force month view on mount
  useEffect(() => {
    setView("month");
  }, []);

  // Load store events based on current date and view
  useEffect(() => {
    const loadStoreEvents = async () => {
      setLoading(true);
      try {
        // Calculate visible date range based on current view
        const viewStart = new Date(date);
        const viewEnd = new Date(date);

        if (view === "month") {
          // For month view, show the entire month
          viewStart.setDate(1);
          viewEnd.setMonth(viewEnd.getMonth() + 1);
          viewEnd.setDate(0);
        } else if (view === "week") {
          // For week view, show current week
          const startOfWeek = viewStart.getDate() - viewStart.getDay();
          viewStart.setDate(startOfWeek);
          viewEnd.setDate(startOfWeek + 6);
        } else if (view === "day") {
          // For day view, show only current day
          viewEnd.setDate(viewEnd.getDate());
        }

        const calendarEvents: StoreEvent[] = [];
        
        // Generate events for each day in the visible range
        const currentDate = new Date(viewStart);
        while (currentDate <= viewEnd) {
          const openStores = demoDataService.getStoresOpenOnDate(currentDate);
          
          openStores.forEach(({ store, openTime, closeTime }) => {
            const [openHour, openMinute] = openTime.split(':').map(Number);
            const [closeHour, closeMinute] = closeTime.split(':').map(Number);
            
            const eventStart = new Date(currentDate);
            eventStart.setHours(openHour, openMinute, 0, 0);
            
            const eventEnd = new Date(currentDate);
            eventEnd.setHours(closeHour, closeMinute, 0, 0);
            
            calendarEvents.push({
              id: `${store.id}-${currentDate.toISOString().split('T')[0]}`,
              title: `${store.name} (${openTime} - ${closeTime})`,
              start: eventStart,
              end: eventEnd,
              resource: {
                storeId: store.id,
                storeName: store.name,
                openTime,
                closeTime
              }
            });
          });
          
          currentDate.setDate(currentDate.getDate() + 1);
        }

        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error loading store events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadStoreEvents();
  }, [refreshTrigger, date, view]);

  const handleSelectEvent = (event: StoreEvent) => {
    const store = demoDataService.getStoreById(event.resource.storeId);
    if (store) {
      const timeline = demoDataService.getStoreShiftsTimeline(event.resource.storeId, event.start);
      setSelectedStore({
        store,
        date: event.start,
        timeline
      });
    }
  };

  const eventStyleGetter = (event: StoreEvent) => {
    return {
      style: {
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        color: 'white',
        border: '1px solid',
        borderRadius: '4px',
        padding: '2px 4px'
      }
    };
  };

  // Calculate total open stores for the current view
  const totalOpenStores = useMemo(() => {
    const storeIds = new Set();
    events.forEach(event => {
      storeIds.add(event.resource.storeId);
    });
    return storeIds.size;
  }, [events]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold">Calendario Negozi</h2>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          {onShowFilters && (
            <Button 
              onClick={onShowFilters}
              variant="outline"
              size="sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Filtri
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Negozi Aperti</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalOpenStores}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Eventi Totali</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{events.length}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Vista Corrente</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 capitalize">{view}</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border">
        <div className="p-4">
          <BigCalendar
            culture="it"
            localizer={localizer}
            events={events}
            date={date}
            view={view}
            onView={(newView) => {
              if (newView === "month" || newView === "week" || newView === "day") {
                setView(newView);
              }
            }}
            onNavigate={setDate}
            selectable={false}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={eventStyleGetter}
            views={["month", "week", "day"]}
            defaultView="month"
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            style={{ height: 600 }}
            messages={{
              next: "Successivo",
              previous: "Precedente", 
              today: "Oggi",
              month: "Mese",
              week: "Settimana",
              day: "Giorno",
              agenda: "Agenda",
              date: "Data",
              time: "Ora",
              event: "Evento",
              showMore: total => `+ Altri ${total}`,
              allDay: "Tutto il giorno",
              tomorrow: "Domani",
              yesterday: "Ieri"
            }}
            formats={{
              monthHeaderFormat: "MMMM YYYY",
              dayHeaderFormat: "dddd DD MMMM",
              dayRangeHeaderFormat: ({ start, end }) => 
                `${moment(start).format("DD MMMM")} - ${moment(end).format("DD MMMM YYYY")}`,
              timeGutterFormat: "HH:mm",
              eventTimeRangeFormat: ({ start, end }) => 
                `${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`
            }}
            components={{
              event: ({ event }) => (
                <div className="flex items-center space-x-1 text-xs">
                  <Store className="h-3 w-3" />
                  <span className="truncate">{event.resource.storeName}</span>
                  <span className="text-xs opacity-75">
                    {event.resource.openTime} - {event.resource.closeTime}
                  </span>
                </div>
              ),
              month: {
                event: ({ event }) => (
                  <div className="text-xs truncate">
                    <Store className="h-3 w-3 inline mr-1" />
                    {event.resource.storeName}
                  </div>
                )
              },
              week: {
                event: ({ event }) => (
                  <div className="text-xs">
                    <Store className="h-3 w-3 inline mr-1" />
                    {event.resource.storeName}
                  </div>
                )
              },
              day: {
                event: ({ event }) => (
                  <div className="text-xs">
                    <Store className="h-3 w-3 inline mr-1" />
                    {event.resource.storeName}
                  </div>
                )
              }
            }}
          />
        </div>
      </div>

      {/* Simple Store Info Display */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Informazioni Negozi
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <p>Il calendario mostra i negozi aperti per ogni giorno.</p>
          <p>Ogni evento rappresenta un negozio con i suoi orari di apertura e chiusura.</p>
          <p>Vista corrente: <strong className="capitalize">{view}</strong></p>
          <p>Negozi aperti: <strong>{totalOpenStores}</strong></p>
          <p>Eventi totali: <strong>{events.length}</strong></p>
        </div>
      </div>

      {/* Store Detail Modal */}
      {selectedStore && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Store className="h-5 w-5 text-blue-600" />
                  <h2 className="text-xl font-semibold">{selectedStore.store.name}</h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedStore(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                {moment(selectedStore.date).format('dddd, DD MMMM YYYY')}
              </div>
              
              <div className="space-y-4">
                {/* Store Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Indirizzo:</strong> {selectedStore.store.address}
                  </div>
                  <div>
                    <strong>Telefono:</strong> {selectedStore.store.phone}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedStore.store.email}
                  </div>
                  <div>
                    <strong>Manager:</strong> {selectedStore.store.manager}
                  </div>
                </div>

                {/* Staff Timeline */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Timeline Personale
                  </h4>
                  
                  {selectedStore.timeline.length > 0 ? (
                    <div className="space-y-2">
                      {selectedStore.timeline.map((item, index) => (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <Users className="h-4 w-4 text-blue-600" />
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">{item.user.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                                {item.user.role}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="font-medium">
                              {item.startTime} - {item.endTime}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                              {item.duration}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Nessun turno assegnato per questa data</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
