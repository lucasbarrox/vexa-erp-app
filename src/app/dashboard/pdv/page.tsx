// src/app/dashboard/pdv/page.tsx

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import PDVInterface from './pdv-interface';

export default async function PDVPage() {
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

  // Buscar produtos com suas variantes para o PDV
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      product_variants(*)
    `);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">Erro ao carregar produtos: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <PDVInterface products={products || []} />
    </div>
  );
}
