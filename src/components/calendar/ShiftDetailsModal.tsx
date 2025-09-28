"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, MapPin, Clock, Calendar, Building, User } from "lucide-react";
import { ShiftEvent } from "./AdvancedCalendar";
import dayjs from "dayjs";
import "dayjs/locale/it";
import { demoDataService } from "@/lib/demo-data/demo-service";

interface ShiftDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shift: ShiftEvent | null;
}

export function ShiftDetailsModal({ 
  isOpen, 
  onClose, 
  shift 
}: ShiftDetailsModalProps) {
  if (!isOpen || !shift) return null;

  // Get store information from demo data service
  const store = demoDataService.getStoreById(shift.resource.storeId);

  const formatTime = (date: Date) => {
    return dayjs(date).locale('it').format("HH:mm");
  };

  const formatDate = (date: Date) => {
    return dayjs(date).locale('it').format("dddd, D MMMM YYYY");
  };

  const formatDuration = (start: Date, end: Date) => {
    const durationMs = end.getTime() - start.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Dettagli Turno
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Shift Information */}
          <div className="space-y-4">
            {/* Store Information */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Building className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {shift.resource.storeName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {store?.address || "Indirizzo non disponibile"}
                </p>
              </div>
            </div>

            {/* Date Information */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Calendar className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Data
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formatDate(shift.start)}
                </p>
              </div>
            </div>

            {/* Time Information */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Orario
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {formatTime(shift.start)} - {formatTime(shift.end)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Durata: {formatDuration(shift.start, shift.end)}
                </p>
              </div>
            </div>

            {/* User Information */}
            {shift.resource.userName && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Persona Assegnata
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {shift.resource.userName}
                  </p>
                  {shift.resource.role && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Ruolo: {shift.resource.role}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Status */}
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Stato:
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  shift.resource.published 
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}>
                  {shift.resource.published ? "Pubblicato" : "Bozza"}
                </span>
              </div>
            </div>

            {/* Note */}
            {shift.resource.note && (
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Note
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  {shift.resource.note}
                </p>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Chiudi
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
