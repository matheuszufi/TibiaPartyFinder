import { Link } from 'react-router-dom';
import { Sword, Users, Shield, Github, User, Search, Filter, MapPin, Clock, Scroll } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AutoAd } from '../components/SimpleAd';
import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { fetchBosses, fetchCreatures, getWorlds } from '../lib/tibia-api';
import exivaLogo from '../assets/images/exiva.png';
import bannerExiva from '../assets/images/bannerexiva.png';

interface PartyRoom {
  id: string;
  title: string;
  description: string;
  world: string;
  minLevel: number;
  maxMembers: number;
  currentMembers: number;
  createdAt: any;
  leaderId: string;
  leaderCharacter: any;
  activityType?: string;
  selectedTargets?: string[];
  isScheduled?: boolean;
  scheduledDate?: any;
}

interface Boss {
  name: string;
  image_url: string;
}

interface Creature {
  name: string;
  image_url: string;
}

interface World {
  name: string;
  location: string;
  players_online: number;
}

export default function HomePage() {
  const [rooms, setRooms] = useState<PartyRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<PartyRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterWorld, setFilterWorld] = useState('all');
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);

  // Carregar salas do Firebase
  useEffect(() => {
    const q = query(
      collection(db, 'rooms'),
      orderBy('createdAt', 'desc'),
      limit(20) // Limitar a 20 salas para homepage
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data
        };
      }) as PartyRoom[];
      setRooms(roomsData);
    });

    return () => unsubscribe();
  }, []);

  // Carregar dados da API do Tibia
  useEffect(() => {
    const loadTibiaData = async () => {
      try {
        const [bossesData, creaturesData, worldsData] = await Promise.all([
          fetchBosses(),
          fetchCreatures(),
          getWorlds()
        ]);
        setBosses(bossesData);
        setCreatures(creaturesData);
        setWorlds(worldsData);
      } catch (error) {
        console.error('Erro ao carregar dados da API do Tibia:', error);
      }
    };

    loadTibiaData();
  }, []);

  // Filtrar salas
  useEffect(() => {
    let filtered = rooms;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (room.selectedTargets && room.selectedTargets.some(target => 
          target.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(room => {
        const roomType = room.activityType || '';
        return roomType.toLowerCase() === filterType.toLowerCase();
      });
    }

    // Filtro por world
    if (filterWorld !== 'all') {
      filtered = filtered.filter(room => room.world === filterWorld);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, filterType, filterWorld]);

  // Função para obter a URL da imagem de uma criatura/boss
  const getTargetImageUrl = (targetName: string, activityType: string): string | null => {
    if (activityType === 'boss') {
      const boss = bosses.find(b => b.name.toLowerCase() === targetName.toLowerCase());
      return boss?.image_url || null;
    } else if (activityType === 'hunt') {
      const creature = creatures.find(c => c.name.toLowerCase() === targetName.toLowerCase());
      return creature?.image_url || null;
    }
    return null;
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
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

        {/* Seção de Busca e Salas */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Parties Disponíveis
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja algumas das parties ativas no momento. Cadastre-se para solicitar entrada e participar!
            </p>
          </div>

          {/* Filtros Simplificados */}
          <Card className="bg-white shadow-sm border border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Filter className="h-5 w-5 mr-2" />
                Buscar Parties
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca por texto */}
                <div>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder="Buscar parties..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Tipo de Atividade" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all" className="text-gray-900">Todos os Tipos</SelectItem>
                      <SelectItem value="hunt" className="text-gray-900">Hunt</SelectItem>
                      <SelectItem value="boss" className="text-gray-900">Boss</SelectItem>
                      <SelectItem value="quest" className="text-gray-900">Quest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por world */}
                <div>
                  <Select value={filterWorld} onValueChange={setFilterWorld}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="World" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
                      <SelectItem value="all" className="text-gray-900">Todos os Worlds</SelectItem>
                      {worlds.length > 0 && worlds
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((world) => (
                          <SelectItem key={world.name} value={world.name} className="text-gray-900">
                            {world.name} ({world.location}) - {world.players_online} online
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de Salas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredRooms.length === 0 ? (
              <Card className="col-span-full bg-white shadow-sm border border-gray-200">
                <CardContent className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {rooms.length === 0 ? 'Nenhuma party encontrada.' : 'Nenhuma party corresponde aos filtros.'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {rooms.length === 0 ? 'Aguarde novos jogadores criarem parties!' : 'Tente ajustar os filtros de busca.'}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredRooms.slice(0, 9).map((room) => ( // Mostrar até 9 salas
                <Card key={room.id} className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between text-gray-900">
                      <span className="truncate mr-2">{room.title}</span>
                      <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {room.currentMembers}/{room.maxMembers}
                      </span>
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {room.description.length > 100 ? `${room.description.substring(0, 100)}...` : room.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Exibição dos GIFs das criaturas/bosses selecionados */}
                    {room.activityType && room.selectedTargets && room.selectedTargets.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {room.activityType === 'boss' ? 'Bosses:' : 
                             room.activityType === 'hunt' ? 'Criaturas:' : 'Quests:'}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {room.selectedTargets.slice(0, 3).map((target, index) => {
                            const imageUrl = getTargetImageUrl(target, room.activityType!);
                            return (
                              <div key={index} className="flex flex-col items-center min-w-[60px]">
                                {room.activityType === 'quest' ? (
                                  <div className="w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-lg flex items-center justify-center">
                                    <Scroll className="w-6 h-6 text-amber-600" />
                                  </div>
                                ) : imageUrl ? (
                                  <div className="w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-lg p-1">
                                    <img 
                                      src={imageUrl} 
                                      alt={target}
                                      className="w-full h-full object-contain rounded"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.innerHTML = '<div class="w-full h-full bg-slate-200 rounded flex items-center justify-center"><span class="text-slate-500 text-lg">?</span></div>';
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-slate-300 rounded-lg flex items-center justify-center">
                                    <span className="text-slate-500 text-lg">?</span>
                                  </div>
                                )}
                                <span className="text-xs text-gray-700 mt-1 max-w-16 truncate text-center" title={target}>
                                  {target}
                                </span>
                              </div>
                            );
                          })}
                          {room.selectedTargets.length > 3 && (
                            <div className="flex items-center text-xs text-gray-500">
                              +{room.selectedTargets.length - 3} mais
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{room.world}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Criada às {formatTime(room.createdAt)}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>Level mínimo: {room.minLevel}</span>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Link to="/register">
                          Cadastre-se para Participar
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Ver mais parties */}
          {filteredRooms.length > 9 && (
            <div className="text-center mt-8">
              <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                <Link to="/register">
                  Ver Todas as Parties ({filteredRooms.length})
                </Link>
              </Button>
            </div>
          )}
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