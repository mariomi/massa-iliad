"use client";
import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { AdvancedCalendar, CalendarFilters, ShiftEvent } from "@/components/calendar/AdvancedCalendar";
import { CalendarFiltersPanel } from "@/components/calendar/CalendarFilters";
import { ShiftModal } from "@/components/calendar/ShiftModal";
import { useMe } from "@/lib/auth/useMe";
import { canEditPlanner } from "@/lib/auth/rbac";
import { demoDataService } from "@/lib/demo-data/demo-service";

export default function HoursReport() {
  const { me } = useMe();
  const [showFilters, setShowFilters] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [filters, setFilters] = useState<CalendarFilters>({
    stores: [],
    teams: [],
    persons: [],
    roles: [],
    period: {
      // default to current month range for better visibility on first load
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
    }
  });

  const canEdit = canEditPlanner(me?.role ?? "user", null);

  const handleFiltersChange = (newFilters: CalendarFilters) => {
    setFilters({ ...newFilters });
  };

  const handleShiftCreate = (slot: any) => {
    setEditingShift(null);
    setIsEditMode(false);
    setShowShiftModal(true);
  };

  const handleShiftEdit = (shift: ShiftEvent) => {
    setEditingShift(shift);
    setIsEditMode(true);
    setShowShiftModal(true);
  };

  const handleShiftSave = (shift: Partial<ShiftEvent>) => {
    try {
      if (isEditMode && editingShift) {
        // Update existing shift
        const updatedShift = demoDataService.updateShift(editingShift.id, {
          store_id: shift.resource?.storeId || editingShift.resource.storeId,
          user_id: shift.resource?.userId || editingShift.resource.userId,
          title: shift.title || editingShift.title,
          start_at: shift.start?.toISOString() || editingShift.start.toISOString(),
          end_at: shift.end?.toISOString() || editingShift.end.toISOString(),
          published: shift.resource?.published ?? editingShift.resource.published,
          note: shift.resource?.note || editingShift.resource.note
        });
        
        if (updatedShift) {
          console.log("Shift updated:", updatedShift);
          setRefreshTrigger(prev => prev + 1);
        }
      } else {
        // Create new shift
        const newShift = demoDataService.createShift({
          store_id: shift.resource?.storeId || "",
          user_id: shift.resource?.userId || "",
          title: shift.title || "",
          start_at: shift.start?.toISOString() || new Date().toISOString(),
          end_at: shift.end?.toISOString() || new Date().toISOString(),
          published: shift.resource?.published ?? false,
          note: shift.resource?.note || ""
        });
        
        console.log("Shift created:", newShift);
        setRefreshTrigger(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error saving shift:", error);
    } finally {
      setShowShiftModal(false);
    }
  };

  const handleShiftDelete = (shiftId: string) => {
    try {
      const deleted = demoDataService.deleteShift(shiftId);
      if (deleted) {
        console.log("Shift deleted:", shiftId);
        setRefreshTrigger(prev => prev + 1);
      } else {
        console.error("Failed to delete shift:", shiftId);
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
    } finally {
      setShowShiftModal(false);
    }
  };

  return (
    <>
      <PageHeader 
        title="Report ore" 
        desc="Calendario avanzato per la gestione dei turni e il conteggio delle ore" 
      />
      
      <AdvancedCalendar
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onShiftCreate={canEdit ? handleShiftCreate : undefined}
        onShiftEdit={canEdit ? handleShiftEdit : undefined}
        onShiftDelete={canEdit ? handleShiftDelete : undefined}
        onShowFilters={() => setShowFilters(true)}
        refreshTrigger={refreshTrigger}
      />

      {showFilters && (
        <CalendarFiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClose={() => setShowFilters(false)}
        />
      )}

      {showShiftModal && (
        <ShiftModal
          isOpen={showShiftModal}
          onClose={() => setShowShiftModal(false)}
          onSave={handleShiftSave}
          onDelete={canEdit ? handleShiftDelete : undefined}
          shift={editingShift}
          isEdit={isEditMode}
        />
      )}
    </>
  );
}
