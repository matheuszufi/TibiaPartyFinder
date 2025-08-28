import { Link } from 'react-router-dom';
import { Sword, Users, Shield, Github, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AutoAd } from '../components/SimpleAd';
import exivaLogo from '../assets/images/exiva.png';
import bannerExiva from '../assets/images/bannerexiva.png';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgb(17, 24, 31)' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-lg flex items-center justify-center">
              <img src={exivaLogo} alt="Exiva" className="h-20 w-20" />
            </div>
          </div>
          <div className="space-x-3">
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/register">Cadastrar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="mb-8">
            <img 
              src={bannerExiva} 
              alt="Exiva - Party Finder" 
              className="mx-auto max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
            <Link to="/register">Começar Agora</Link>
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Encontre Jogadores</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Descubra outros jogadores do seu world e nivel para formar groups incríveis.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sword className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Crie Parties</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Monte seu próprio grupo especificando level, vocação e objetivos da hunt.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900 text-xl">Seguro & Confiável</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                Validação automática de personagens e sistema de reputação para uma experiência segura.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Anúncio após as funcionalidades */}
        <div className="mt-12 text-center">
          <AutoAd className="max-w-4xl mx-auto" />
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                Pronto para Aventurar?
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Junte-se à nossa comunidade e comece a formar parties épicas hoje mesmo!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/register">Criar Conta Grátis</Link>
              </Button>
              <p className="text-sm text-gray-500">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                  Faça login aqui
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Anúncio antes do footer */}
      <div className="mt-16 text-center bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <p className="text-xs text-gray-500 mb-4">PUBLICIDADE</p>
          <AutoAd className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex justify-center space-x-6 mb-4">
            <a 
              href="https://github.com/matheuszufi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center space-x-2"
            >
              <Github className="h-4 w-4" />
              <span>GitHub do Desenvolvedor</span>
            </a>
            <a 
              href="https://www.tibia.com/community/?name=teuzu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Personagem no Tibia</span>
            </a>
          </div>
          <p className="text-gray-500">
            © 2024 Exiva. Não afiliado oficialmente com Tibia ou CipSoft GmbH.
          </p>
        </div>
      </footer>
    </div>
  );
}