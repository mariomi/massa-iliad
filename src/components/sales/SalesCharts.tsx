'use client';

import { memo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SalesStats } from '@/lib/demo-data/demo-service';
import { LineCharts } from './LineCharts';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Store,
  CreditCard,
  Package
} from 'lucide-react';

interface SalesChartsProps {
  stats: SalesStats;
  refreshTrigger?: number;
}

export const SalesCharts = memo(function SalesCharts({ stats, refreshTrigger }: SalesChartsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500', 
      'bg-yellow-500',
      'bg-red-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    return colors[index % colors.length];
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash':
        return 'bg-green-500';
      case 'card':
        return 'bg-blue-500';
      case 'digital':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const maxCategoryRevenue = Math.max(...Object.values(stats.salesByCategory));
  const maxStoreRevenue = Math.max(...Object.values(stats.salesByStore).map(s => s.revenue));
  const maxPaymentRevenue = Math.max(...Object.values(stats.salesByPaymentMethod));

  return (
    <div className="space-y-6">
      {/* Line Charts */}
      <LineCharts refreshTrigger={refreshTrigger} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Category - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Vendite per Categoria
            </CardTitle>
            <CardDescription>Ricavi per categoria di prodotto</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.salesByCategory)
                .sort(([,a], [,b]) => b - a)
                .map(([category, revenue], index) => {
                  const percentage = (revenue / maxCategoryRevenue) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-gray-100">{category}</span>
                        </div>
                        <span className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(revenue)}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getCategoryColor(index)}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage.toFixed(1)}% del totale
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

      {/* Payment Methods - Pie Chart Style */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Metodi di Pagamento
          </CardTitle>
          <CardDescription>Distribuzione dei pagamenti</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.salesByPaymentMethod)
              .sort(([,a], [,b]) => b - a)
              .map(([method, amount], index) => {
                const percentage = (amount / maxPaymentRevenue) * 100;
                const totalRevenue = Object.values(stats.salesByPaymentMethod).reduce((a, b) => a + b, 0);
                const methodPercentage = (amount / totalRevenue) * 100;
                
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{method}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 dark:text-gray-100">{formatCurrency(amount)}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{methodPercentage.toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getPaymentMethodColor(method)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
});
