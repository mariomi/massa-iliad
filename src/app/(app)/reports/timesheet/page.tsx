"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useMe } from "@/lib/auth/useMe";
import { demoDataService, PersonalTimesheetStats } from "@/lib/demo-data/demo-service";
import { TimesheetDashboard } from "@/components/timesheet/TimesheetDashboard";
import { redirect } from "next/navigation";

export default function TimesheetPage() {
  const { me } = useMe();
  const [stats, setStats] = useState<PersonalTimesheetStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only allow workforce users to access this page
    if (me && me.role !== "workforce") {
      redirect("/reports/hours");
      return;
    }

    if (me?.id) {
      try {
        // Get stats for current month
        const currentMonth = {
          from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
        };

        const userStats = demoDataService.getPersonalTimesheetStats(me.id, currentMonth);
        setStats(userStats);
      } catch (error) {
        console.error("Error loading timesheet stats:", error);
      } finally {
        setLoading(false);
      }
    }
  }, [me]);

  if (loading) {
    return (
      <>
        <PageHeader
          title="Timesheet Personale"
          desc="Caricamento delle tue statistiche personali..."
        />
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  if (!stats) {
    return (
      <>
        <PageHeader
          title="Timesheet Personale"
          desc="Errore nel caricamento delle statistiche"
        />
        <div className="p-8 text-center text-red-600">
          Impossibile caricare le tue statistiche personali. Riprova più tardi.
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Timesheet Personale"
        desc="Visualizza le tue ore lavorate, straordinari e saldo ferie"
      />

      <TimesheetDashboard stats={stats} />
    </>
  );
}
