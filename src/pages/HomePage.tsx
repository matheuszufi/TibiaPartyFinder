import { Link } from 'react-router-dom';
import { Sword, Users, Shield, Github, User, Search, Filter, MapPin, Clock, Scroll, Calendar, Crown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { AutoAd } from '../components/SimpleAd';
import { LanguageSelector } from '../components/LanguageSelector';
import { useState, useEffect } from 'react';
import { fetchBosses, fetchCreatures, getWorlds } from '../lib/tibia-api';
import { useLanguage } from '../contexts/LanguageContext';
import exivaLogo from '../assets/images/exiva.png';
import bannerExiva from '../assets/images/banner4.png';

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
  scheduledFor?: any;
  expiresAt?: any;
  members?: {
    id: string;
    character: {
      name: string;
      level: number;
      vocation: string;
    };
    joinedAt: Date;
    isLeader: boolean;
  }[];
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
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<PartyRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<PartyRoom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterWorld, setFilterWorld] = useState('all');
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);

  // Criar salas de exemplo para demonstração
  useEffect(() => {
    console.log('🎭 Carregando salas de exemplo para demonstração...');
    
    const exampleRooms: PartyRoom[] = [
      {
        id: 'example-1',
        title: 'Hunt Demons Edron 350+',
        description: 'Procurando team balanceada para hunt demons. Experiência necessária com pull e teamwork. Compartilhamos loot igualmente.',
        world: 'Antica',
        minLevel: 350,
        maxMembers: 4,
        currentMembers: 2,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
        leaderId: 'example-leader-1',
        leaderCharacter: {
          name: 'Sir Knight',
          level: 380,
          vocation: 'Elite Knight'
        },
        members: [
          {
            id: 'member-1',
            character: {
              name: 'Sir Knight',
              level: 380,
              vocation: 'Elite Knight'
            },
            joinedAt: new Date(Date.now() - 30 * 60 * 1000),
            isLeader: true
          },
          {
            id: 'member-2', 
            character: {
              name: 'Magic Sorc',
              level: 365,
              vocation: 'Master Sorcerer'
            },
            joinedAt: new Date(Date.now() - 25 * 60 * 1000),
            isLeader: false
          }
        ],
        activityType: 'hunt',
        selectedTargets: ['Demon', 'Fire Devil', 'Destroyer'],
        isScheduled: false,
        scheduledDate: null,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000) // Expira em 30 min
      },
      {
        id: 'example-2',
        title: 'Boss Abyssador - Agendado',
        description: 'Team organizada para Abyssador. Todos devem ter experiência e acesso completo. Horário confirmado para hoje às 20h.',
        world: 'Refugia',
        minLevel: 500,
        maxMembers: 5,
        currentMembers: 4,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        leaderId: 'example-leader-2',
        leaderCharacter: {
          name: 'Arch Mage',
          level: 550,
          vocation: 'Master Sorcerer'
        },
        members: [
          {
            id: 'boss-member-1',
            character: {
              name: 'Arch Mage',
              level: 550,
              vocation: 'Master Sorcerer'
            },
            joinedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
            isLeader: true
          },
          {
            id: 'boss-member-2',
            character: {
              name: 'Tank Master',
              level: 520,
              vocation: 'Elite Knight'
            },
            joinedAt: new Date(Date.now() - 90 * 60 * 1000),
            isLeader: false
          },
          {
            id: 'boss-member-3',
            character: {
              name: 'Holy Paladin',
              level: 505,
              vocation: 'Royal Paladin'
            },
            joinedAt: new Date(Date.now() - 60 * 60 * 1000),
            isLeader: false
          },
          {
            id: 'boss-member-4',
            character: {
              name: 'Elder Druid',
              level: 540,
              vocation: 'Elder Druid'
            },
            joinedAt: new Date(Date.now() - 30 * 60 * 1000),
            isLeader: false
          }
        ],
        activityType: 'boss',
        selectedTargets: ['Abyssador'],
        isScheduled: true,
        scheduledDate: new Date().toISOString().split('T')[0],
        scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000), // Agendado para 2h
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
      },
      {
        id: 'example-3',
        title: 'Quest The Secret Library',
        description: 'Fazendo quest completa da Secret Library. Precisamos de pessoas experientes para completar todos os acessos e bosses.',
        world: 'Antica',
        minLevel: 250,
        maxMembers: 4,
        currentMembers: 3,
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 min atrás
        leaderId: 'example-leader-3',
        leaderCharacter: {
          name: 'Quest Master',
          level: 380,
          vocation: 'Royal Paladin'
        },
        members: [
          {
            id: 'quest-member-1',
            character: {
              name: 'Quest Master',
              level: 380,
              vocation: 'Royal Paladin'
            },
            joinedAt: new Date(Date.now() - 45 * 60 * 1000),
            isLeader: true
          },
          {
            id: 'quest-member-2',
            character: {
              name: 'Magic Helper',
              level: 295,
              vocation: 'Elder Druid'
            },
            joinedAt: new Date(Date.now() - 30 * 60 * 1000),
            isLeader: false
          },
          {
            id: 'quest-member-3',
            character: {
              name: 'Shield Tank',
              level: 310,
              vocation: 'Elite Knight'
            },
            joinedAt: new Date(Date.now() - 15 * 60 * 1000),
            isLeader: false
          }
        ],
        activityType: 'quest',
        selectedTargets: ['Falcon Bastion'],
        isScheduled: false,
        scheduledDate: null,
        scheduledFor: null,
        expiresAt: new Date(Date.now() + 45 * 60 * 1000) // Expira em 45 min
      }
    ];

    console.log('✅ Salas de exemplo criadas:', exampleRooms.length);
    setRooms(exampleRooms);
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
        room.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    console.log(`🖼️ Buscando imagem para: ${targetName} (tipo: ${activityType})`);
    console.log(`📊 Bosses carregados: ${bosses.length}, Criaturas carregadas: ${creatures.length}`);
    
    // URLs fixas para os exemplos (caso a API não tenha carregado ainda)
    const staticImages: Record<string, string> = {
      'demon': 'https://static.tibia.com/images/library/demon.gif',
      'fire devil': 'https://static.tibia.com/images/library/firedevil.gif', 
      'destroyer': 'https://static.tibia.com/images/library/destroyer.gif',
      'abyssador': 'https://static.tibia.com/images/library/abyssador.gif'
    };
    
    // Primeiro tentar URL fixa para demonstração
    const staticUrl = staticImages[targetName.toLowerCase()];
    if (staticUrl) {
      console.log(`✅ Usando URL fixa para ${targetName}: ${staticUrl}`);
      return staticUrl;
    }
    
    if (activityType === 'boss') {
      const boss = bosses.find(b => b.name.toLowerCase() === targetName.toLowerCase());
      if (boss?.image_url) {
        console.log(`✅ Boss encontrado: ${boss.name} - URL: ${boss.image_url}`);
        return boss.image_url;
      } else {
        console.log(`❌ Boss não encontrado: ${targetName}`);
        // Tentar URL alternativa para bosses específicos
        const bossSlug = targetName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
        const alternativeUrl = `https://www.tibia.com/images/library/${bossSlug}.gif`;
        console.log(`🔄 Tentando URL alternativa para boss: ${alternativeUrl}`);
        return alternativeUrl;
      }
    } else if (activityType === 'hunt') {
      const creature = creatures.find(c => c.name.toLowerCase() === targetName.toLowerCase());
      if (creature?.image_url) {
        console.log(`✅ Criatura encontrada: ${creature.name} - URL: ${creature.image_url}`);
        return creature.image_url;
      } else {
        console.log(`❌ Criatura não encontrada: ${targetName}`);
      }
    }
    return null;
  };

  // Função para converter vocação em iniciais
  const getVocationInitials = (vocation: string): string => {
    if (!vocation) return '';
    
    const vocationMap: { [key: string]: string } = {
      'Knight': 'EK',
      'Elite Knight': 'EK',
      'Paladin': 'RP',
      'Royal Paladin': 'RP',
      'Sorcerer': 'MS',
      'Master Sorcerer': 'MS',
      'Druid': 'ED',
      'Elder Druid': 'ED'
    };

    return vocationMap[vocation] || vocation.substring(0, 2).toUpperCase();
  };

  const formatScheduledDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatScheduledTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <div className="flex items-center space-x-3">
            <LanguageSelector variant="header" />
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Link to="/login">{t('header.login')}</Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link to="/register">{t('header.register')}</Link>
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
            <Link to="/register">{t('home.startNow')}</Link>
          </Button>
        </div>

        {/* Seção de Busca e Salas */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('home.availableParties')}
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t('home.subtitle')}
            </p>
          </div>

          {/* Filtros Simplificados */}
          <Card className="bg-white shadow-sm border border-gray-200 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Filter className="h-5 w-5 mr-2" />
                {t('home.searchTitle')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Busca por texto */}
                <div>
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    <Input
                      placeholder={t('home.searchPlaceholder')}
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
                      <SelectValue placeholder={t('dashboard.activityType')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all" className="text-gray-900">{t('dashboard.allTypes')}</SelectItem>
                      <SelectItem value="hunt" className="text-gray-900">{t('dashboard.hunt')}</SelectItem>
                      <SelectItem value="boss" className="text-gray-900">{t('dashboard.boss')}</SelectItem>
                      <SelectItem value="quest" className="text-gray-900">{t('dashboard.quest')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por world */}
                <div>
                  <Select value={filterWorld} onValueChange={setFilterWorld}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder={t('dashboard.world')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 max-h-60 overflow-y-auto">
                      <SelectItem value="all" className="text-gray-900">{t('dashboard.allWorlds')}</SelectItem>
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
                    {rooms.length === 0 ? t('home.noParties') : t('home.noPartiesFilter')}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {rooms.length === 0 ? t('home.waitingMessage') : t('home.filterMessage')}
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
                      {room.description && room.description.length > 100 ? `${room.description.substring(0, 100)}...` : (room.description || 'Sem descrição')}
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
                        <div className="flex flex-wrap gap-3">
                          {room.selectedTargets.slice(0, 3).map((target, index) => {
                            const imageUrl = getTargetImageUrl(target, room.activityType!);
                            return (
                              <div key={index} className="tibia-creature-card flex flex-col items-center min-w-[85px] group">
                                {room.activityType === 'quest' ? (
                                  <div className="tibia-creature-image w-16 h-16 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-200 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <Scroll className="w-8 h-8 text-amber-600 group-hover:text-amber-700 transition-colors" />
                                  </div>
                                ) : imageUrl ? (
                                  <div className="tibia-creature-image w-16 h-16 bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-xl p-1.5 shadow-sm group-hover:shadow-md transition-all duration-300 overflow-hidden">
                                    <img 
                                      src={imageUrl} 
                                      alt={target}
                                      className="w-full h-full object-contain rounded-lg filter group-hover:scale-110 transition-transform duration-300"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const parent = target.parentElement;
                                        if (parent) {
                                          parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center"><span class="text-slate-500 text-2xl font-bold">?</span></div>';
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <div className="tibia-creature-image w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 border-2 border-slate-300 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                                    <span className="text-slate-500 text-2xl font-bold group-hover:text-slate-600 transition-colors">?</span>
                                  </div>
                                )}
                                <span className="text-xs text-gray-700 mt-2.5 max-w-20 truncate text-center font-medium group-hover:text-gray-900 transition-colors" title={target}>
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

                    {/* Seção de Membros */}
                    {room.members && room.members.length > 0 && (
                      <div className="mb-4">
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center mb-3">
                            <Users className="h-3 w-3 mr-1 text-blue-600" />
                            <span className="text-xs font-medium text-gray-700">Membros ({room.currentMembers}/{room.maxMembers})</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {/* Líder */}
                            <div className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="text-xs text-orange-800 font-medium truncate">
                                  {room.leaderCharacter?.vocation ? 
                                    getVocationInitials(room.leaderCharacter.vocation) : 'EK'} 
                                  ({room.leaderCharacter?.level || 380}) {room.leaderCharacter?.name || 'Líder'}
                                </span>
                              </div>
                            </div>
                            
                            {/* Membros */}
                            {room.members.slice(1, room.maxMembers).map((member, index) => (
                              <div key={index} className="bg-green-900/30 border border-green-500/50 rounded-lg p-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                  <span className="text-xs text-green-800 font-medium truncate">
                                    {member.character?.vocation ? 
                                      getVocationInitials(member.character.vocation) : 'MS'} 
                                    ({member.character?.level || '365'}) {member.character?.name || `Membro ${index + 1}`}
                                  </span>
                                </div>
                              </div>
                            ))}
                            
                            {/* Slots vazios */}
                            {Array.from({ length: room.maxMembers - room.currentMembers }, (_, index) => (
                              <div key={`empty-${index}`} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-2 border-dashed">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                                  <span className="text-xs text-gray-500">Vaga Livre</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{room.world}</span>
                      </div>
                      
                      {/* Informações de agendamento ou criação */}
                      {room.isScheduled && room.scheduledFor ? (
                        <div className="flex items-center text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">
                            Agendada para {formatScheduledDate(room.scheduledFor)} às {formatScheduledTime(room.scheduledFor)}
                          </span>
                          <Crown className="h-3 w-3 ml-1" />
                        </div>
                      ) : (
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Criada às {formatTime(room.createdAt)}</span>
                        </div>
                      )}
                      
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
              <CardTitle className="text-gray-900 text-xl">{t('features.findPlayers')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                {t('features.findPlayersDesc')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sword className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-gray-900 text-xl">{t('features.createParties')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                {t('features.createPartiesDesc')}
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="text-center pb-4">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900 text-xl">{t('features.safeReliable')}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600 leading-relaxed">
                {t('features.safeReliableDesc')}
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
                {t('footer.readyTitle')}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {t('footer.readyDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <Link to="/register">{t('home.cta')}</Link>
              </Button>
              <p className="text-sm text-gray-500">
                {t('footer.hasAccount')}{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 hover:underline">
                  {t('footer.loginHere')}
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
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Links do Desenvolvedor */}
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-gray-900 mb-3">{t('footer.developer')}</h3>
              <div className="space-y-2">
                <a 
                  href="https://github.com/matheuszufi" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center justify-center md:justify-start space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>{t('footer.github')}</span>
                </a>
                <a 
                  href="https://www.tibia.com/community/?name=teuzu" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors flex items-center justify-center md:justify-start space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>{t('footer.character')}</span>
                </a>
              </div>
            </div>

            {/* Links Legais */}
            <div className="text-center">
              <h3 className="font-semibold text-gray-900 mb-3">{t('footer.legal')}</h3>
              <div className="space-y-2">
                <Link 
                  to="/privacy-policy"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors block"
                >
                  {t('footer.privacy')}
                </Link>
                <Link 
                  to="/terms-of-service"
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors block"
                >
                  {t('footer.terms')}
                </Link>
              </div>
            </div>

            {/* Sobre o Projeto */}
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-gray-900 mb-3">{t('footer.about')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>{t('footer.aboutDescription')}</p>
                <p>{t('footer.aboutSince')}</p>
                <p className="text-xs">
                  {t('footer.copyright')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}