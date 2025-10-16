// src/app/dashboard/pdv/pdv-interface.tsx

'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { Database } from '@/lib/supabase/database.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard,
  Receipt,
  Package
} from 'lucide-react';

// Tipos
type ProductWithVariants = Database['public']['Tables']['products']['Row'] & {
  product_variants: Database['public']['Tables']['product_variants']['Row'][];
};
type Variant = Database['public']['Tables']['product_variants']['Row'];

// Tipo para item no carrinho
interface CartItem {
  variant: Variant;
  product: Database['public']['Tables']['products']['Row'];
  quantity: number;
  price: number;
}

export default function PDVInterface({ products }: { products: ProductWithVariants[] }) {
  const router = useRouter();
  
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filtrar produtos baseado na busca
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    
    const term = searchTerm.toLowerCase();
    return products.filter(product => 
      product.name?.toLowerCase().includes(term) ||
      product.reference?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Adicionar item ao carrinho
  const addToCart = (variant: Variant, product: Database['public']['Tables']['products']['Row']) => {
    if (variant.quantity <= 0) {
      alert('Produto fora de estoque!');
      return;
    }

    setCart(prev => {
      const existingItem = prev.find(item => item.variant.id === variant.id);
      
      if (existingItem) {
        // Verificar se não excede o estoque
        if (existingItem.quantity >= variant.quantity) {
          alert('Quantidade não disponível em estoque!');
          return prev;
        }
        return prev.map(item =>
          item.variant.id === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, {
          variant,
          product,
          quantity: 1,
          price: product.price
        }];
      }
    });
  };

  // Remover item do carrinho
  const removeFromCart = (variantId: string) => {
    setCart(prev => prev.filter(item => item.variant.id !== variantId));
  };

  // Atualizar quantidade no carrinho
  const updateQuantity = (variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(variantId);
      return;
    }

    const cartItem = cart.find(item => item.variant.id === variantId);
    if (cartItem && newQuantity > cartItem.variant.quantity) {
      alert('Quantidade não disponível em estoque!');
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.variant.id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Calcular total do carrinho
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  // Finalizar venda
  const finalizeSale = async () => {
    if (cart.length === 0) {
      alert('Carrinho vazio!');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Criar a venda
      const { data: sale, error: saleError } = await supabase
        .from('sales')
        .insert({
          total_amount: cartTotal,
          sale_date: new Date().toISOString()
        })
        .select()
        .single();

      if (saleError) throw saleError;

      // Criar os itens da venda e atualizar estoque
      for (const item of cart) {
        // Inserir item da venda
        const { error: itemError } = await supabase
          .from('sale_items')
          .insert({
            sale_id: sale.id,
            product_variant_id: item.variant.id,
            quantity: item.quantity,
            price: item.price
          });

        if (itemError) throw itemError;

        // Atualizar estoque (baixa)
        const { error: stockError } = await supabase
          .from('product_variants')
          .update({ 
            quantity: item.variant.quantity - item.quantity 
          })
          .eq('id', item.variant.id);

        if (stockError) throw stockError;
      }

      // Limpar carrinho e mostrar sucesso
      setCart([]);
      alert(`Venda finalizada com sucesso! Total: ${new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(cartTotal)}`);
      
      // Redirecionar para página de vendas
      router.push('/dashboard/sales');

    } catch (error) {
      console.error('Erro ao finalizar venda:', error);
      alert('Erro ao finalizar venda. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Ponto de Venda
        </h1>
        <p className="text-slate-600">
          Selecione produtos e realize vendas de forma rápida e eficiente
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Área de Busca e Produtos */}
        <div className="lg:col-span-2 space-y-4">
          {/* Campo de Busca */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="w-5 h-5" />
                <span>Buscar Produtos</span>
              </CardTitle>
              <CardDescription>
                Digite o nome ou referência do produto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Ex: Camiseta, REF-001..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </CardContent>
          </Card>

          {/* Lista de Produtos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>Produtos Disponíveis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-slate-600">Ref: {product.reference}</p>
                        <p className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(product.price)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Variantes */}
                    <div className="space-y-2">
                      {product.product_variants.map((variant) => (
                        <div key={variant.id} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="font-medium">
                                {variant.size} / {variant.color}
                              </span>
                              <Badge 
                                variant={variant.quantity > 0 ? "default" : "destructive"}
                                className="ml-2"
                              >
                                {variant.quantity} em estoque
                              </Badge>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => addToCart(variant, product)}
                            disabled={variant.quantity <= 0}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                
                {filteredProducts.length === 0 && (
                  <p className="text-center text-slate-500 py-8">
                    Nenhum produto encontrado
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carrinho de Vendas */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Carrinho de Vendas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">Carrinho vazio</p>
                  <p className="text-sm text-slate-400">Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Itens do Carrinho */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.variant.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{item.product.name}</h4>
                            <p className="text-xs text-slate-600">
                              {item.variant.size} / {item.variant.color}
                            </p>
                            <p className="text-sm font-semibold text-green-600">
                              {new Intl.NumberFormat('pt-BR', { 
                                style: 'currency', 
                                currency: 'BRL' 
                              }).format(item.price)}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFromCart(item.variant.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        {/* Controles de Quantidade */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                              disabled={item.quantity >= item.variant.quantity}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            {new Intl.NumberFormat('pt-BR', { 
                              style: 'currency', 
                              currency: 'BRL' 
                            }).format(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Total e Botão de Finalizar */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(cartTotal)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={finalizeSale}
                      disabled={isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <Receipt className="w-4 h-4 mr-2 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Finalizar Venda
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
