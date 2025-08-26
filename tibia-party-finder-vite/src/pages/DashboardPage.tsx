import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { collection, query, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { CreateRoomModal } from '../components/CreateRoomModal';
import { JoinRequestModal } from '../components/JoinRequestModal';
import { Sword, LogOut, Plus, Users, Clock, MapPin, Search, Filter, Eye, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

// Interface local para resolver problema de importação
interface PartyRoom {
  id: string;
  title: string;
  description: string;
  huntType: string;
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
      filtered = filtered.filter(room => 
        room.huntType.toLowerCase() === filterType.toLowerCase()
      );
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

  const handleJoinRequest = (roomId: string, roomTitle: string) => {
    setSelectedRoom({ id: roomId, title: roomTitle });
    setShowJoinModal(true);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Sword className="h-8 w-8 text-yellow-400" />
            <div>
              <h1 className="text-xl font-bold text-white">Dashboard</h1>
              <p className="text-sm text-gray-300">
                {userData.characterName} - Level {userData.level} {userData.vocation} ({userData.world})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/my-rooms">
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
              >
                <Users className="h-4 w-4 mr-2" />
                Minhas Salas
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white hover:bg-white/10"
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
            <h2 className="text-2xl font-bold text-white">Parties Disponíveis</h2>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Party
            </Button>
          </div>

          {/* Filtros */}
          <Card className="bg-black/30 border-white/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
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
                      className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por tipo */}
                <div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue placeholder="Tipo de Hunt" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Todos os Tipos</SelectItem>
                      <SelectItem value="EXP Hunt" className="text-white hover:bg-white/10">EXP Hunt</SelectItem>
                      <SelectItem value="Profit Hunt" className="text-white hover:bg-white/10">Profit Hunt</SelectItem>
                      <SelectItem value="Boss Hunt" className="text-white hover:bg-white/10">Boss Hunt</SelectItem>
                      <SelectItem value="Quest" className="text-white hover:bg-white/10">Quest</SelectItem>
                      <SelectItem value="Task" className="text-white hover:bg-white/10">Task</SelectItem>
                      <SelectItem value="Bestiary" className="text-white hover:bg-white/10">Bestiary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por level */}
                <div>
                  <Select value={filterLevel} onValueChange={setFilterLevel}>
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue placeholder="Filtro Level" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="all-levels" className="text-white hover:bg-white/10">Todos os Levels</SelectItem>
                      <SelectItem value="my-level" className="text-white hover:bg-white/10">Meu Level</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtro por world */}
                <div>
                  <Select value={filterWorld} onValueChange={setFilterWorld}>
                    <SelectTrigger className="bg-black/20 border-white/20 text-white">
                      <SelectValue placeholder="World" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-white/20">
                      <SelectItem value="all" className="text-white hover:bg-white/10">Todos os Worlds</SelectItem>
                      <SelectItem value="my-world" className="text-white hover:bg-white/10">Meu World</SelectItem>
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
            <Card className="col-span-full bg-black/30 border-white/20 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">
                  {rooms.length === 0 ? 'Nenhuma party encontrada.' : 'Nenhuma party corresponde aos filtros.'}
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  {rooms.length === 0 ? 'Seja o primeiro a criar uma party!' : 'Tente ajustar os filtros de busca.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRooms.map((room) => (
              <Card key={room.id} className="bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <span>{room.title}</span>
                    <span className="text-sm font-normal text-gray-300">
                      {room.currentMembers}/{room.maxMembers}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {room.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-yellow-400">
                      <span className="font-semibold">{room.huntType}</span>
                    </div>
                    
                    {/* Seção de Vagas da Party */}
                    <div className="bg-gray-900/30 border border-gray-600/30 rounded p-3 mb-3">
                      <div className="flex items-center text-gray-300 mb-3">
                        <Users className="h-3 w-3 mr-1" />
                        <span className="text-xs font-medium">Membros ({room.currentMembers}/{room.maxMembers})</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                        {renderPartySlots(room)}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-gray-300">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{room.world}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>Level {room.minLevel}-{room.maxLevel}</span>
                    </div>
                    {room.requiredVocations && room.requiredVocations.length > 0 && (
                      <div className="flex items-center text-gray-300">
                        <span className="text-xs">Vocações: {room.requiredVocations.join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-400 text-xs">
                      <Clock className="h-3 w-3 mr-2" />
                      <span>Criado às {formatTime(room.createdAt)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    {room.createdBy === user?.uid ? (
                      // Botão para o criador da sala
                      <Button 
                        onClick={() => handleViewParty(room.id)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Party
                      </Button>
                    ) : isUserMember(room) ? (
                      // Botão quando já é membro
                      <Button 
                        disabled
                        className="w-full bg-green-600/50 text-green-200 cursor-not-allowed"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Você está na Party
                      </Button>
                    ) : hasUserRequestedJoin(room) ? (
                      // Botão quando já solicitou entrada
                      <Button 
                        disabled
                        className="w-full bg-yellow-600/50 text-yellow-200 cursor-not-allowed"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Aguardando Resposta do Líder
                      </Button>
                    ) : (
                      // Botão para solicitar entrada
                      <Button 
                        onClick={() => handleJoinRequest(room.id, room.title)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={room.currentMembers >= room.maxMembers}
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
