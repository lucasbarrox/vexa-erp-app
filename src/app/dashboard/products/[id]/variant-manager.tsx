// src/app/dashboard/products/[id]/variant-manager.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreHorizontal, ArrowLeft, Package, Edit, Trash2 } from 'lucide-react';

// Extraímos os tipos do nosso arquivo gerado para facilitar
type ProductWithVariants = Database['public']['Tables']['products']['Row'] & {
  product_variants: Database['public']['Tables']['product_variants']['Row'][];
};
type VariantInsert = Database['public']['Tables']['product_variants']['Insert'];
type Variant = Database['public']['Tables']['product_variants']['Row'];

export default function VariantManager({ product }: { product: ProductWithVariants }) {
  const router = useRouter();
  // Estados para o formulário de nova variante
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState<Variant | null>(null);

  const handleAddVariant = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const newVariant: VariantInsert = {
      product_id: product.id, // Associamos a variante ao produto atual
      size: size.trim(),
      color: color.trim(),
      quantity,
    };

    const { error } = await supabase.from('product_variants').insert(newVariant);

    if (error) {
      setError(`Erro ao criar variante: ${error.message}`);
    } else {
      // Limpa o formulário e recarrega os dados da página
      setSize('');
      setColor('');
      setQuantity(0);
      router.refresh();
    }
    
    setIsLoading(false);
  };

  const handleDeleteVariant = async () => {
    if (!variantToDelete) return;

    const { error } = await supabase
      .from('product_variants')
      .delete()
      .eq('id', variantToDelete.id);

    if (error) {
      setError(`Erro ao excluir variante: ${error.message}`);
    } else {
      setVariantToDelete(null);
      router.refresh();
    }
  };

  // Calcula o estoque total
  const totalStock = product.product_variants.reduce((sum, variant) => sum + variant.quantity, 0);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/products" className="flex items-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar para Produtos</span>
            </Link>
          </Button>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/products/${product.id}/edit`} className="flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Editar Produto</span>
          </Link>
        </Button>
      </div>

      {/* Informações do Produto */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription>Referência: {product.reference}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Preço de Custo</p>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.cost_price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Preço de Venda</p>
              <p className="text-lg font-semibold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Margem de Lucro</p>
              <p className="text-lg font-semibold text-green-600">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price - product.cost_price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estoque Total</p>
              <p className="text-lg font-semibold">{totalStock} unidades</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário para Adicionar Nova Variante */}
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Nova Variante</CardTitle>
          <CardDescription>
            Cadastre novos tamanhos, cores e quantidades para este produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddVariant} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="size">Tamanho</Label>
              <Input 
                id="size" 
                placeholder="P, M, G, 42..." 
                required 
                value={size} 
                onChange={(e) => setSize(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Cor</Label>
              <Input 
                id="color" 
                placeholder="Preto, Azul, Estampado..." 
                required 
                value={color} 
                onChange={(e) => setColor(e.target.value)} 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input 
                id="quantity" 
                type="number" 
                min="0"
                required 
                value={quantity} 
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 0)} 
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? 'Adicionando...' : 'Adicionar Variante'}
            </Button>
          </form>
          {error && <p className="text-sm font-medium text-red-500 mt-4">{error}</p>}
        </CardContent>
      </Card>

      {/* Tabela para Listar Variantes Existentes */}
      <Card>
        <CardHeader>
          <CardTitle>Variantes e Estoque</CardTitle>
          <CardDescription>
            Gerencie as variações de tamanho, cor e quantidade do produto
          </CardDescription>
        </CardHeader>
        <CardContent>
          {product.product_variants.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tamanho</TableHead>
                  <TableHead>Cor</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {product.product_variants.map((variant) => (
                  <TableRow key={variant.id}>
                    <TableCell className="font-medium">{variant.size}</TableCell>
                    <TableCell>{variant.color}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        variant.quantity === 0 
                          ? 'bg-red-100 text-red-800' 
                          : variant.quantity < 10 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {variant.quantity} {variant.quantity === 1 ? 'unidade' : 'unidades'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-500"
                            onSelect={() => setVariantToDelete(variant)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma variante cadastrada para este produto.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Use o formulário acima para adicionar a primeira variante.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Confirmação de Exclusão */}
      <AlertDialog open={!!variantToDelete} onOpenChange={() => setVariantToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Variante</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a variante <span className="font-bold">
                {variantToDelete?.size} - {variantToDelete?.color}
              </span>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteVariant} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
