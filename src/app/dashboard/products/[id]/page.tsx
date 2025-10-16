// src/app/dashboard/products/[id]/page.tsx

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';
import { notFound } from 'next/navigation';
import VariantManager from './variant-manager'; // Nosso futuro Client Component

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { 
      cookies: { 
        async get(name: string) {
          return (await cookieStore).get(name)?.value;
        }
      } 
    },
  );

  // Resolve the params promise
  const resolvedParams = await params;

  // A MÁGICA ESTÁ AQUI:
  // Fazemos uma única query para buscar o produto E suas variantes relacionadas.
  const { data: product, error } = await supabase
    .from('products')
    .select('*, product_variants(*)') // 1. Pega tudo do produto E tudo das variantes relacionadas
    .eq('id', resolvedParams.id) // 2. Onde o ID do produto corresponde ao da URL
    .single(); // 3. E esperamos apenas um resultado

  if (error || !product) {
    notFound(); // Se o produto não existe, mostra uma página 404.
  }

  // A página (Server Component) delega a interatividade para o VariantManager (Client Component)
  return <VariantManager product={product} />;
}
