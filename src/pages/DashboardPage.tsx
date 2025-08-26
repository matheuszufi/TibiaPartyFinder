import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { collection, query, onSnapshot, doc, getDoc, orderBy, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { fetchBosses, fetchCreatures, type Boss, type Creature } from '../lib/tibia-api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { JoinRequestModal } from '../components/JoinRequestModal';
import { Sword, LogOut, Plus, Users, Clock, MapPin, Search, Filter, Eye, UserPlus, CheckCircle, Scroll } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface local para resolver problema de importação
interface PartyRoom {
  id: string;
  title: string;
  description: string;
  huntType?: string; // Deprecated - mantido para compatibilidade
  activityType?: string;
  selectedTargets?: string[];
  minLevel: number;
  maxLevel: number;
  maxMembers: number;
  currentMembers: number;
  requiredVocations: string[];
  world: string;
  createdBy: string;
  createdAt: any; // Firebase Timestamp
  members: string[];
  isActive: boolean;
  memberCharacters?: { [userId: string]: {
    characterName: string;
    characterLevel?: number;
    characterVocation?: string;
    characterGuild?: string | null;
    characterWorld?: string;
  }};
  joinRequests?: Array<{
    userId: string;
    characterName: string;
    characterLevel?: number;
    characterVocation?: string;
    characterGuild?: string | null;
    characterWorld?: string;
    requestedAt: any;
    userEmail: string;
  }>;
  leaderCharacter?: {
    name: string;
    level: number;
    vocation: string;
    guild?: string | { name: string; rank: string };
  };
}

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<any>(null);
  const [rooms, setRooms] = useState<PartyRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<PartyRoom[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Estados para dados da API
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  
  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all-levels');
  const [filterWorld, setFilterWorld] = useState('all');

  // Estados para modal de solicitação
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    console.log('DashboardPage useEffect - user:', user);
    if (user) {
      // Buscar dados do usuário
      const fetchUserData = async () => {
        try {
          console.log('Buscando dados do usuário:', user.uid);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            console.log('Dados do usuário encontrados:', userDoc.data());
            setUserData(userDoc.data());
          } else {
            console.log('Usuário não encontrado no Firestore, criando dados padrão');
            // Se não existir dados no Firestore, criar dados padrão
            const defaultUserData = {
              email: user.email,
              characterName: 'Personagem',
              level: 1,
              vocation: 'Sorcerer',
              world: 'Antica',
              createdAt: new Date()
            };
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          // Definir dados padrão em caso de erro
          const defaultUserData = {
            email: user.email,
            characterName: 'Personagem',
            level: 1,
            vocation: 'Sorcerer',
            world: 'Antica',
            createdAt: new Date()
          };
          setUserData(defaultUserData);
        }
      };
      fetchUserData();

      // Escutar mudanças nas salas do mundo do usuário
      const q = query(
        collection(db, 'rooms'),
        orderBy('createdAt', 'desc')
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const roomsData = snapshot.docs.map(doc => {
          const data = doc.data();
          console.log(`=== ROOM ${doc.id} FIREBASE DATA ===`);
          console.log('Full raw data:', data);
          console.log('memberCharacters field:', data.memberCharacters);
          console.log('memberCharacters type:', typeof data.memberCharacters);
          console.log('All field keys:', Object.keys(data));
          console.log('members field:', data.members);
          console.log('================================');
          return {
            id: doc.id,
            ...data
          };
        }) as PartyRoom[];
        console.log('Final rooms array:', roomsData);
        setRooms(roomsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Carregar dados da API do Tibia
  useEffect(() => {
    const loadTibiaData = async () => {
      try {
        const [bossesData, creaturesData] = await Promise.all([
          fetchBosses(),
          fetchCreatures()
        ]);
        setBosses(bossesData);
        setCreatures(creaturesData);
      } catch (error) {
        console.error('Erro ao carregar dados da API do Tibia:', error);
      }
    };

    loadTibiaData();
  }, []);

  // Função para obter a URL da imagem de uma criatura/boss
  const getTargetImageUrl = (targetName: string, activityType: string): string | null => {
    console.log(`Buscando imagem para: "${targetName}" (tipo: ${activityType})`);
    
    if (activityType === 'boss') {
      const boss = bosses.find(b => b.name.toLowerCase() === targetName.toLowerCase());
      console.log(`Boss encontrado:`, boss);
      return boss?.image_url || null;
    } else if (activityType === 'hunt') {
      const creature = creatures.find(c => c.name.toLowerCase() === targetName.toLowerCase());
      console.log(`Criatura encontrada:`, creature);
      console.log(`Total de criaturas carregadas:`, creatures.length);
      
      // Log das primeiras criaturas para debug
      if (creatures.length > 0) {
        console.log('Primeiras 5 criaturas:', creatures.slice(0, 5).map(c => c.name));
        
        // Buscar criaturas que contenham "cobra" no nome
        const cobraCreatures = creatures.filter(c => c.name.toLowerCase().includes('cobra'));
        console.log('Criaturas com "cobra" no nome:', cobraCreatures.map(c => c.name));
      }
      
      return creature?.image_url || null;
    }
    return null;
  };

  // Efeito para filtrar salas
  useEffect(() => {
    let filtered = rooms;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(room =>
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (filterType !== 'all') {
      filtered = filtered.filter(room => {
        const roomType = room.activityType || room.huntType || '';
        return roomType.toLowerCase() === filterType.toLowerCase();
      });
    }

    // Filtro por level
    if (filterLevel === 'my-level' && userData) {
      const userLevel = userData.level || 1;
      filtered = filtered.filter(room => 
        userLevel >= room.minLevel && userLevel <= room.maxLevel
      );
    }

    // Filtro por world
    if (filterWorld !== 'all' && userData) {
      const userWorld = userData.world || '';
      if (filterWorld === 'my-world') {
        filtered = filtered.filter(room => room.world === userWorld);
      }
    }

    setFilteredRooms(filtered);
  }, [rooms, searchTerm, filterType, filterLevel, filterWorld, userData]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleJoinRequest = async (roomId: string, roomTitle: string) => {
    if (!user) return;

    // Verificar se o usuário já está em alguma sala
    const userCurrentRoom = rooms.find(room => room.members?.includes(user.uid));
    
    if (userCurrentRoom) {
      const confirmLeave = confirm(
        `Você já está na party "${userCurrentRoom.title}". Para entrar em uma nova party, você precisa sair da atual. Deseja sair da party atual?`
      );
      
      if (confirmLeave) {
        try {
          // Sair da sala atual
          const currentRoomRef = doc(db, 'rooms', userCurrentRoom.id);
          const currentRoomDoc = await getDoc(currentRoomRef);
          const currentData = currentRoomDoc.data();

          if (currentData) {
            const updatedMembers = currentData.members.filter((id: string) => id !== user.uid);
            const updatedMemberCharacters = { ...currentData.memberCharacters };
            delete updatedMemberCharacters[user.uid];

            await updateDoc(currentRoomRef, {
              members: updatedMembers,
              memberCharacters: updatedMemberCharacters,
              currentMembers: updatedMembers.length
            });

            // Após sair da sala atual, abrir modal para nova sala
            setSelectedRoom({ id: roomId, title: roomTitle });
            setShowJoinModal(true);
          }
        } catch (error) {
          console.error('Erro ao sair da sala atual:', error);
          alert('Erro ao sair da sala atual. Tente novamente.');
        }
      }
    } else {
      // Usuário não está em nenhuma sala, pode entrar diretamente
      setSelectedRoom({ id: roomId, title: roomTitle });
      setShowJoinModal(true);
    }
  };

  const handleViewParty = (_roomId: string) => {
    // Navegar para página "Minhas Salas" ou mostrar detalhes da party
    window.location.href = '/my-rooms';
  };

  const hasUserRequestedJoin = (room: PartyRoom) => {
    if (!user?.uid || !room.joinRequests) return false;
    return room.joinRequests.some(request => request.userId === user.uid);
  };

  const isUserMember = (room: PartyRoom) => {
    if (!user?.uid || !room.members) return false;
    return room.members.includes(user.uid);
  };

  const hasUserCreatedRoom = () => {
    if (!user?.uid) return false;
    return rooms.some(room => room.createdBy === user.uid);
  };

  const handleCreateRoom = () => {
    if (hasUserCreatedRoom()) {
      alert('Você já criou uma sala. Cada usuário pode criar apenas uma sala por vez. Vá para "Minhas Parties" para gerenciar sua sala atual.');
      return;
    }
    setShowCreateModal(true);
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

  const renderPartySlots = (room: PartyRoom) => {
    const slots = [];
    const maxMembers = room.maxMembers;
    
    console.log('Rendering party slots for room:', room.id, {
      members: room.members,
      memberCharacters: room.memberCharacters,
      currentMembers: room.currentMembers
    });
    
    // Adicionar o líder como primeiro slot
    slots.push(
      <div key="leader" className="bg-orange-900/30 border border-orange-500/50 rounded-lg p-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
          {room.leaderCharacter ? (
            <span className="text-xs text-white font-medium truncate">
              {getVocationInitials(room.leaderCharacter.vocation || '')} ({room.leaderCharacter.level || 'N/A'}) {room.leaderCharacter.name || 'N/A'}
            </span>
          ) : (
            <span className="text-xs text-gray-300">Info N/A</span>
          )}
        </div>
      </div>
    );

    // Adicionar slots dos membros (excluindo o líder)
    const memberSlots = maxMembers - 1; // -1 porque o líder já ocupa um slot
    const actualMembers = room.members ? room.members.length - 1 : 0; // -1 para excluir o líder da contagem
    
    for (let i = 0; i < memberSlots; i++) {
      const isEmpty = i >= actualMembers; 
      
      if (isEmpty) {
        // Slot vazio
        slots.push(
          <div key={`empty-${i}`} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-2 border-dashed">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-xs text-gray-500">Vaga Livre</span>
            </div>
          </div>
        );
      } else {
        // Slot ocupado - buscar dados do membro (i+1 porque o líder está na posição 0)
        const memberId = room.members[i + 1];
        const memberInfo = room.memberCharacters?.[memberId];
        
        console.log(`Member slot ${i}:`, {
          memberId,
          memberInfo,
          allMemberCharacters: room.memberCharacters,
          memberCharactersKeys: room.memberCharacters ? Object.keys(room.memberCharacters) : 'undefined',
          roomData: room
        });
        
        // Tentar diferentes métodos para encontrar os dados do membro
        let finalMemberInfo = memberInfo;
        
        if (!finalMemberInfo && room.memberCharacters) {
          // Método alternativo: verificar se o memberId está em alguma chave
          const foundKey = Object.keys(room.memberCharacters).find(key => 
            key === memberId || key.includes(memberId) || memberId.includes(key)
          );
          if (foundKey) {
            finalMemberInfo = room.memberCharacters[foundKey];
            console.log(`Found member data with alternative key: ${foundKey}`, finalMemberInfo);
          }
        }
        
        slots.push(
          <div key={`member-${i}`} className="bg-green-900/30 border border-green-500/50 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              {finalMemberInfo ? (
                <span className="text-xs text-white font-medium truncate">
                  {getVocationInitials(finalMemberInfo.characterVocation || '')} ({finalMemberInfo.characterLevel || 'N/A'}) {finalMemberInfo.characterName || 'N/A'}
                </span>
              ) : (
                <span className="text-xs text-gray-300">Dados não encontrados</span>
              )}
            </div>
          </div>
        );
      }
    }

    return slots;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Sword className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">
                {userData.characterName} - Level {userData.level} {userData.vocation} ({userData.world})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/my-rooms">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                <Users className="h-4 w-4 mr-2" />
                Minhas Salas
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header com Filtros */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Parties Disponíveis</h2>
            {hasUserCreatedRoom() ? (
              <Button
                disabled
                className="bg-gray-300 text-gray-600 cursor-not-allowed"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Você já criou uma party
              </Button>
            ) : (
              <Button
                onClick={handleCreateRoom}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Party
              </Button>
            )}
          </div>

          {/* Filtros */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Filter className="h-5 w-5 mr-2" />
                Filtros de Busca
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                      <SelectValue placeholder="Tipo de Hunt" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all" className="text-gray-900">Todos os Tipos</SelectItem>
                      <SelectItem value="EXP Hunt" className="text-gray-900">EXP Hunt</SelectItem>
                      <SelectItem value="Profit Hunt" className="text-gray-900">Profit Hunt</SelectItem>
                      <SelectItem value="Boss Hunt" className="text-gray-900">Boss Hunt</SelectItem>
                      <SelectItem value="Quest" className="text-gray-900">Quest</SelectItem>
                      <SelectItem value="Task" className="text-gray-900">Task</SelectItem>
                      <SelectItem value="Bestiary" className="text-gray-900">Bestiary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por level */}
                <div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="Filtro Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all-levels" className="text-gray-900">Todos os Levels</SelectItem>
                      <SelectItem value="my-level" className="text-gray-900">Meu Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por world */}
                <div>
                  <Select value={filterWorld} onValueChange={setFilterWorld}>
                    <SelectTrigger className="bg-gray-50 border-gray-300 focus:border-blue-500">
                      <SelectValue placeholder="World" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all" className="text-gray-900">Todos os Worlds</SelectItem>
                      <SelectItem value="my-world" className="text-gray-900">Meu World</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rooms Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.length === 0 ? (
            <Card className="col-span-full bg-white shadow-sm border border-gray-200">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {rooms.length === 0 ? 'Nenhuma party encontrada.' : 'Nenhuma party corresponde aos filtros.'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {rooms.length === 0 ? 'Seja o primeiro a criar uma party!' : 'Tente ajustar os filtros de busca.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRooms.map((room) => (
              <Card key={room.id} className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900">
                    <span>{room.title}</span>
                    <span className="text-sm font-normal text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {room.currentMembers}/{room.maxMembers}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {room.description}
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
                        {room.selectedTargets.map((target, index) => {
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
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-blue-600 font-medium">
                      <span>{room.activityType || room.huntType}</span>
                    </div>
                    
                    {/* Seção de Vagas da Party */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-3">
                      <div className="flex items-center mb-3">
                        <Users className="h-3 w-3 mr-1 text-blue-600" />
                        <span className="text-xs font-medium text-gray-700">Membros ({room.currentMembers}/{room.maxMembers})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {renderPartySlots(room)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{room.world}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Level {room.minLevel}-{room.maxLevel}</span>
                    </div>
                    {room.requiredVocations && room.requiredVocations.length > 0 && (
                      <div className="flex items-center text-gray-600">
                        <span className="text-xs">Vocações: {room.requiredVocations.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-2" />
                      <span>Criado às {formatTime(room.createdAt)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {room.createdBy === user?.uid ? (
                      // Botão para o criador da sala
                      <Button 
                        onClick={() => handleViewParty(room.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Party
                      </Button>
                    ) : isUserMember(room) ? (
                      // Botão quando já é membro
                      <Button 
                        disabled
                        className="w-full bg-green-100 text-green-700 cursor-not-allowed"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Você está na Party
                      </Button>
                    ) : hasUserRequestedJoin(room) ? (
                      // Botão quando já solicitou entrada
                      <Button 
                        disabled
                        className="w-full bg-yellow-100 text-yellow-700 cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Aguardando Resposta do Líder
                      </Button>
                    ) : (
                      // Botão para solicitar entrada
                      <Button 
                        onClick={() => handleJoinRequest(room.id, room.title)}
                        className="w-full"
                        disabled={room.currentMembers >= room.maxMembers}
                        variant={room.currentMembers >= room.maxMembers ? "secondary" : "default"}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        {room.currentMembers >= room.maxMembers ? 'Party Cheia' : 'Solicitar Entrada'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {selectedRoom && (
        <JoinRequestModal
          isOpen={showJoinModal}
          onClose={() => {
            setShowJoinModal(false);
            setSelectedRoom(null);
          }}
          roomId={selectedRoom.id}
          roomTitle={selectedRoom.title}
        />
      )}
    </div>
  );
}
