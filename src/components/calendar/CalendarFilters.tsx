"use client";
import { useState, useEffect, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, X, Filter, Store, Users, User, Shield } from "lucide-react";
import { CalendarFilters } from "./AdvancedCalendar";
import { demoDataService, DemoStore, DemoTeam, DemoUser } from "@/lib/demo-data/demo-service";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";

interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFiltersChange: (filters: CalendarFilters) => void;
  onClose: () => void;
}

export function CalendarFiltersPanel({ filters, onFiltersChange, onClose }: CalendarFiltersProps) {
  const [localFilters, setLocalFilters] = useState<CalendarFilters>(filters);
  
  // Store selection state
  const [selectedStore, setSelectedStore] = useState<DemoStore | null>(null);
  const [storeSearchValue, setStoreSearchValue] = useState("");
  
  // Team selection state
  const [selectedTeam, setSelectedTeam] = useState<DemoTeam | null>(null);
  
  // Person selection state
  const [selectedPerson, setSelectedPerson] = useState<DemoUser | null>(null);
  const [personSearchValue, setPersonSearchValue] = useState("");
  
  // Role selection state
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Get data from demo service
  const stores = demoDataService.getStores();
  const allTeams = demoDataService.getTeams();
  const allPersons = demoDataService.getUsers();

  // Sync local filters with props when they change
  useEffect(() => {
    setLocalFilters(filters);
    
    // Sync local selection states with filters
    if (filters.store) {
      const store = stores.find(s => s.id === filters.store);
      setSelectedStore(store || null);
      setStoreSearchValue(store?.name || "");
    } else {
      setSelectedStore(null);
      setStoreSearchValue("");
    }
    
    if (filters.team) {
      const team = allTeams.find(t => t.id === filters.team);
      setSelectedTeam(team || null);
    } else {
      setSelectedTeam(null);
    }
    
    if (filters.person) {
      const person = allPersons.find(p => p.id === filters.person);
      setSelectedPerson(person || null);
      setPersonSearchValue(person?.name || "");
    } else {
      setSelectedPerson(null);
      setPersonSearchValue("");
    }
    
    setSelectedRole(filters.role);
  }, [filters, stores, allTeams, allPersons]);

  // Convert stores to autocomplete options
  const storeOptions = useMemo(() => 
    stores.map(store => ({
      id: store.id,
      label: store.name,
      subtitle: `${store.address} - ${store.manager}`
    })), [stores]
  );

  // Get teams filtered by selected store
  const availableTeams = useMemo(() => {
    if (!selectedStore) return [];
    return demoDataService.getTeamsByStore(selectedStore.id);
  }, [selectedStore]);

  // Convert persons to autocomplete options (filtered by selected store if any)
  const personOptions = useMemo(() => {
    let filteredPersons = allPersons;
    
    // If a store is selected, filter persons to only show those assigned to that store
    if (selectedStore) {
      filteredPersons = allPersons.filter(person => person.store_id === selectedStore.id);
    }
    
    return filteredPersons.map(person => ({
      id: person.id,
      label: person.name,
      subtitle: `${person.role} - ${person.store_id ? demoDataService.getStoreById(person.store_id)?.name || 'Nessun negozio' : 'Forza Lavoro'}`
    }));
  }, [allPersons, selectedStore]);

  // Get roles filtered by selected store or team
  const availableRoles = useMemo(() => {
    if (selectedStore) {
      return demoDataService.getRolesByStore(selectedStore.id);
    }
    if (selectedTeam) {
      return demoDataService.getRolesByTeam(selectedTeam.id);
    }
    return [];
  }, [selectedStore, selectedTeam]);

  // Role options with labels
  const roleOptions = useMemo(() => {
    const roleLabels: Record<string, string> = {
      'manager': 'Manager',
      'staff': 'Staff',
      'viewer': 'Viewer',
      'workforce': 'Forza Lavoro',
      'dipendente': 'Dipendente',
      'agente': 'Agente',
      'admin': 'Admin'
    };
    
    return availableRoles.map(role => ({
      id: role,
      label: roleLabels[role] || role,
      value: role
    }));
  }, [availableRoles]);

  // Validation: Check if filters can be applied
  const canApplyFilters = useMemo(() => {
    // Store selection is required for team and role selection
    if (selectedTeam && !selectedStore) return false;
    if (selectedRole && !selectedStore && !selectedTeam) return false;
    
    // At least one filter must be selected to apply
    const hasAnyFilter = selectedStore || selectedTeam || selectedPerson || selectedRole;
    
    return hasAnyFilter;
  }, [selectedStore, selectedTeam, selectedPerson, selectedRole]);

  // Handle store selection
  const handleStoreSelect = (option: { id: string; label: string; subtitle?: string } | null) => {
    if (option) {
      const store = demoDataService.getStoreById(option.id);
      setSelectedStore(store || null);
      setLocalFilters(prev => ({ ...prev, store: option.id, team: null, role: null, person: null }));
      
      // Clear dependent selections
      setSelectedTeam(null);
      setSelectedRole(null);
      setSelectedPerson(null);
      setPersonSearchValue("");
    } else {
      setSelectedStore(null);
      setLocalFilters(prev => ({ ...prev, store: null, team: null, role: null, person: null }));
      
      // Clear dependent selections
      setSelectedTeam(null);
      setSelectedRole(null);
      setSelectedPerson(null);
      setPersonSearchValue("");
    }
  };

  // Handle team selection
  const handleTeamSelect = (teamId: string) => {
    const team = demoDataService.getTeamById(teamId);
    setSelectedTeam(team || null);
    setLocalFilters(prev => ({ ...prev, team: teamId }));
    
    // Clear dependent selections
    setSelectedRole(null);
    setLocalFilters(prev => ({ ...prev, role: null }));
  };

  // Handle person selection
  const handlePersonSelect = (option: { id: string; label: string; subtitle?: string } | null) => {
    if (option) {
      const person = demoDataService.getUserById(option.id);
      setSelectedPerson(person || null);
      setLocalFilters(prev => ({ ...prev, person: option.id }));
    } else {
      setSelectedPerson(null);
      setLocalFilters(prev => ({ ...prev, person: null }));
    }
  };

  // Handle role selection
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setLocalFilters(prev => ({ ...prev, role: roleId }));
  };

  // Handle period change
  const handlePeriodChange = (field: 'from' | 'to', value: string) => {
    setLocalFilters(prev => ({
      ...prev,
      period: {
        ...prev.period,
        [field]: new Date(value)
      }
    }));
  };

  // Auto-apply filters when they change (real-time updates)
  useEffect(() => {
    if (canApplyFilters) {
      onFiltersChange(localFilters);
    }
  }, [localFilters, canApplyFilters, onFiltersChange]);

  // Handle apply filters
  const handleApply = () => {
    if (canApplyFilters) {
      onFiltersChange(localFilters);
      onClose();
    }
  };

  // Handle reset
  const handleReset = () => {
    const resetFilters: CalendarFilters = {
      store: null,
      team: null,
      person: null,
      role: null,
      period: {
        from: new Date(),
        to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days
      }
    };
    setLocalFilters(resetFilters);
    setSelectedStore(null);
    setSelectedTeam(null);
    setSelectedPerson(null);
    setSelectedRole(null);
    setStoreSearchValue("");
    setPersonSearchValue("");
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

            {/* Store Filter - Autocomplete */}
            <div>
              <Label className="text-lg font-medium mb-4 block flex items-center gap-2">
                <Store className="h-5 w-5" />
                Negozio
              </Label>
              <AutocompleteInput
                value={storeSearchValue}
                onChange={setStoreSearchValue}
                onSelect={handleStoreSelect}
                options={storeOptions}
                placeholder="Cerca negozio..."
                disabled={false}
              />
              {selectedStore && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    {selectedStore.name}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    {selectedStore.address} - Manager: {selectedStore.manager}
                  </div>
                </div>
              )}
            </div>

            {/* Team Filter - Dropdown */}
            <div>
              <Label className="text-lg font-medium mb-4 block flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team
              </Label>
              <select
                value={selectedTeam?.id || ""}
                onChange={(e) => handleTeamSelect(e.target.value)}
                disabled={!selectedStore}
                className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedStore ? "Seleziona team..." : "Seleziona prima un negozio"}
                </option>
                {availableTeams.map(team => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              {selectedTeam && (
                <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-sm font-medium text-green-900 dark:text-green-100">
                    {selectedTeam.name}
                  </div>
                  <div className="text-xs text-green-700 dark:text-green-300">
                    {selectedTeam.description}
                  </div>
                </div>
              )}
            </div>

            {/* Person Filter - Autocomplete */}
            <div>
              <Label className="text-lg font-medium mb-4 block flex items-center gap-2">
                <User className="h-5 w-5" />
                Persona
              </Label>
              {selectedStore && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Filtro attivo:</strong> Mostrando solo persone assegnate a {selectedStore.name}
                  </div>
                </div>
              )}
              <AutocompleteInput
                value={personSearchValue}
                onChange={setPersonSearchValue}
                onSelect={handlePersonSelect}
                options={personOptions}
                placeholder={selectedStore ? `Cerca persona in ${selectedStore.name}...` : "Cerca persona..."}
                disabled={false}
              />
              {selectedPerson && (
                <div className="mt-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-sm font-medium text-purple-900 dark:text-purple-100">
                    {selectedPerson.name}
                  </div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">
                    {selectedPerson.role} - {selectedPerson.store_id ? demoDataService.getStoreById(selectedPerson.store_id)?.name || 'Nessun negozio' : 'Forza Lavoro'}
                  </div>
                </div>
              )}
            </div>

            {/* Role Filter - Dropdown */}
            <div>
              <Label className="text-lg font-medium mb-4 block flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ruolo
              </Label>
              <select
                value={selectedRole || ""}
                onChange={(e) => handleRoleSelect(e.target.value)}
                disabled={!selectedStore && !selectedTeam}
                className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedStore || selectedTeam ? "Seleziona ruolo..." : "Seleziona prima un negozio o team"}
                </option>
                {roleOptions.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
              {selectedRole && (
                <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-sm font-medium text-orange-900 dark:text-orange-100">
                    {roleOptions.find(r => r.id === selectedRole)?.label}
                  </div>
                </div>
              )}
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
              <Button 
                onClick={handleApply} 
                size="lg" 
                className="text-lg px-6 py-3"
                disabled={!canApplyFilters}
              >
                Applica Filtri
              </Button>
            </div>
          </div>

          {/* Validation Message */}
          {!canApplyFilters && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="text-sm text-red-800 dark:text-red-200">
                <strong>Attenzione:</strong> Per selezionare un team, devi prima selezionare un negozio. 
                Per selezionare un ruolo, devi prima selezionare un negozio o un team.
                {selectedStore && (
                  <div className="mt-2 text-xs">
                    <strong>Nota:</strong> Le persone sono filtrate per il negozio selezionato.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}