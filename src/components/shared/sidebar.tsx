// src/components/shared/sidebar.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  TrendingUp,
  AlertTriangle,
  Menu,
  X,
  Home,
  Receipt,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      current: pathname === '/dashboard'
    },
    {
      name: 'Ponto de Venda',
      href: '/dashboard/pdv',
      icon: ShoppingCart,
      current: pathname === '/dashboard/pdv'
    },
    {
      name: 'Produtos',
      href: '/dashboard/products',
      icon: Package,
      current: pathname.startsWith('/dashboard/products')
    },
    {
      name: 'Vendas',
      href: '/dashboard/sales',
      icon: Receipt,
      current: pathname.startsWith('/dashboard/sales')
    },
    {
      name: 'Clientes',
      href: '/dashboard/customers',
      icon: Users,
      current: pathname.startsWith('/dashboard/customers')
    },
    {
      name: 'Relatórios',
      href: '/dashboard/reports',
      icon: BarChart3,
      current: pathname.startsWith('/dashboard/reports')
    },
    {
      name: 'Alertas',
      href: '/dashboard/alerts',
      icon: AlertTriangle,
      current: pathname.startsWith('/dashboard/alerts')
    }
  ];

  const handleLogout = async () => {
    // Importação dinâmica para evitar problemas de SSR
    const { supabase } = await import('@/lib/supabase/client');
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300",
      isCollapsed ? "w-16" : "w-64",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Vexa ERP</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2"
        >
          {isCollapsed ? (
            <Menu className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                item.current
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 flex-shrink-0",
                item.current ? "text-blue-600" : "text-slate-400"
              )} />
              {!isCollapsed && (
                <span className="truncate">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Sair</span>}
        </Button>
      </div>
    </div>
  );
}
