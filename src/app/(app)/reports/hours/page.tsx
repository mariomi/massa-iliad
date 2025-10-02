"use client";
import { useState, useEffect, lazy, Suspense, useCallback } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { CalendarFilters, ShiftEvent } from "@/components/calendar/AdvancedCalendar";
import { useMe } from "@/lib/auth/useMe";
import { canEditPlanner } from "@/lib/auth/rbac";
import { demoDataService } from "@/lib/demo-data/demo-service";

// Lazy load heavy components
const AdvancedCalendar = lazy(() => import("@/components/calendar/AdvancedCalendar").then(module => ({ default: module.AdvancedCalendar })));
const MobileCalendar = lazy(() => import("@/components/calendar/MobileCalendar").then(module => ({ default: module.MobileCalendar })));
const CalendarFiltersPanel = lazy(() => import("@/components/calendar/CalendarFilters").then(module => ({ default: module.CalendarFiltersPanel })));
const ShiftModal = lazy(() => import("@/components/calendar/ShiftModal").then(module => ({ default: module.ShiftModal })));
const ShiftDetailsModal = lazy(() => import("@/components/calendar/ShiftDetailsModal").then(module => ({ default: module.ShiftDetailsModal })));
const StoreSelectionModal = lazy(() => import("@/components/calendar/StoreSelectionModal").then(module => ({ default: module.StoreSelectionModal })));

