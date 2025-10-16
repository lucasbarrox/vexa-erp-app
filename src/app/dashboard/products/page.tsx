// src/app/dashboard/products/page.tsx

import { cookies } from 'next/headers';
import Link from 'next/link';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import { Button } from '@/components/ui/button';
import ProductsTable from './products-table';

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
    }
  );

  const { data: products, error } = await supabase.from('products').select('*');

  if (error) {
    return <p>Ocorreu um erro ao buscar os produtos: {error.message}</p>;
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gerenciamento de Produtos</h1>
        <Button asChild>
          <Link href="/dashboard/products/new">Novo Produto</Link>
        </Button>
      </div>
      <ProductsTable products={products ?? []} />
    </div>
  );
}