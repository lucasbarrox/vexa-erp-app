'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  LogOut,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600 mt-1">
                {user ? `Bem-vindo, ${user.email}!` : 'Carregando...'}
              </p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Ponto de Venda */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/pdv">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-blue-600" />
                  </div>
                  <span>Ponto de Venda</span>
                </CardTitle>
                <CardDescription>
                  Realize vendas rapidamente com controle automático de estoque
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Busca rápida de produtos</p>
                  <p>• Carrinho inteligente</p>
                  <p>• Baixa automática no estoque</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Gestão de Produtos */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/products">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-600" />
                  </div>
                  <span>Produtos</span>
                </CardTitle>
                <CardDescription>
                  Gerencie seu catálogo de produtos e variantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Cadastro de produtos</p>
                  <p>• Controle de variantes</p>
                  <p>• Ajuste de estoque</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Vendas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/sales">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <span>Vendas</span>
                </CardTitle>
                <CardDescription>
                  Histórico completo de todas as transações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Histórico de vendas</p>
                  <p>• Detalhes das transações</p>
                  <p>• Relatórios de performance</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Clientes */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/customers">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="w-6 h-6 text-orange-600" />
                  </div>
                  <span>Clientes</span>
                </CardTitle>
                <CardDescription>
                  Gerencie seu relacionamento com clientes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Cadastro de clientes</p>
                  <p>• Histórico de compras</p>
                  <p>• CRM básico</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Relatórios */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/reports">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-indigo-600" />
                  </div>
                  <span>Relatórios</span>
                </CardTitle>
                <CardDescription>
                  Análises e insights do seu negócio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Vendas por período</p>
                  <p>• Produtos mais vendidos</p>
                  <p>• Análise de estoque</p>
                </div>
              </CardContent>
            </Link>
          </Card>

          {/* Alertas */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/dashboard/alerts">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <span>Alertas</span>
                </CardTitle>
                <CardDescription>
                  Produtos com estoque baixo e notificações
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600">
                  <p>• Estoque baixo</p>
                  <p>• Produtos em falta</p>
                  <p>• Notificações importantes</p>
                </div>
              </CardContent>
            </Link>
          </Card>

        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Resumo Rápido</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Vendas Hoje</p>
                    <p className="text-2xl font-bold">R$ 0,00</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Produtos</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Estoque Baixo</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Ticket Médio</p>
                    <p className="text-2xl font-bold">R$ 0,00</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}