export default function HoursReport() {
  const { me } = useMe();
  const [showStoreSelection, setShowStoreSelection] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showShiftDetailsModal, setShowShiftDetailsModal] = useState(false);
  const [editingShift, setEditingShift] = useState<ShiftEvent | null>(null);
  const [selectedShift, setSelectedShift] = useState<ShiftEvent | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [storeFilterTrigger, setStoreFilterTrigger] = useState(0);
  
  const [filters, setFilters] = useState<CalendarFilters>({
    store: null,
    team: null,
    person: null,
    role: null,
    period: {
      // default to current month range for better visibility on first load
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0, 0, 0, 0),
      to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999)
    }
  });

  const canEdit = canEditPlanner(me?.role ?? "user", null);
  const isAdmin = me?.role === "admin" || me?.role === "manager";

  // Initialize store selection modal for admin users
  useEffect(() => {
    if (isAdmin && !filters.store) {
      setShowStoreSelection(true);
    }
  }, [isAdmin, filters.store]);

  // Real-time updates across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'iliad_demo_last_update') {
        setRefreshTrigger(prev => prev + 1);
      }
    };
    const onCustom = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('storage', onStorage);
    window.addEventListener('iliad-demo:update', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('iliad-demo:update', onCustom as EventListener);
    };
  }, []);

  const filtersAreEqual = (a: CalendarFilters, b: CalendarFilters) => {
    const sameStore = a.store === b.store;
    const sameTeam = a.team === b.team;
    const samePerson = a.person === b.person;
    const sameRole = a.role === b.role;
    const samePeriod = (!!a.period === !!b.period) && (!a.period || (
      a.period.from.getTime() === b.period!.from.getTime() &&
      a.period.to.getTime() === b.period!.to.getTime()
    ));
    return sameStore && sameTeam && samePerson && sameRole && samePeriod;
  };

  const handleFiltersChange = useCallback((newFilters: CalendarFilters) => {
    // For workforce users, always keep store filter as null to show all stores
    // For admin/manager users, allow store filtering
    const updatedFilters = isAdmin ? newFilters : { ...newFilters, store: null };
    setFilters(prev => (filtersAreEqual(prev, updatedFilters) ? prev : updatedFilters));
  }, [isAdmin]);

  const handleStoreSelect = (storeId: string) => {
    setFilters(prev => ({
      ...prev,
      store: storeId || null
    }));
    setStoreFilterTrigger(prev => prev + 1);
    setShowStoreSelection(false);
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

  const handleShiftDetails = (shift: ShiftEvent) => {
    setSelectedShift(shift);
    setShowShiftDetailsModal(true);
  };

  const handleShiftSave = (shift: Partial<ShiftEvent>, recurrence?: { pattern: 'none' | 'daily' | 'weekly'; until?: string; endOfMonth?: boolean }) => {
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
        // Create new shift or series
        const base = {
          store_id: shift.resource?.storeId || "",
          user_id: shift.resource?.userId || "",
          title: shift.title || "",
          start_at: shift.start?.toISOString() || new Date().toISOString(),
          end_at: shift.end?.toISOString() || new Date().toISOString(),
          published: shift.resource?.published ?? false,
          note: shift.resource?.note || ""
        };
        if (recurrence && recurrence.pattern && recurrence.pattern !== 'none') {
          demoDataService.createShiftSeries(base, recurrence);
        } else {
          demoDataService.createShift(base);
        }
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
      
      {/* Store selection modal - only for admin/manager */}
      {isAdmin && showStoreSelection && (
        <Suspense fallback={<LoadingSpinner size="md" className="h-32" />}>
          <StoreSelectionModal
            isOpen={showStoreSelection}
            onStoreSelect={handleStoreSelect}
            onClose={() => setShowStoreSelection(false)}
          />
        </Suspense>
      )}
      
      {/* Store filter section - only for admin/manager */}
      {isAdmin && !showStoreSelection && (
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Negozio selezionato: 
            </span>
            <span className="font-medium text-sm sm:text-base">
              {filters.store ? demoDataService.getStoreById(filters.store)?.name : 'Tutti i negozi'}
            </span>
          </div>
          <button
            onClick={() => setShowStoreSelection(true)}
            className="px-3 py-1 text-xs sm:text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-900/70 text-blue-700 dark:text-blue-300 rounded-md transition-colors self-start sm:self-auto"
          >
            Cambia Negozio
          </button>
        </div>
      )}
      
      <div>
        <Suspense fallback={<LoadingSpinner size="lg" className="h-96" />}>
            {/* Use MobileCalendar on mobile, AdvancedCalendar on desktop */}
            <div className="block md:hidden">
              <MobileCalendar
                filters={filters}
                onShiftCreate={canEdit ? handleShiftCreate : undefined}
                onShiftEdit={canEdit ? handleShiftEdit : undefined}
                onShiftDelete={canEdit ? handleShiftDelete : undefined}
                onShiftDetails={handleShiftDetails}
                refreshTrigger={refreshTrigger + storeFilterTrigger}
              />
            </div>
            <div className="hidden md:block">
              <AdvancedCalendar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onShiftCreate={canEdit ? handleShiftCreate : undefined}
                onShiftEdit={canEdit ? handleShiftEdit : undefined}
                onShiftDelete={canEdit ? handleShiftDelete : undefined}
                onShiftDetails={handleShiftDetails}
                onShowFilters={me?.role !== "workforce" ? () => setShowFilters(true) : undefined}
                refreshTrigger={refreshTrigger + storeFilterTrigger}
              />
            </div>
        </Suspense>
      </div>

      {showFilters && me?.role !== "workforce" && (
        <Suspense fallback={<LoadingSpinner size="md" className="h-32" />}>
          <CalendarFiltersPanel
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClose={() => setShowFilters(false)}
          />
        </Suspense>
      )}

      {showShiftModal && (
        <Suspense fallback={<LoadingSpinner size="md" className="h-32" />}>
          <ShiftModal
            isOpen={showShiftModal}
            onClose={() => setShowShiftModal(false)}
            onSave={handleShiftSave}
            onDelete={canEdit ? handleShiftDelete : undefined}
            shift={editingShift}
            isEdit={isEditMode}
          />
        </Suspense>
      )}

      {showShiftDetailsModal && (
        <Suspense fallback={<LoadingSpinner size="md" className="h-32" />}>
          <ShiftDetailsModal
            isOpen={showShiftDetailsModal}
            onClose={() => setShowShiftDetailsModal(false)}
            shift={selectedShift}
          />
        </Suspense>
      )}
    </>
  );
}
