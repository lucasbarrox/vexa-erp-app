import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function ProductsPage() {
  const cookieStore = cookies();

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        },
      },
    },
  );

  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    return <p>Ocorreu um erro ao buscar os produtos: {error.message}</p>;
  }

  return (
    <div>
      <div className="p-4 md:p-6"> 
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">Novo Produto</Link>
        </Button>
      </div>
      <Table>
        <TableCaption>Uma lista dos seus produtos cadastrados.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Nome</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead className="text-right">Preço de Venda</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.reference}</TableCell>
              <TableCell className="text-right">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(product.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </div>
  );
}