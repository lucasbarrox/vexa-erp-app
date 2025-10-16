'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

import DashboardLayout from '@/components/shared/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Definindo o tipo para um novo produto, baseado nos nossos tipos gerados
type ProductInsert = Database['public']['Tables']['products']['Insert'];

export default function NewProductPage() {
  // Estado para cada campo do formulário
  const [name, setName] = useState('');
  const [reference, setReference] = useState('');
  const [price, setPrice] = useState('');
  const [costPrice, setCostPrice] = useState('');

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    // Cria o objeto a ser inserido, convertendo os preços para número
    const newProduct: ProductInsert = {
      name,
      reference,
      price: parseFloat(price),
      cost_price: parseFloat(costPrice),
    };

    // Usa o cliente Supabase para inserir o novo produto
    const { error } = await supabase.from('products').insert(newProduct);

    if (error) {
      setError(`Erro ao criar produto: ${error.message}`);
    } else {
      // Se for bem-sucedido, redireciona de volta para a lista de produtos
      router.push('/dashboard/products');
      router.refresh(); // Força a atualização dos dados na página de listagem
    }
  };

  return (
    <DashboardLayout
      title="Cadastrar Novo Produto"
      description="Preencha os dados abaixo para adicionar um novo produto ao catálogo"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg mx-4">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastrar Novo Produto</CardTitle>
          <CardDescription>
            Preencha os dados abaixo para adicionar um novo produto ao catálogo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="name">Nome do Produto</Label>
              <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="col-span-2 grid gap-2">
              <Label htmlFor="reference">Referência</Label>
              <Input id="reference" required value={reference} onChange={(e) => setReference(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Preço de Venda (R$)</Label>
              <Input id="price" type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="costPrice">Preço de Custo (R$)</Label>
              <Input id="costPrice" type="number" step="0.01" required value={costPrice} onChange={(e) => setCostPrice(e.target.value)} />
            </div>
            
            {error && <p className="col-span-2 text-sm font-medium text-red-500">{error}</p>}
            
            <div className="col-span-2 flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" onClick={() => router.push('/dashboard/products')}>Cancelar</Button>
                <Button type="submit">Salvar Produto</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
    </DashboardLayout>
  );
}