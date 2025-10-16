import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, BarChart3, Smartphone, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Vexa ERP</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Começar Grátis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Gerencie seu negócio com{" "}
            <span className="text-blue-600">inteligência</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            O Vexa ERP é a solução completa para pequenos e médios negócios. 
            Controle produtos, vendas e estoque de forma simples e eficiente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">
                Começar Agora - Grátis
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">
                Já tenho conta
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Funcionalidades pensadas especialmente para o seu tipo de negócio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Package className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Gestão de Produtos</CardTitle>
              <CardDescription>
                Controle completo do seu catálogo com variações, preços e estoque
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <BarChart3 className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Relatórios Inteligentes</CardTitle>
              <CardDescription>
                Dashboards e relatórios que ajudam na tomada de decisões
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <CardTitle>Gestão de Clientes</CardTitle>
              <CardDescription>
                Mantenha o histórico completo dos seus clientes e vendas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Smartphone className="w-12 h-12 text-orange-600 mb-4" />
              <CardTitle>Mobile First</CardTitle>
              <CardDescription>
                Acesse seu negócio de qualquer lugar, em qualquer dispositivo
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-red-600 mb-4" />
              <CardTitle>Seguro e Confiável</CardTitle>
              <CardDescription>
                Seus dados protegidos com criptografia de ponta e backups automáticos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <Zap className="w-12 h-12 text-yellow-600 mb-4" />
              <CardTitle>Rápido e Simples</CardTitle>
              <CardDescription>
                Interface intuitiva que você aprende a usar em minutos
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a centenas de empreendedores que já usam o Vexa ERP 
            para crescer seus negócios.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/signup">
              Começar Agora - É Grátis
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Vexa ERP</span>
            </div>
            <div className="text-slate-400 text-center md:text-right">
              <p>&copy; 2024 Vexa ERP. Todos os direitos reservados.</p>
              <p className="text-sm mt-1">Feito com ❤️ para empreendedores brasileiros</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
