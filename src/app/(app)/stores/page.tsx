'use client';

import { useEffect, useState } from 'react';
import { useMe } from '@/lib/auth/useMe';
import { demoDataService } from '@/lib/demo-data/demo-service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Users, 
  Square,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface StoreWithStats {
  id: string;
  name: string;
  address: string;
  region: string;
  city: string;
  postal_code: string;
  phone: string;
  email: string;
  manager: string;
  status: string;
  opening_hours: { [key: string]: string };
  services: string[];
  square_meters: number;
  employees_count: number;
  created_at: string;
  managerName?: string;
  totalSales?: number;
  totalRevenue?: number;
}

export default function StoresPage() {
  const { me, loading } = useMe();
  const [stores, setStores] = useState<StoreWithStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      loadStoresData();
    }
  }, [loading]);

  const loadStoresData = () => {
    try {
      const allStores = demoDataService.getAllStores();
      const salesStats = demoDataService.getSalesStats();
      
      // Enrich stores with manager names and sales data
      const enrichedStores = allStores.map(store => {
        const manager = demoDataService.getUserById(store.manager);
        const storeSales = salesStats.salesByStore[store.id];
        
        return {
          ...store,
          managerName: manager?.name || 'Manager sconosciuto',
          totalSales: storeSales?.sales || 0,
          totalRevenue: storeSales?.revenue || 0
        };
      });
      
      setStores(enrichedStores);
    } catch (error) {
      console.error('Error loading stores data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />;
      case 'inactive':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento negozi...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Punti Vendita"
        description="Visualizza tutti i negozi Iliad e le loro informazioni"
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negozi Totali</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stores.length}</div>
            <p className="text-xs text-muted-foreground">
              Punti vendita attivi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Negozi Attivi</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stores.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Operativi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dipendenti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stores.reduce((sum, store) => sum + store.employees_count, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Personale totale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Metri Quadri</CardTitle>
            <Square className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stores.reduce((sum, store) => sum + store.square_meters, 0)}m²
            </div>
            <p className="text-xs text-muted-foreground">
              Superficie totale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <Badge className={getStatusColor(store.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(store.status)}
                    {store.status}
                  </div>
                </Badge>
              </div>
              <CardDescription>
                {store.region} - {store.city}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Address */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{store.address}</p>
                  <p className="text-xs text-gray-600">{store.postal_code} {store.city}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{store.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-600" />
                  <span className="text-sm">{store.email}</span>
                </div>
              </div>

              {/* Manager */}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">Manager</p>
                  <p className="text-xs text-gray-600">{store.managerName}</p>
                </div>
              </div>

              {/* Store Info */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm font-medium">Dipendenti</p>
                  <p className="text-lg font-bold">{store.employees_count}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Superficie</p>
                  <p className="text-lg font-bold">{store.square_meters}m²</p>
                </div>
              </div>

              {/* Sales Stats */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div>
                  <p className="text-sm font-medium">Vendite</p>
                  <p className="text-lg font-bold text-blue-600">{store.totalSales}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ricavi</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(store.totalRevenue)}</p>
                </div>
              </div>

              {/* Services */}
              <div>
                <p className="text-sm font-medium mb-2">Servizi</p>
                <div className="flex flex-wrap gap-1">
                  {store.services.map((service, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Opening Hours */}
              <div>
                <p className="text-sm font-medium mb-2">Orari</p>
                <div className="space-y-1">
                  {Object.entries(store.opening_hours).slice(0, 3).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="capitalize">{day}</span>
                      <span>{hours}</span>
                    </div>
                  ))}
                  {Object.keys(store.opening_hours).length > 3 && (
                    <p className="text-xs text-gray-500">+{Object.keys(store.opening_hours).length - 3} altri giorni</p>
                  )}
                </div>
              </div>

              {/* Created Date */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Aperto il {formatDate(store.created_at)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}