"use client";
import { useEffect, useState, useMemo } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AutocompleteInput } from "@/components/ui/AutocompleteInput";
import { demoDataService, DemoUser } from "@/lib/demo-data/demo-service";
import { User, MapPin, Trash2, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<string[]>([]);
  const [regionsWithManagers, setRegionsWithManagers] = useState<Array<{ region: string; manager: DemoUser | null }>>([]);
  const [name, setName] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const [selectedManager, setSelectedManager] = useState<DemoUser | null>(null);
  const [targetRegionId, setTargetRegionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const load = () => {
    const regionList = demoDataService.getRegions();
    setRegions(regionList);
    const regionsWithManagersData = demoDataService.getRegionsWithManagers();
    setRegionsWithManagers(regionsWithManagersData);
  };
  
  useEffect(() => { load(); }, []);

  // Autocomplete options for managers
  const managerOptions = useMemo(() => {
    const managers = demoDataService.searchManagers(managerSearch);
    return managers.map(manager => ({
      id: manager.id,
      label: manager.name,
      subtitle: manager.email
    }));
  }, [managerSearch]);

  // Filter available regions (exclude regions that already have managers)
  const availableRegions = useMemo(() => {
    return regions.filter(region => {
      const regionWithManager = regionsWithManagers.find(r => r.region === region);
      return !regionWithManager?.manager;
    });
  }, [regions, regionsWithManagers]);

  // Filter available managers (exclude managers already assigned to regions)
  const availableManagers = useMemo(() => {
    const assignedManagerIds = regionsWithManagers
      .filter(r => r.manager)
      .map(r => r.manager!.id);
    
    return managerOptions.filter(option => 
      !assignedManagerIds.includes(option.id)
    );
  }, [managerOptions, regionsWithManagers]);

  const onCreateRegion = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const success = demoDataService.addRegion(name);
      if (success) {
        setSuccessMessage(`Regione "${name}" creata con successo!`);
        setName(""); 
        load();
      } else {
        setErrorMessage("Regione già esistente!");
      }
    } catch (err: any) { 
      setErrorMessage(err?.message ?? String(err)); 
    } finally { 
      setLoading(false); 
    }
  };

  const onAssignManager = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      if (!selectedManager) {
        setErrorMessage("Seleziona un manager");
        setLoading(false);
        return;
      }
      
      if (!targetRegionId) {
        setErrorMessage("Seleziona una regione");
        setLoading(false);
        return;
      }

      const success = demoDataService.assignManagerToRegion(targetRegionId, selectedManager.id);
      if (success) {
        setSuccessMessage(`Manager "${selectedManager.name}" assegnato alla regione "${targetRegionId}" con successo!`);
        setManagerSearch("");
        setSelectedManager(null);
        setTargetRegionId("");
        load();
      } else {
        setErrorMessage("Errore durante l'assegnazione del manager");
      }
    } catch (err: any) { 
      setErrorMessage(err?.message ?? String(err)); 
    } finally { 
      setLoading(false); 
    }
  };

  const onRemoveManager = async (regionName: string, managerName: string) => {
    if (!confirm(`Sei sicuro di voler rimuovere il manager "${managerName}" dalla regione "${regionName}"?`)) {
      return;
    }
    
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    
    try {
      const success = demoDataService.removeManagerFromRegion(regionName);
      if (success) {
        setSuccessMessage(`Manager rimosso dalla regione "${regionName}" con successo!`);
        load();
      } else {
        setErrorMessage("Errore durante la rimozione del manager");
      }
    } catch (err: any) { 
      setErrorMessage(err?.message ?? String(err)); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleManagerSelect = (option: { id: string; label: string; subtitle?: string } | null) => {
    if (option) {
      const manager = demoDataService.getUserById(option.id);
      setSelectedManager(manager || null);
    } else {
      setSelectedManager(null);
    }
  };

  return (
    <>
      <PageHeader title="Admin: Regioni" desc="Crea regioni e assegna manager" />
      
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <CheckCircle size={16} />
            <span className="font-medium">{successMessage}</span>
          </div>
        </div>
      )}
      
      {errorMessage && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <AlertCircle size={16} />
            <span className="font-medium">{errorMessage}</span>
          </div>
        </div>
      )}
      
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="font-medium mb-2">Regioni e Manager</div>
          <div className="divide-y">
            {regionsWithManagers.map(({ region, manager }) => (
              <div key={region} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <div className="font-medium">{region}</div>
                    {manager ? (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{manager.name}</span>
                        <span className="text-xs">({manager.email})</span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 dark:text-gray-400">Nessun manager assegnato</div>
                    )}
                  </div>
                </div>
                {manager && (
                  <Button
                    variant="outline"
                    onClick={() => onRemoveManager(region, manager.name)}
                    disabled={loading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 px-2 py-1 text-sm"
                  >
                    <Trash2 size={14} />
                  </Button>
                )}
              </div>
            ))}
            {regionsWithManagers.length === 0 && <div className="text-sm text-neutral-500">Nessuna regione</div>}
          </div>
        </Card>
        <div className="grid gap-4">
          <Card className="p-4">
            <div className="font-medium mb-2">Nuova regione</div>
            <form onSubmit={onCreateRegion} className="space-y-3">
              <div>
                <label className="text-sm">Nome</label>
                <Input value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>
              <Button type="submit" disabled={loading} className="w-full">Crea</Button>
            </form>
          </Card>
          <Card className="p-4">
            <div className="font-medium mb-2">Assegna manager a regione</div>
            <form onSubmit={onAssignManager} className="space-y-3">
              <AutocompleteInput
                value={managerSearch}
                onChange={setManagerSearch}
                onSelect={handleManagerSelect}
                options={availableManagers}
                placeholder="Cerca manager per nome o email..."
                label="Manager"
                disabled={loading}
              />
              
              {selectedManager && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
                    <User size={16} />
                    <div>
                      <div className="font-medium">{selectedManager.name}</div>
                      <div className="text-sm text-blue-600 dark:text-blue-300">{selectedManager.email}</div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label className="text-sm">Regione</label>
                <select 
                  value={targetRegionId} 
                  onChange={(e)=>setTargetRegionId(e.target.value)} 
                  className="border rounded-lg px-2 py-2 text-sm w-full" 
                  required
                  disabled={loading}
                >
                  <option value="" disabled>Seleziona regione...</option>
                  {availableRegions.map((region, index) => (
                    <option key={index} value={region}>{region}</option>
                  ))}
                </select>
                {availableRegions.length === 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    Tutte le regioni hanno già un manager assegnato
                  </div>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={loading || !selectedManager || !targetRegionId || availableRegions.length === 0} 
                className="w-full"
              >
                {loading ? "Assegnando..." : "Assegna Manager"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}

