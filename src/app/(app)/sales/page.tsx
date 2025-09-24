'use client';

import { useEffect, useState, lazy, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMe } from '@/lib/auth/useMe';
import { DemoSale, SalesStats } from '@/lib/demo-data/demo-service';
import { useDemoData } from '@/lib/demo-data/useDemoData';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Lazy load heavy components
const SalesCharts = lazy(() => import('@/components/sales/SalesCharts').then(module => ({ default: module.SalesCharts })));
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
  Watch,
  RefreshCw
} from 'lucide-react';

export default function SalesPage() {
  const { me, loading } = useMe();
  const { isInitialized, demoDataService } = useDemoData();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sales, setSales] = useState<DemoSale[]>([]);
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && me && isInitialized) {
      if (me.role !== 'admin') {
        router.push('/dashboard');
        return;
      }

      loadSalesData();
    }
  }, [me, loading, isInitialized, router]);

  // Reload data when page becomes visible (e.g., when returning from new sale page)
  useEffect(() => {
    if (!isInitialized) return;
    
    const handleVisibilityChange = () => {
      if (!document.hidden && me?.role === 'admin') {
        loadSalesData();
      }
    };

    const handleFocus = () => {
      if (me?.role === 'admin') {
        loadSalesData();
      }
    };

    const handlePageShow = () => {
      if (me?.role === 'admin') {
        loadSalesData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('pageshow', handlePageShow);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [me, isInitialized]);

  // Check for refresh parameter from new sale page
  useEffect(() => {
    if (searchParams.get('refresh') === 'true' && me?.role === 'admin' && isInitialized) {
      loadSalesData(true);
      // Remove the refresh parameter from URL
      router.replace('/sales');
    }
  }, [searchParams, me, isInitialized, router]);

  const loadSalesData = (showLoading = false) => {
    if (!demoDataService) return;
    
    if (showLoading) {
      setLoadingData(true);
    }
    
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
        return 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300';
      case 'card':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300';
      case 'digital':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  if (loading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Caricamento vendite...</p>
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
        <Button 
          variant="outline" 
          onClick={() => loadSalesData(true)} 
          disabled={loadingData}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loadingData ? 'animate-spin' : ''}`} />
          {loadingData ? 'Aggiornando...' : 'Aggiorna Dati'}
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
                <div key={sale.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      {getCategoryIcon(sale.category)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{sale.product_name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
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
                      <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{formatCurrency(sale.total_amount)}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{formatDate(sale.sale_date)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      {stats && (
        <Suspense fallback={<LoadingSpinner size="lg" className="h-96" />}>
          <SalesCharts stats={stats} refreshTrigger={sales.length} />
        </Suspense>
      )}
    </div>
  );
}
