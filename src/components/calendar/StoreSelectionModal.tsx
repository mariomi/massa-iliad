'use client';

import { useState, useEffect, useRef } from 'react';
import { demoDataService } from '@/lib/demo-data/demo-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Store } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  region: string;
  city: string;
}

interface StoreSelectionModalProps {
  isOpen: boolean;
  onStoreSelect: (storeId: string) => void;
  onClose: () => void;
}

export function StoreSelectionModal({ isOpen, onStoreSelect, onClose }: StoreSelectionModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [filteredStores, setFilteredStores] = useState<Store[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const allStores = demoDataService.getAllStores();
      setStores(allStores);
      setFilteredStores(allStores);
      setSearchTerm('');
      setSelectedIndex(-1);
      // Focus input after modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStores(stores);
    } else {
      const filtered = stores.filter(store => 
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.region.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStores(filtered);
    }
    setSelectedIndex(-1);
  }, [searchTerm, stores]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredStores.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredStores.length) {
          onStoreSelect(filteredStores[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const handleStoreClick = (storeId: string) => {
    onStoreSelect(storeId);
  };

  const handleSelectAll = () => {
    onStoreSelect(''); // Empty string means "all stores"
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-hidden">
        <CardHeader className="p-3 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Store className="h-4 w-4 sm:h-5 sm:w-5" />
            Seleziona Negozio
          </CardTitle>
          <CardDescription className="text-sm">
            Scegli il negozio da visualizzare nel calendario. Puoi cercare per nome, indirizzo o città.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="store-search" className="text-sm">Cerca negozio</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={inputRef}
                id="store-search"
                type="text"
                placeholder="Digita nome, indirizzo o città..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleSelectAll}
              className="w-full justify-start text-sm"
            >
              <Store className="h-4 w-4 mr-2" />
              Visualizza tutti i negozi
            </Button>
          </div>

          <div 
            ref={listRef}
            className="max-h-48 sm:max-h-60 overflow-y-auto space-y-2 border rounded-lg p-2"
          >
            {filteredStores.length > 0 ? (
              filteredStores.map((store, index) => (
                <div
                  key={store.id}
                  className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-colors ${
                    index === selectedIndex
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => handleStoreClick(store.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                          {store.name}
                        </h3>
                        <Badge variant="secondary" className="text-xs self-start">
                          {store.region}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{store.address}, {store.city}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                Nessun negozio trovato per "{searchTerm}"
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-3 sm:pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="text-sm">
              Annulla
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

