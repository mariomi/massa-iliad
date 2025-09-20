"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, X, Filter } from "lucide-react";
import { CalendarFilters } from "./AdvancedCalendar";
import { demoDataService } from "@/lib/demo-data/demo-service";

interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  onClose: () => void;
}

export function CalendarFiltersPanel({ filters, onFiltersChange, onClose }: CalendarFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CalendarFilters>(filters);

  // Get data from demo service
  const stores = demoDataService.getStores();
  const teams = demoDataService.getTeams();
  const persons = demoDataService.getUsers();
  const roles = [
    { id: "manager", name: "Manager" },
    { id: "staff", name: "Staff" },
    { id: "viewer", name: "Viewer" },
    { id: "workforce", name: "Forza Lavoro" }
  ];

  const handleStoreToggle = (storeId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      stores: prev.stores.includes(storeId)
        ? prev.stores.filter(id => id !== storeId)
        : [...prev.stores, storeId]
    }));
  };

  const handleTeamToggle = (teamId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams.filter(id => id !== teamId)
        : [...prev.teams, teamId]
    }));
  };

  const handlePersonToggle = (personId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      persons: prev.persons.includes(personId)
        ? prev.persons.filter(id => id !== personId)
        : [...prev.persons, personId]
    }));
  };

  const handleRoleToggle = (roleId: string) => {
    setLocalFilters(prev => ({
      ...prev,
      roles: prev.roles.includes(roleId)
        ? prev.roles.filter(id => id !== roleId)
        : [...prev.roles, roleId]
    }));
  };

  const handlePeriodChange = (field: 'from' | 'to', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      period: {
        ...prev.period,
        [field]: new Date(value)
      }
    }));
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: CalendarFilters = {
      stores: [],
      teams: [],
      persons: [],
      roles: [],
      period: {
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
      }
    };
    setLocalFilters(resetFilters);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Filter size={28} />
              <h2 className="text-2xl font-semibold">Filtri Calendario</h2>
            </div>
            <Button variant="ghost" size="lg" onClick={onClose} className="text-lg">
              <X size={24} />
            </Button>
          </div>

          <div className="space-y-6">
            {/* Period Filter */}
            <div>
              <Label className="text-lg font-medium mb-4 block">Periodo</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-neutral-600">Da</Label>
                  <Input
                    type="datetime-local"
                    value={formatDate(localFilters.period.from)}
                    onChange={(e) => handlePeriodChange('from', e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
                <div>
                  <Label className="text-sm text-neutral-600">A</Label>
                  <Input
                    type="datetime-local"
                    value={formatDate(localFilters.period.to)}
                    onChange={(e) => handlePeriodChange('to', e.target.value)}
                    className="h-12 text-lg"
                  />
                </div>
              </div>
            </div>

            {/* Stores Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Negozi</Label>
              <div className="space-y-2">
                {stores.map(store => (
                  <label key={store.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.stores.includes(store.id)}
                      onChange={() => handleStoreToggle(store.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{store.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Teams Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Team</Label>
              <div className="space-y-2">
                {teams.map(team => (
                  <label key={team.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.teams.includes(team.id)}
                      onChange={() => handleTeamToggle(team.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{team.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Persons Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Persone</Label>
              <div className="space-y-2">
                {persons.map(person => (
                  <label key={person.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.persons.includes(person.id)}
                      onChange={() => handlePersonToggle(person.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{person.name}</span>
                    <span className="text-xs text-neutral-500">({person.role === 'workforce' ? 'Forza Lavoro' : person.role})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Roles Filter */}
            <div>
              <Label className="text-sm font-medium mb-3 block">Ruoli</Label>
              <div className="space-y-2">
                {roles.map(role => (
                  <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localFilters.roles.includes(role.id)}
                      onChange={() => handleRoleToggle(role.id)}
                      className="rounded border-neutral-300"
                    />
                    <span className="text-sm">{role.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose} size="lg" className="text-lg px-6 py-3">
                Annulla
              </Button>
              <Button onClick={handleApply} size="lg" className="text-lg px-6 py-3">
                Applica Filtri
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
