'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMe } from '@/lib/auth/useMe';
import { demoDataService, DemoSale } from '@/lib/demo-data/demo-service';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Calculator } from 'lucide-react';

export default function NewSalePage() {
  const { me, loading } = useMe();
  const router = useRouter();
  const [formData, setFormData] = useState({
    store_id: '',
    user_id: '',
    product_name: '',
    category: '',
    quantity: 1,
    unit_price: 0,
    total_amount: 0,
    sale_date: new Date().toISOString().slice(0, 16),
    payment_method: 'card' as 'cash' | 'card' | 'digital'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && me) {
      if (me.role !== 'admin') {
        router.push('/dashboard');
        return;
      }
    }
  }, [me, loading, router]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate total amount
      if (field === 'quantity' || field === 'unit_price') {
        updated.total_amount = Number(updated.quantity) * Number(updated.unit_price);
      }
      
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const newSale: Omit<DemoSale, 'id' | 'created_at'> = {
        ...formData,
        sale_date: new Date(formData.sale_date).toISOString()
      };

      demoDataService.addSale(newSale);
      
      // Redirect to sales page
      router.push('/sales');
    } catch (error) {
      console.error('Error saving sale:', error);
      alert('Errore nel salvare la vendita');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

  const stores = demoDataService.getAllStores();
  const users = demoDataService.getAllUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/sales')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Torna alle Vendite
        </Button>
        <PageHeader
          title="Nuova Vendita"
          description="Inserisci una nuova vendita nel sistema"
        />
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Dettagli Vendita</CardTitle>
          <CardDescription>
            Compila tutti i campi per registrare la vendita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Store Selection */}
            <div className="space-y-2">
              <Label htmlFor="store_id">Negozio *</Label>
              <select
                id="store_id"
                value={formData.store_id}
                onChange={(e) => handleInputChange('store_id', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleziona un negozio</option>
                {stores.map(store => (
                  <option key={store.id} value={store.id}>
                    {store.name} - {store.address}
                  </option>
                ))}
              </select>
            </div>

            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user_id">Venditore *</Label>
              <select
                id="user_id"
                value={formData.user_id}
                onChange={(e) => handleInputChange('user_id', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleziona un venditore</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Name */}
            <div className="space-y-2">
              <Label htmlFor="product_name">Nome Prodotto *</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => handleInputChange('product_name', e.target.value)}
                placeholder="es. iPhone 15 Pro"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleziona una categoria</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Laptop">Laptop</option>
                <option value="Tablet">Tablet</option>
                <option value="Smartwatch">Smartwatch</option>
                <option value="Accessori">Accessori</option>
                <option value="Altro">Altro</option>
              </select>
            </div>

            {/* Quantity and Unit Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantità *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit_price">Prezzo Unitario (€) *</Label>
                <Input
                  id="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unit_price}
                  onChange={(e) => handleInputChange('unit_price', parseFloat(e.target.value) || 0)}
                  required
                />
              </div>
            </div>

            {/* Total Amount (Auto-calculated) */}
            <div className="space-y-2">
              <Label htmlFor="total_amount">Totale (€)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  readOnly
                  className="bg-gray-50"
                />
                <Calculator className="h-4 w-4 text-gray-500" />
              </div>
              <p className="text-sm text-gray-600">
                Calcolato automaticamente: {formData.quantity} × €{formData.unit_price}
              </p>
            </div>

            {/* Sale Date */}
            <div className="space-y-2">
              <Label htmlFor="sale_date">Data e Ora Vendita *</Label>
              <Input
                id="sale_date"
                type="datetime-local"
                value={formData.sale_date}
                onChange={(e) => handleInputChange('sale_date', e.target.value)}
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="payment_method">Metodo di Pagamento *</Label>
              <select
                id="payment_method"
                value={formData.payment_method}
                onChange={(e) => handleInputChange('payment_method', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="cash">Contanti</option>
                <option value="card">Carta di Credito/Debito</option>
                <option value="digital">Pagamento Digitale</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Salvando...' : 'Salva Vendita'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push('/sales')}
              >
                Annulla
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
