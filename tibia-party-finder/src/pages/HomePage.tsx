import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Users, Search, Calendar, Shield, Crown, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">TibiaPartyFinder</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button>Registrar</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Encontre seu <span className="text-blue-600">grupo perfeito</span> para aventuras em Tibia
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Conecte-se com outros jogadores, crie salas para quests, bosses e hunts. 
              A plataforma definitiva para formar equipes em Tibia.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Começar Agora
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Como funciona</h3>
            <p className="text-lg text-gray-600">
              Simples, rápido e eficiente para encontrar seu time ideal
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Search className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Busque seu Personagem</CardTitle>
                <CardDescription>
                  Use a API oficial do Tibia para verificar seu personagem e mundo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Conecte-se usando informações reais do seu personagem para maior confiabilidade
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Crie ou Entre em Salas</CardTitle>
                <CardDescription>
                  Configure equipes para quests, bosses ou hunts com vocações específicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Defina o número de jogadores e quais vocações você precisa para sua aventura
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                  <Calendar className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Organize Aventuras</CardTitle>
                <CardDescription>
                  Coordene horários e estratégias com sua equipe
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Planeje suas sessões de jogo e maximize seus resultados em grupo
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Tipos de Atividades</h3>
            <p className="text-lg text-gray-600">
              Encontre grupos para qualquer tipo de aventura em Tibia
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="bg-blue-50 border-blue-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Search className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-blue-900">Quests</CardTitle>
                </div>
                <CardDescription className="text-blue-700">
                  Desde Annihilator até Wrath of the Emperor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• The Inquisition Quest</li>
                  <li>• Demon Oak Quest</li>
                  <li>• The Secret Library</li>
                  <li>• Heart of Destruction</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-500 rounded-lg">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-red-900">Bosses</CardTitle>
                </div>
                <CardDescription className="text-red-700">
                  Desafie os bosses mais poderosos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• Ferumbras</li>
                  <li>• Morgaroth</li>
                  <li>• Orshabaal</li>
                  <li>• Ghazbaran</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-green-900">Hunts</CardTitle>
                </div>
                <CardDescription className="text-green-700">
                  Maximize EXP e profit em grupo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Roshamuul Bridge</li>
                  <li>• Asura Palace</li>
                  <li>• Prison -1</li>
                  <li>• Falcon Bastion</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">
              Pronto para sua próxima aventura?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Junte-se a milhares de jogadores que já encontraram seus grupos perfeitos
            </p>
            <Link to="/register">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100">
                Criar Conta Gratuita
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-semibold">TibiaPartyFinder</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                Projeto não oficial. Tibia é marca registrada da CipSoft GmbH.
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Dados fornecidos pela TibiaData API
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
