'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Product = Database['public']['Tables']['products']['Row'];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<Partial<Product>>({});
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        setError('Não foi possível carregar os dados do produto.');
        console.error(error);
      } else if (data) {
        setProduct(data);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const { error } = await supabase
      .from('products')
      .update({
        name: product.name,
        reference: product.reference,
        price: product.price,
        cost_price: product.cost_price,
      })
      .eq('id', productId); 

    if (error) {
      setError(`Erro ao atualizar produto: ${error.message}`);
    } else {
      router.push('/dashboard/products');
      router.refresh();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const isNumeric = e.target.type === 'number';
    setProduct(prev => ({ ...prev, [id]: isNumeric ? parseFloat(value) : value }));
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Editar Produto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" required value={product.name ?? ''} onChange={handleInputChange} />
            </div>
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="reference">Referência</Label>
              <Input id="reference" required value={product.reference ?? ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input id="price" type="number" step="0.01" required value={product.price ?? ''} onChange={handleInputChange} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cost_price">Preço de Custo (R$)</Label>
              <Input id="cost_price" type="number" step="0.01" required value={product.cost_price ?? ''} onChange={handleInputChange} />
            </div>
            {error && <p className="col-span-2 text-sm font-medium text-red-500">{error}</p>}
            <div className="col-span-2 flex justify-end gap-2 mt-4">
              <Button variant="outline" type="button" onClick={() => router.push('/dashboard/products')}>Cancelar</Button>
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}