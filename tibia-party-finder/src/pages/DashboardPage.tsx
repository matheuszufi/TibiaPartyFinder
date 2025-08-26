import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import CreateRoomModal from '../components/CreateRoomModal';
import { Room } from '../types';
import { Plus, Search, Filter, Users, Clock, Shield, LogOut } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'quest' | 'boss' | 'hunt'>('all');
  const [filterWorld, setFilterWorld] = useState<string>('all');
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Mock data para demonstração
  const mockRooms: Room[] = [
    {
      id: '1',
      title: 'Inquisition Quest Team',
      description: 'Looking for experienced players for Inquisition Quest',
      createdBy: 'user1',
      createdAt: new Date(),
      world: 'Antica',
      activity: { type: 'quest', name: 'The Inquisition Quest' },
      maxPlayers: 4,
      currentPlayers: 2,
      requiredVocations: [
        { vocation: 'knight', count: 1, filled: 1 },
        { vocation: 'paladin', count: 1, filled: 0 },
        { vocation: 'druid', count: 1, filled: 1 },
        { vocation: 'sorcerer', count: 1, filled: 0 }
      ],
      players: [],
      status: 'open'
    },
    {
      id: '2',
      title: 'Ferumbras Hunt',
      description: 'High level boss hunt. Level 200+ only',
      createdBy: 'user2',
      createdAt: new Date(),
      world: 'Refugia',
      activity: { type: 'boss', name: 'Ferumbras' },
      maxPlayers: 5,
      currentPlayers: 3,
      requiredVocations: [
        { vocation: 'knight', count: 1, filled: 1 },
        { vocation: 'paladin', count: 2, filled: 1 },
        { vocation: 'druid', count: 1, filled: 1 },
        { vocation: 'sorcerer', count: 1, filled: 0 }
      ],
      players: [],
      status: 'open'
    },
    {
      id: '3',
      title: 'Roshamuul Bridge EXP',
      description: 'Fast EXP hunting session',
      createdBy: 'user3',
      createdAt: new Date(),
      world: 'Antica',
      activity: { type: 'hunt', name: 'Roshamuul Bridge' },
      maxPlayers: 4,
      currentPlayers: 4,
      requiredVocations: [
        { vocation: 'knight', count: 1, filled: 1 },
        { vocation: 'paladin', count: 1, filled: 1 },
        { vocation: 'druid', count: 1, filled: 1 },
        { vocation: 'sorcerer', count: 1, filled: 1 }
      ],
      players: [],
      status: 'full'
    }
  ];

  useEffect(() => {
    setRooms(mockRooms);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCreateRoom = (roomData: any) => {
    const newRoom: Room = {
      id: Date.now().toString(),
      title: roomData.title,
      description: roomData.description,
      createdBy: user?.uid || '',
      createdAt: new Date(),
      world: roomData.world,
      activity: roomData.activity,
      maxPlayers: roomData.maxPlayers,
      currentPlayers: 1,
      requiredVocations: roomData.requiredVocations,
      players: [],
      status: 'open'
    };
    
    setRooms([newRoom, ...rooms]);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.activity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.activity.type === filterType;
    const matchesWorld = filterWorld === 'all' || room.world === filterWorld;
    
    return matchesSearch && matchesType && matchesWorld;
  });

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'quest': return 'bg-blue-100 text-blue-800';
      case 'boss': return 'bg-red-100 text-red-800';
      case 'hunt': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'full': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVocationIcon = (vocation: string) => {
    // Você pode adicionar ícones específicos para cada vocação aqui
    return '⚔️';
  };

  const worlds = Array.from(new Set(rooms.map(room => room.world)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">TibiaPartyFinder</h1>
              </div>
              <div className="text-sm text-gray-600">
                Bem-vindo, {user?.displayName || user?.email}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Criar Sala</span>
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar salas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="quest">Quests</SelectItem>
                <SelectItem value="boss">Bosses</SelectItem>
                <SelectItem value="hunt">Hunts</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterWorld} onValueChange={setFilterWorld}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Mundo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {worlds.map(world => (
                  <SelectItem key={world} value={world}>{world}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{room.title}</CardTitle>
                  <div className="flex space-x-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(room.activity.type)}`}>
                      {room.activity.type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                </div>
                <CardDescription>{room.activity.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {room.description && (
                    <p className="text-sm text-gray-600">{room.description}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{room.currentPlayers}/{room.maxPlayers}</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">{room.world}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs text-gray-600 font-medium">Vocações necessárias:</div>
                    <div className="flex flex-wrap gap-1">
                      {room.requiredVocations.map((req, index) => (
                        <div key={index} className="flex items-center space-x-1 text-xs">
                          <span>{getVocationIcon(req.vocation)}</span>
                          <span className={`px-2 py-1 rounded ${req.filled >= req.count ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                            {req.vocation.charAt(0).toUpperCase() + req.vocation.slice(1)} ({req.filled}/{req.count})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                    </div>
                    <Button size="sm" disabled={room.status === 'full' || room.status === 'closed'}>
                      {room.status === 'full' ? 'Lotada' : 'Solicitar'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma sala encontrada</p>
              <p className="text-sm">Que tal criar uma nova sala?</p>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Sala
            </Button>
          </div>
        )}
      </div>

      <CreateRoomModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default DashboardPage;
