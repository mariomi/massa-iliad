'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart as LineChartIcon, 
  TrendingUp,
  Store,
  Package,
  Filter
} from 'lucide-react';
import { useDemoData } from '@/lib/demo-data/useDemoData';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface LineChartsProps {
  refreshTrigger?: number;
}

export const LineCharts = memo(function LineCharts({ refreshTrigger }: LineChartsProps) {
  const { isInitialized, demoDataService } = useDemoData();
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showStoreFilters, setShowStoreFilters] = useState(false);
  const [showProductFilters, setShowProductFilters] = useState(false);

  // Get stores and products data
  const stores = useMemo(() => {
    if (!demoDataService) return [];
    return demoDataService.getAllStores();
  }, [demoDataService]);

  const products = useMemo(() => {
    if (!demoDataService) return [];
    const sales = demoDataService.getAllSales();
    return [...new Set(sales.map(sale => sale.product_name))];
  }, [demoDataService, refreshTrigger]);

  // Initialize selected items
  useEffect(() => {
    if (stores.length > 0 && selectedStores.length === 0) {
      setSelectedStores(stores.slice(0, 3).map(store => store.id));
    }
  }, [stores, selectedStores.length]);

  useEffect(() => {
    if (products.length > 0 && selectedProducts.length === 0) {
      setSelectedProducts(products.slice(0, 3));
    }
  }, [products, selectedProducts.length]);

  // Get chart data
  const storeChartData = useMemo(() => {
    if (!demoDataService || selectedStores.length === 0) return null;
    
    const salesData = demoDataService.getSalesByStoreOverTime(selectedStores, 30);
    const dates = Object.keys(salesData[selectedStores[0]] || {});
    
    return dates.map(date => {
      const dataPoint: any = { date: new Date(date).toLocaleDateString('it-IT', { 
        month: 'short', 
        day: 'numeric' 
      }) };
      
      selectedStores.forEach(storeId => {
        const store = stores.find(s => s.id === storeId);
        if (store) {
          dataPoint[store.name] = salesData[storeId]?.[date] || 0;
        }
      });
      
      return dataPoint;
    });
  }, [demoDataService, selectedStores, stores, refreshTrigger]);

  const productChartData = useMemo(() => {
    if (!demoDataService || selectedProducts.length === 0) return null;
    
    const salesData = demoDataService.getSalesByProductOverTime(selectedProducts, 30);
    const dates = Object.keys(salesData[selectedProducts[0]] || {});
    
    return dates.map(date => {
      const dataPoint: any = { date: new Date(date).toLocaleDateString('it-IT', { 
        month: 'short', 
        day: 'numeric' 
      }) };
      
      selectedProducts.forEach(productName => {
        dataPoint[productName] = salesData[productName]?.[date] || 0;
      });
      
      return dataPoint;
    });
  }, [demoDataService, selectedProducts, refreshTrigger]);

  const getStoreColor = (index: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return colors[index % colors.length];
  };

  const getProductColor = (index: number) => {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // yellow
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#06B6D4', // cyan
      '#84CC16', // lime
    ];
    return colors[index % colors.length];
  };

  // Custom dot component to hide dots for zero values
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    if (payload[dataKey] === 0) return null;
    return <circle cx={cx} cy={cy} r={4} fill={props.fill} stroke={props.stroke} strokeWidth={2} />;
  };

  // Get theme-aware colors
  const getThemeColors = () => {
    // Check if we're in dark mode by looking at the document
    const isDark = typeof window !== 'undefined' && 
      (document.documentElement.classList.contains('dark') || 
       window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    return {
      text: isDark ? '#ffffff' : '#000000',
      grid: isDark ? '#374151' : '#e5e7eb',
      background: isDark ? '#1f2937' : '#ffffff',
      border: isDark ? '#4b5563' : '#d1d5db'
    };
  };

  const toggleStore = useCallback((storeId: string) => {
    setSelectedStores(prev => 
      prev.includes(storeId) 
        ? prev.filter(id => id !== storeId)
        : [...prev, storeId]
    );
  }, []);

  const toggleProduct = useCallback((productName: string) => {
    setSelectedProducts(prev => 
      prev.includes(productName) 
        ? prev.filter(name => name !== productName)
        : [...prev, productName]
    );
  }, []);

  if (!isInitialized || !demoDataService) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales by Store - Line Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <LineChartIcon className="h-5 w-5" />
                Vendite per Negozio
              </CardTitle>
              <CardDescription>Quantità vendute giornaliere per negozio (ultimi 30 giorni)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStoreFilters(!showStoreFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtri
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Store Filters */}
          {showStoreFilters && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {stores.map((store) => (
                  <Badge
                    key={store.id}
                    variant={selectedStores.includes(store.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleStore(store.id)}
                  >
                    <Store className="h-3 w-3 mr-1" />
                    {store.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Chart */}
          <div className="h-64">
            {storeChartData && storeChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={storeChartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={getThemeColors().grid} 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke={getThemeColors().text}
                    fontSize={12}
                    tick={{ fill: getThemeColors().text, fontSize: 12 }}
                    axisLine={{ stroke: getThemeColors().text }}
                    tickLine={{ stroke: getThemeColors().text }}
                  />
                  <YAxis 
                    stroke={getThemeColors().text}
                    fontSize={12}
                    tick={{ fill: getThemeColors().text, fontSize: 12 }}
                    axisLine={{ stroke: getThemeColors().text }}
                    tickLine={{ stroke: getThemeColors().text }}
                    tickFormatter={(value) => `${value} pz`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: getThemeColors().background,
                      border: `1px solid ${getThemeColors().border}`,
                      borderRadius: '6px',
                      color: getThemeColors().text,
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: any) => [`${value} pz`, '']}
                  />
                  <Legend 
                    wrapperStyle={{ color: getThemeColors().text }}
                  />
                  {selectedStores.map((storeId, index) => {
                    const store = stores.find(s => s.id === storeId);
                    if (!store) return null;
                    return (
                      <Line
                        key={storeId}
                        type="monotone"
                        dataKey={store.name}
                        stroke={getStoreColor(index)}
                        strokeWidth={2}
                        dot={(props) => {
                          const { key, ...restProps } = props;
                          return <CustomDot key={key} {...restProps} dataKey={store.name} />;
                        }}
                        activeDot={{ r: 6, fill: getStoreColor(index) }}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Seleziona almeno un negozio
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Products - Line Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Prodotti Top
              </CardTitle>
              <CardDescription>Quantità vendute giornaliere per prodotto (ultimi 30 giorni)</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProductFilters(!showProductFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtri
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Product Filters */}
          {showProductFilters && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {products.map((product) => (
                  <Badge
                    key={product}
                    variant={selectedProducts.includes(product) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleProduct(product)}
                  >
                    <Package className="h-3 w-3 mr-1" />
                    {product}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {/* Chart */}
          <div className="h-64">
            {productChartData && productChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productChartData}>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke={getThemeColors().grid} 
                    opacity={0.3}
                  />
                  <XAxis 
                    dataKey="date" 
                    stroke={getThemeColors().text}
                    fontSize={12}
                    tick={{ fill: getThemeColors().text, fontSize: 12 }}
                    axisLine={{ stroke: getThemeColors().text }}
                    tickLine={{ stroke: getThemeColors().text }}
                  />
                  <YAxis 
                    stroke={getThemeColors().text}
                    fontSize={12}
                    tick={{ fill: getThemeColors().text, fontSize: 12 }}
                    axisLine={{ stroke: getThemeColors().text }}
                    tickLine={{ stroke: getThemeColors().text }}
                    tickFormatter={(value) => `${value} pz`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: getThemeColors().background,
                      border: `1px solid ${getThemeColors().border}`,
                      borderRadius: '6px',
                      color: getThemeColors().text,
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: any) => [`${value} pz`, '']}
                  />
                  <Legend 
                    wrapperStyle={{ color: getThemeColors().text }}
                  />
                  {selectedProducts.map((productName, index) => (
                    <Line
                      key={productName}
                      type="monotone"
                      dataKey={productName}
                      stroke={getProductColor(index)}
                      strokeWidth={2}
                      dot={(props) => {
                        const { key, ...restProps } = props;
                        return <CustomDot key={key} {...restProps} dataKey={productName} />;
                      }}
                      activeDot={{ r: 6, fill: getProductColor(index) }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Seleziona almeno un prodotto
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
