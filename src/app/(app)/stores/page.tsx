'use client';

import { useEffect, useState } from 'react';
import { useMe } from '@/lib/auth/useMe';
import { demoDataService } from '@/lib/demo-data/demo-service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle,
  XCircle,
  User,
  Calendar
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
  managerName?: string;
  userRole?: string;
  upcomingShifts?: Array<{
    id: string;
    start_at: string;
    end_at: string;
    title: string;
    note?: string;
  }>;
}

export default function StoresPage() {
  const { me, loading } = useMe();
  const [stores, setStores] = useState<StoreWithStats[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && me) {
      loadStoresData();
    }
  }, [loading, me]);

  // Real-time updates across tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'iliad_demo_last_update') {
        loadStoresData();
      }
    };
    const onCustom = () => loadStoresData();
    window.addEventListener('storage', onStorage);
    window.addEventListener('iliad-demo:update', onCustom as EventListener);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('iliad-demo:update', onCustom as EventListener);
    };
  }, []);

  const loadStoresData = () => {
    try {
      if (!me) return;
      
      // Get all stores where the user is assigned
      const allStores = demoDataService.getAllStores();
      const allUsers = demoDataService.getUsers();
      const allShifts = demoDataService.getShifts();
      
      const userStores = allStores.filter(store => {
        // 1) Assigned to this store
        const storeUsers = allUsers.filter(user => user.store_id === store.id);
        const isAssigned = storeUsers.some(user => user.id === me.id);
        // 2) Has any shift in this store (past or future)
        const hasShiftsHere = allShifts.some(shift => shift.store_id === store.id && shift.user_id === me.id);
        return isAssigned || hasShiftsHere;
      });
      
      // Enrich stores with manager names, user role, and upcoming shifts
      const enrichedStores = userStores.map(store => {
        const manager = demoDataService.getUserById(store.manager);
        
        // Get user's role in this store
        const userInStore = demoDataService.getUsers().find(user => 
          user.id === me.id && user.store_id === store.id
        );
        
        // Get upcoming shifts for this user in this store
        const userShifts = allShifts.filter(shift => 
          shift.store_id === store.id && 
          shift.user_id === me.id
        );
        const now = new Date();
        const upcomingShifts = userShifts
          // include shifts that haven't ended yet (ongoing or future), regardless of published
          .filter(shift => new Date(shift.end_at) >= now)
          .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime())
          .slice(0, 3); // Show only next 3 shifts
        
        return {
          ...store,
          managerName: manager?.name || 'Manager sconosciuto',
          userRole: userInStore?.role || 'N/A',
          upcomingShifts: upcomingShifts
        };
      });
      
      setStores(enrichedStores);
    } catch (error) {
      console.error('Error loading stores data:', error);
    } finally {
      setLoadingData(false);
    }
  };



  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role: string) => {
    const roleLabels: Record<string, string> = {
      'manager': 'Manager',
      'staff': 'Staff',
      'viewer': 'Viewer',
      'workforce': 'Forza Lavoro',
      'dipendente': 'Dipendente',
      'agente': 'Agente',
      'admin': 'Admin'
    };
    return roleLabels[role] || role;
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
        title="I Miei Punti Vendita"
        description={`Visualizza i negozi a cui sei assegnato come ${me?.role || 'dipendente'}`}
      />


      {/* Stores Grid */}
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">{store.name}</CardTitle>
                  <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                    {store.region} - {store.city}
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(store.status)} border-0 shadow-none`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(store.status)}
                    {store.status}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 pt-0">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{store.address}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{store.postal_code} {store.city}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{store.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{store.email}</span>
                </div>
              </div>

              {/* Manager & Role */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
                    <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">{store.managerName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Il Mio Ruolo</p>
                    <Badge variant="secondary" className="text-xs border-0 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {getRoleLabel(store.userRole || 'N/A')}
                    </Badge>
                  </div>
                </div>
              </div>



              {/* Upcoming Shifts */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Prossimi Turni
                </p>
                <div className="space-y-3">
                  {store.upcomingShifts && store.upcomingShifts.length > 0 ? (
                    store.upcomingShifts.map((shift) => (
                      <div key={shift.id} className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/20">
                        <div className="flex justify-between items-start mb-2">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                              {formatDateTime(shift.start_at)}
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                              {formatDateTime(shift.end_at)}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs border-0 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                            {shift.title}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          {!shift.published && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">Bozza</span>
                          )}
                          {shift.note && (
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              {shift.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50/50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800">
                      Nessun turno programmato
                    </div>
                  )}
                </div>
              </div>

              {/* Opening Hours */}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                <p className="text-sm font-medium mb-3 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                  <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  Orari Negozio
                </p>
                <div className="space-y-2">
                  {Object.entries(store.opening_hours).slice(0, 3).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="capitalize text-gray-600 dark:text-gray-400">{day}</span>
                      <span className="text-gray-900 dark:text-gray-100 font-medium">{hours}</span>
                    </div>
                  ))}
                  {Object.keys(store.opening_hours).length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">+{Object.keys(store.opening_hours).length - 3} altri giorni</p>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center border-0 shadow-sm bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <MapPin className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Nessun negozio assegnato
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Non sei attualmente assegnato a nessun punto vendita.
            Contatta il tuo manager per maggiori informazioni.
          </p>
        </Card>
      )}
    </div>
  );
}