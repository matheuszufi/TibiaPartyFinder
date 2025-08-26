import { Link } from 'react-router-dom';
import { Sword, Users, Shield } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sword className="h-8 w-8 text-yellow-400" />
            <h1 className="text-2xl font-bold text-white">Tibia Party Finder</h1>
          </div>
          <div className="space-x-4">
            <Button asChild variant="ghost" className="text-white hover:bg-white/10">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-yellow-600 hover:bg-yellow-700 text-black">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Encontre Sua Party Perfeita
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Conecte-se com outros jogadores, crie grupos para hunts, quests e aventuras épicas no mundo de Tibia.
          </p>
          <Button asChild size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-8 py-4 text-lg">
            <Link to="/register">Começar Agora</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Encontre Jogadores</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Descubra outros jogadores do seu world e nivel para formar groups incríveis.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Sword className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Crie Parties</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Monte seu próprio grupo especificando level, vocação e objetivos da hunt.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <CardTitle className="text-white">Seguro & Confiável</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300 text-center">
                Validação automática de personagens e sistema de reputação para uma experiência segura.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="bg-black/40 border-white/20 backdrop-blur-sm max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Pronto para Aventurar?</CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Junte-se à nossa comunidade e comece a formar parties épicas hoje mesmo!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild size="lg" className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                <Link to="/register">Criar Conta Grátis</Link>
              </Button>
              <p className="text-sm text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-yellow-400 hover:text-yellow-300 underline">
                  Faça login aqui
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-gray-400">
            © 2024 Tibia Party Finder. Não afiliado oficialmente com Tibia ou CipSoft GmbH.
          </p>
        </div>
      </footer>
    </div>
  );
}
