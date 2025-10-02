"use client";
import { useEffect, useMemo, useState } from "react";
import { KpiCard } from "@/components/ui/KpiCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnimatedList, AnimatedItem } from "@/components/ui/AnimatedList";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useStoreSelector } from "@/lib/store/StoreContext";
import { useMe } from "@/lib/auth/useMe";
import { demoDataService } from "@/lib/demo-data/demo-service";

export default function Dashboard() {
  const { me } = useMe();
  const { selected } = useStoreSelector();

  const [refreshTick, setRefreshTick] = useState(0);
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);

  // Realtime updates (shared with rest of app)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'iliad_demo_last_update') setRefreshTick(t => t + 1);
    };
    const onCustom = () => setRefreshTick(t => t + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('iliad-demo:update', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('iliad-demo:update', onCustom as EventListener);
    };
  }, []);

  // Load lists
  useEffect(() => {
    const now = new Date();
    const allShifts = demoDataService.getShifts();
    const allSales = demoDataService.getAllSales();

    if (me?.role === 'admin') {
      const storeFilter = selected?.id;
      const shifts = allShifts
        .filter(s => (!storeFilter || s.store_id === storeFilter))
        .filter(s => new Date(s.end_at) >= now)
        .sort((a,b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
        .slice(0, 8);
      setUpcomingShifts(shifts);

      const sales = allSales
        .filter(s => (!storeFilter || s.store_id === storeFilter))
        .slice(0, 10);
      setRecentSales(sales);
    } else if (me) {
      const shifts = allShifts
        .filter(s => s.user_id === me.id)
        .filter(s => new Date(s.end_at) >= now)
        .sort((a,b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
        .slice(0, 8);
      setUpcomingShifts(shifts);

      const sales = allSales
        .filter(s => s.user_id === me.id)
        .slice(0, 10);
      setRecentSales(sales);
    }
  }, [me, selected?.id, refreshTick]);

  // KPIs
  const kpis = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = (() => { const d = new Date(now); const day = d.getDay(); const mondayOffset = day === 0 ? -6 : 1 - day; d.setDate(d.getDate() + mondayOffset); d.setHours(0,0,0,0); return d; })();
    const endOfWeek = (() => { const d = new Date(startOfWeek); d.setDate(d.getDate() + 6); d.setHours(23,59,59,999); return d; })();

    const allShifts = demoDataService.getShifts();
    const allSales = demoDataService.getAllSales();
    const allStores = demoDataService.getAllStores();

    if (me?.role === 'admin') {
      const storeFilter = selected?.id;
      const weekShifts = allShifts.filter(s => (!storeFilter || s.store_id === storeFilter) && new Date(s.start_at) <= endOfWeek && new Date(s.end_at) >= startOfWeek);
      const totalWeekHours = weekShifts.reduce((sum, s) => sum + ((new Date(s.end_at).getTime() - new Date(s.start_at).getTime()) / 36e5), 0);
      const openToday = allStores.filter(st => demoDataService.getStoreOpeningHours(st.id, now).open);
      const salesToday = allSales.filter(s => new Date(s.sale_date) >= startOfDay && (!storeFilter || s.store_id === storeFilter));

      return {
        cards: [
          { title: 'Turni (settimana)', value: String(weekShifts.length) },
          { title: 'Ore pianificate (settimana)', value: `${totalWeekHours.toFixed(1)}h` },
          { title: 'Negozi aperti oggi', value: String(openToday.length) },
          { title: 'Vendite oggi', value: String(salesToday.length) }
        ]
      };
    }

    // Workforce / dipendente
    const myShiftsWeek = allShifts.filter(s => s.user_id === me?.id && new Date(s.start_at) <= endOfWeek && new Date(s.end_at) >= startOfWeek);
    const myHoursWeek = myShiftsWeek.reduce((sum, s) => sum + ((new Date(s.end_at).getTime() - new Date(s.start_at).getTime()) / 36e5), 0);
    const mySalesToday = allSales.filter(s => s.user_id === me?.id && new Date(s.sale_date) >= startOfDay);

    return {
      cards: [
        { title: 'I miei turni (settimana)', value: String(myShiftsWeek.length) },
        { title: 'Ore settimana', value: `${myHoursWeek.toFixed(1)}h` },
        { title: 'Vendite oggi', value: String(mySalesToday.length) },
        { title: 'Prossimi turni', value: String(upcomingShifts.length) }
      ]
    };
  }, [me, selected?.id, upcomingShifts.length, refreshTick]);

  const headerRight = selected ? (
    <div className="flex flex-wrap gap-1 md:gap-2">
      <Link href={`/stores/${selected.id}/planner`} className="px-2 py-1 md:px-3 md:py-2 border rounded-lg hover:bg-neutral-50 text-xs md:text-sm">Planner</Link>
      <Link href={`/stores/${selected.id}/sales`} className="px-2 py-1 md:px-3 md:py-2 border rounded-lg hover:bg-neutral-50 text-xs md:text-sm">Vendite</Link>
      <Link href={`/stores/${selected.id}/time`} className="px-2 py-1 md:px-3 md:py-2 border rounded-lg hover:bg-neutral-50 text-xs md:text-sm">Presenze</Link>
    </div>
  ) : undefined;

  return (
    <>
      <PageHeader title="Dashboard" desc={me?.role === 'admin' ? 'Panoramica organizzativa' : 'Panoramica personale'} right={headerRight} />
      <div className="grid gap-3 md:gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.cards.map((c, i) => (
          <KpiCard key={i} title={c.title} value={c.value} />
        ))}
      </div>

      <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2 mt-4 md:mt-6">
        <Card className="p-3 md:p-4">
          <h3 className="font-semibold mb-2 text-sm md:text-base">{me?.role === 'admin' ? 'Prossimi turni (tutti)' : 'I miei prossimi turni'}</h3>
          <AnimatedList>
            {upcomingShifts.map(s => (
              <AnimatedItem key={s.id}>
                <div className="text-xs md:text-sm p-2 md:p-3 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                  <span className="truncate">{new Date(s.start_at).toLocaleString()} → {new Date(s.end_at).toLocaleString()}</span>
                  <span className="text-xs opacity-70">{s.store_id}</span>
                </div>
              </AnimatedItem>
            ))}
            {upcomingShifts.length === 0 && <div className="text-xs md:text-sm text-neutral-500">Nessun turno</div>}
          </AnimatedList>
        </Card>

        <Card className="p-3 md:p-4">
          <h3 className="font-semibold mb-2 text-sm md:text-base">{me?.role === 'admin' ? 'Ultime vendite' : 'Le mie ultime vendite'}</h3>
          <AnimatedList>
            {recentSales.map(v => (
              <AnimatedItem key={v.id}>
                <div className="text-xs md:text-sm p-2 md:p-3 rounded-lg border flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-0">
                  <span>{new Date(v.sale_date).toLocaleString()}</span>
                  <span className="text-xs opacity-70">{v.store_id}</span>
                </div>
              </AnimatedItem>
            ))}
            {recentSales.length === 0 && <div className="text-xs md:text-sm text-neutral-500">Nessuna vendita</div>}
          </AnimatedList>
        </Card>
      </div>
    </>
  );
}
