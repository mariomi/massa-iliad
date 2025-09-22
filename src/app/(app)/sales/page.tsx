'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/auth/useMe';
import { demoDataService, DemoSale, SalesStats } from '@/lib/demo-data/demo-service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SalesCharts } from '@/components/sales/SalesCharts';
import { 
  ShoppingCart, 
  TrendingUp, 
  Euro, 
  Package, 
  Plus,
  Calendar,
  Store,
  CreditCard,
  Smartphone,
  Laptop,
  Headphones,
  Watch
} from 'lucide-react';

export default function SalesPage() {
  const { me, loading } = useMe();
  const router = useRouter();
  const [sales, setSales] = useState<DemoSale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && me) {
      if (me.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      loadSalesData();
    }
  }, [me, loading, router]);

  const loadSalesData = () => {
    try {
      const allSales = demoDataService.getAllSales();
      const salesStats = demoDataService.getSalesStats();
      
      setSales(allSales);
      setStats(salesStats);
    } catch (error) {
      console.error('Error loading sales data:', error);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="h-4 w-4" />;
      case 'laptop':
        return <Laptop className="h-4 w-4" />;
      case 'accessori':
        return <Headphones className="h-4 w-4" />;
      case 'smartwatch':
        return <Watch className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-100 text-green-800';
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'digital':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento vendite...</p>
        </div>
      </div>
    );
  }

  if (!me || me.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gestione Vendite"
        description="Monitora e gestisci tutte le vendite dei negozi"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendite Totali</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSales}</div>
              <p className="text-xs text-muted-foreground">
                Transazioni completate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ricavi Totali</CardTitle>
              <Euro className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                Fatturato complessivo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valore Medio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.averageOrderValue)}</div>
              <p className="text-xs text-muted-foreground">
                Per transazione
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorie</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(stats.salesByCategory).length}</div>
              <p className="text-xs text-muted-foreground">
                Categorie vendute
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={() => router.push('/sales/new')} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nuova Vendita
        </Button>
        <Button variant="outline" onClick={loadSalesData} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Aggiorna Dati
        </Button>
      </div>

      {/* Sales List */}
      <Card>
        <CardHeader>
          <CardTitle>Ultime Vendite</CardTitle>
          <CardDescription>
            Lista delle vendite più recenti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sales.slice(0, 10).map((sale) => {
              const store = demoDataService.getStoreById(sale.store_id);
              const user = demoDataService.getUserById(sale.user_id);
              
              return (
                <div key={sale.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      {getCategoryIcon(sale.category)}
                    </div>
                    <div>
                      <h3 className="font-medium">{sale.product_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Store className="h-3 w-3" />
                          {store?.name || 'Store Unknown'}
                        </span>
                        <span>📍 {store?.address || 'Indirizzo sconosciuto'}</span>
                        <span>👤 {user?.name || 'Unknown'}</span>
                        <span>📦 Qty: {sale.quantity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getPaymentMethodColor(sale.payment_method)}>
                      {sale.payment_method.toUpperCase()}
                    </Badge>
                    <div className="text-right">
                      <div className="font-bold text-lg">{formatCurrency(sale.total_amount)}</div>
                      <div className="text-sm text-gray-600">{formatDate(sale.sale_date)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      {stats && <SalesCharts stats={stats} />}
    </div>
  );
}
