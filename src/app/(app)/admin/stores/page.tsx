"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/lib/auth/useMe";
import { demoDataService } from "@/lib/demo-data/demo-service";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Users, 
  Square,
  CheckCircle,
  XCircle,
  Plus,
  Edit,
  Trash2
} from "lucide-react";

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

export default function AdminStoresPage() {
  const { me, loading: userLoading } = useMe();
  const router = useRouter();
  const [stores, setStores] = useState<StoreWithStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    region: "Lombardia",
    city: "Milano",
    postal_code: "",
    phone: "",
    email: "",
    manager: "",
    status: "active",
    square_meters: 100,
    employees_count: 5,
    services: ["Vendita", "Assistenza", "Ricarica"]
  });

  useEffect(() => {
    if (!userLoading && me) {
      if (me.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
      loadStoresData();
    }
  }, [me, userLoading, router]);

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
    }
  };

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, this would call an API
      // For demo, we'll just show a success message
      alert('Negozio creato con successo! (Demo)');
      setFormData({
        name: "",
        address: "",
        region: "Lombardia",
        city: "Milano",
        postal_code: "",
        phone: "",
        email: "",
        manager: "",
        status: "active",
        square_meters: 100,
        employees_count: 5,
        services: ["Vendita", "Assistenza", "Ricarica"]
      });
      setShowForm(false);
      loadStoresData();
    } catch (error) {
      console.error('Error creating store:', error);
      alert('Errore nella creazione del negozio');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!me || me.role !== 'admin') {
    return null;
  }

  const managers = demoDataService.getAllUsers().filter(user => user.role === 'manager');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Gestione Negozi"
          description="Amministra tutti i punti vendita Iliad"
        />
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nuovo Negozio
        </Button>
      </div>

      {/* Create Store Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nuovo Negozio</CardTitle>
            <CardDescription>
              Compila i dettagli per creare un nuovo punto vendita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Negozio *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="es. Iliad Store Duomo"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Indirizzo *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="es. Via Roma 123, Milano"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Città *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">CAP *</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    placeholder="es. 20100"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="es. +39 02 1234567"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="es. store@iliad.it"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Manager *</Label>
                  <select
                    id="manager"
                    value={formData.manager}
                    onChange={(e) => handleInputChange('manager', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Seleziona un manager</option>
                    {managers.map(manager => (
                      <option key={manager.id} value={manager.id}>
                        {manager.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Stato *</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="active">Attivo</option>
                    <option value="inactive">Inattivo</option>
                    <option value="maintenance">Manutenzione</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="square_meters">Metri Quadri *</Label>
                  <Input
                    id="square_meters"
                    type="number"
                    value={formData.square_meters}
                    onChange={(e) => handleInputChange('square_meters', parseInt(e.target.value) || 100)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employees_count">Numero Dipendenti *</Label>
                  <Input
                    id="employees_count"
                    type="number"
                    value={formData.employees_count}
                    onChange={(e) => handleInputChange('employees_count', parseInt(e.target.value) || 5)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creando...' : 'Crea Negozio'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Annulla
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Stores List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stores.map((store) => (
          <Card key={store.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{store.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(store.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(store.status)}
                      {store.status}
                    </div>
                  </Badge>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

