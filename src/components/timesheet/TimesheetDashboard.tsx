"use client";

import { useState } from "react";
import { PersonalTimesheetStats } from "@/lib/demo-data/demo-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, Clock, TrendingUp, Calendar, Users, FileText } from "lucide-react";

interface TimesheetDashboardProps {
  stats: PersonalTimesheetStats;
}

export function TimesheetDashboard({ stats }: TimesheetDashboardProps) {
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      // Import the service dynamically to avoid issues
      const { demoDataService } = await import("@/lib/demo-data/demo-service");

      const csvData = demoDataService.exportPersonalTimesheetToCSV(stats.user.id, {
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
      });

      // Create and download CSV file
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `timesheet-${stats.user.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting CSV:", error);
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleExportCSV}
          disabled={exporting}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Esportazione..." : "Esporta CSV"}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore Totali</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {stats.shiftsCount} turni questo mese
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore Settimanali</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyHours}h</div>
            <p className="text-xs text-muted-foreground">
              Da lunedì a oggi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ore Rimanenti</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.weeklyHoursRemaining}h</div>
            <p className="text-xs text-muted-foreground">
              Turni futuri questa settimana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turni</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.shiftsCount}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedShiftsCount} pubblicati, {stats.draftShiftsCount} bozze
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leave Balance Section */}
      {stats.leaveBalance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Saldo Ferie e Permessi
            </CardTitle>
            <CardDescription>
              Il tuo saldo attuale di ferie e permessi malattia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Ferie Annuali</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Totale assegnate:</span>
                    <span className="font-medium">{stats.leaveBalance.annual_leave_days} giorni</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Usate:</span>
                    <span className="font-medium text-red-600">{stats.leaveBalance.used_leave_days} giorni</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rimanenti:</span>
                    <span className="font-medium text-green-600">{stats.leaveBalance.remaining_leave_days} giorni</span>
                  </div>
                  {stats.leaveBalance.carry_over_days > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Da anni precedenti:</span>
                      <span className="font-medium text-blue-600">{stats.leaveBalance.carry_over_days} giorni</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Permessi Malattia</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Totale assegnati:</span>
                    <span className="font-medium">{stats.leaveBalance.sick_leave_days} giorni</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Usati:</span>
                    <span className="font-medium text-red-600">{stats.leaveBalance.used_sick_days} giorni</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Disponibili:</span>
                    <span className="font-medium text-green-600">
                      {stats.leaveBalance.sick_leave_days - stats.leaveBalance.used_sick_days} giorni
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Shifts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Turni Recenti
          </CardTitle>
          <CardDescription>
            I tuoi ultimi 10 turni lavorativi
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentShifts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nessun turno trovato per questo periodo.
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentShifts.map((shift, index) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="font-medium">
                        {formatDate(shift.start_at)}
                      </div>
                      <Badge variant={shift.published ? "default" : "secondary"}>
                        {shift.published ? "Pubblicato" : "Bozza"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {formatTime(shift.start_at)} - {formatTime(shift.end_at)} • {shift.hours}h
                    </div>
                    <div className="text-sm text-muted-foreground">
                      📍 {shift.store.name}
                    </div>
                    {shift.note && (
                      <div className="text-sm text-muted-foreground mt-1">
                        📝 {shift.note}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">
                      {shift.hours}h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
