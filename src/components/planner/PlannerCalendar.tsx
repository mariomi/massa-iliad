"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Calendar, dateFnsLocalizer, View, SlotInfo } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import it from "date-fns/locale/it";
import "react-big-calendar/lib/css/react-big-calendar.css";
const localizer = dateFnsLocalizer({ format, parse, startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), getDay, locales: { it } });
export function PlannerCalendar({ storeId, canEdit = false }: { storeId: string; canEdit?: boolean; }) {
  const [events, setEvents] = useState<any[]>([]);
  const [view, setView] = useState<View>("week");
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const from = new Date(date); from.setDate(from.getDate() - 14);
    const to = new Date(date); to.setDate(to.getDate() + 21);
    supabase.from("shifts").select("id,start_at,end_at,published,note")
      .eq("store_id", storeId).gte("start_at", from.toISOString()).lte("end_at", to.toISOString()).order("start_at")
      .then(({ data }) => setEvents((data||[]).map(s => ({ id: s.id, title: s.published ? "Turno" : "Bozza", start: new Date(s.start_at), end: new Date(s.end_at), allDay: false }))));
  }, [storeId, date, view]);
  const onSelectSlot = async (slot: SlotInfo) => {
    if (!canEdit) return;
    const { data, error } = await supabase.from("shifts").insert({ store_id: storeId, start_at: slot.start, end_at: slot.end, note: "", published: false }).select("id");
    if (!error && data) setEvents(ev => [...ev, { id: data[0].id, title: "Bozza", start: slot.start, end: slot.end }]);
  };
  return (
    <Calendar culture="it" localizer={localizer} events={events} date={date} view={view} onView={setView} onNavigate={setDate} selectable={canEdit} onSelectSlot={onSelectSlot} defaultView="week" style={{ height: "75vh" }} />
  );
}
