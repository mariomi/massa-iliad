"use client";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Save, Trash2 } from "lucide-react";
import { ShiftEvent } from "./AdvancedCalendar";
import { demoDataService, RecurrenceOptions } from "@/lib/demo-data/demo-service";

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (shift: Partial<ShiftEvent>, recurrence?: RecurrenceOptions) => void;
  onDelete?: (shiftId: string) => void;
  shift?: ShiftEvent | null;
  isEdit?: boolean;
}

export function ShiftModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  shift, 
  isEdit = false 
}: ShiftModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    start: "",
    end: "",
    storeId: "",
    userId: "",
    note: "",
    published: false
  });

  const [recurrence, setRecurrence] = useState<{ pattern: 'none' | 'daily' | 'weekly'; mode: 'none' | 'endOfMonth' | 'until'; until: string }>(
    { pattern: 'none', mode: 'none', until: '' }
  );

  // Get data from demo service
  const stores = demoDataService.getStores();
  const users = demoDataService.getUsers();

  useEffect(() => {
    if (shift && isEdit) {
      setFormData({
        title: shift.title,
        start: shift.start.toISOString().slice(0, 16),
        end: shift.end.toISOString().slice(0, 16),
        storeId: shift.resource.storeId,
        userId: shift.resource.userId || "",
        note: shift.resource.note || "",
        published: shift.resource.published
      });
      setRecurrence({ pattern: 'none', mode: 'none', until: '' });
    } else {
      // Reset form for new shift
      const now = new Date();
      const start = new Date(now.getTime() + 60 * 60 * 1000); // +1 hour
      const end = new Date(now.getTime() + 5 * 60 * 60 * 1000); // +5 hours
      
      setFormData({
        title: "",
        start: start.toISOString().slice(0, 16),
        end: end.toISOString().slice(0, 16),
        storeId: "",
        userId: "",
        note: "",
        published: false
      });
      setRecurrence({ pattern: 'none', mode: 'none', until: '' });
    }
  }, [shift, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedStore = stores.find(s => s.id === formData.storeId);
    const selectedUser = users.find(u => u.id === formData.userId);
    
    const shiftData: Partial<ShiftEvent> = {
      id: shift?.id || `shift_${Date.now()}`,
      title: formData.title || `${selectedUser?.name || "Turno"}`,
      start: new Date(formData.start),
      end: new Date(formData.end),
      resource: {
        storeId: formData.storeId,
        storeName: selectedStore?.name || "",
        userId: formData.userId,
        userName: selectedUser?.name || "",
        role: selectedUser?.role || "staff",
        published: formData.published,
        note: formData.note,
        hours: (new Date(formData.end).getTime() - new Date(formData.start).getTime()) / (1000 * 60 * 60)
      }
    };

    let recurrenceOptions: RecurrenceOptions | undefined = undefined;
    if (!isEdit && recurrence.pattern !== 'none') {
      if (recurrence.mode === 'endOfMonth') {
        recurrenceOptions = { pattern: recurrence.pattern, endOfMonth: true };
      } else if (recurrence.mode === 'until' && recurrence.until) {
        // Convert local datetime to ISO
        const untilISO = new Date(recurrence.until).toISOString();
        recurrenceOptions = { pattern: recurrence.pattern, until: untilISO };
      }
    }

    onSave(shiftData, recurrenceOptions);
    onClose();
  };

  const handleDelete = () => {
    if (shift && onDelete) {
      onDelete(shift.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">
              {isEdit ? "Modifica Turno" : "Nuovo Turno"}
            </h2>
            <Button variant="ghost" size="lg" onClick={onClose} className="text-lg">
              <X size={24} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-lg font-medium">Titolo</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nome del turno"
                className="h-12 text-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="text-lg font-medium">Inizio</Label>
                <Input
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData(prev => ({ ...prev, start: e.target.value }))}
                  className="h-12 text-lg"
                  required
                />
              </div>
              <div>
                <Label className="text-lg font-medium">Fine</Label>
                <Input
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData(prev => ({ ...prev, end: e.target.value }))}
                  className="h-12 text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-lg font-medium">Negozio</Label>
              <select
                value={formData.storeId}
                onChange={(e) => setFormData(prev => ({ ...prev, storeId: e.target.value }))}
                className="w-full p-3 border border-neutral-300 rounded-lg h-12 text-lg"
                required
              >
                <option value="">Seleziona negozio</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-lg font-medium">Persona</Label>
              <select
                value={formData.userId}
                onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                className="w-full p-3 border border-neutral-300 rounded-lg h-12 text-lg"
                required
              >
                <option value="">Seleziona persona</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role === 'workforce' ? 'Forza Lavoro' : user.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-lg font-medium">Note</Label>
              <Input
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Note aggiuntive"
                className="h-12 text-lg"
              />
            </div>

            {/* Recurrence */}
            {!isEdit && (
              <div className="space-y-4">
                <Label className="text-lg font-medium">Ripetizione</Label>
                <div className="grid grid-cols-3 gap-4 items-end">
                  <div className="col-span-1">
                    <select
                      value={recurrence.pattern}
                      onChange={(e) => setRecurrence(prev => ({ ...prev, pattern: e.target.value as any }))}
                      className="w-full p-3 border border-neutral-300 rounded-lg h-12 text-lg"
                    >
                      <option value="none">Nessuna</option>
                      <option value="daily">Giornaliera</option>
                      <option value="weekly">Settimanale</option>
                    </select>
                  </div>
                  {recurrence.pattern !== 'none' && (
                    <>
                      <div className="col-span-1">
                        <select
                          value={recurrence.mode}
                          onChange={(e) => setRecurrence(prev => ({ ...prev, mode: e.target.value as any }))}
                          className="w-full p-3 border border-neutral-300 rounded-lg h-12 text-lg"
                        >
                          <option value="endOfMonth">Fino a fine mese</option>
                          <option value="until">Fino a data</option>
                        </select>
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="datetime-local"
                          value={recurrence.until}
                          onChange={(e) => setRecurrence(prev => ({ ...prev, until: e.target.value }))}
                          className="h-12 text-lg"
                          disabled={recurrence.mode !== 'until'}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                className="h-6 w-6 rounded border-neutral-300"
              />
              <Label htmlFor="published" className="text-lg">
                Pubblicato
              </Label>
            </div>

            <div className="flex items-center justify-between pt-6">
              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  className="text-red-600 border-red-600 hover:bg-red-50 text-lg px-6 py-3"
                >
                  <Trash2 size={20} />
                  Elimina
                </Button>
              )}
              
              <div className="flex items-center gap-4 ml-auto">
                <Button type="button" variant="outline" onClick={onClose} size="lg" className="text-lg px-6 py-3">
                  Annulla
                </Button>
                <Button type="submit" size="lg" className="text-lg px-6 py-3">
                  <Save size={20} />
                  {isEdit ? "Salva" : "Crea"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
