import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Calendar, Trophy, Swords, Crown, UserCheck, UserX } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface JoinRequest {
  userId: string;
  characterName: string;
  characterLevel?: number;
  characterVocation?: string;
  characterGuild?: string | null;
  characterWorld?: string;
  requestedAt: any;
  userEmail: string;
}

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
  createdAt: any;
  members: string[];
  isActive: boolean;
  memberCharacters?: { [userId: string]: {
    characterName: string;
    characterLevel?: number;
    characterVocation?: string;
    characterGuild?: string | null;
    characterWorld?: string;
  }};
  joinRequests?: JoinRequest[];
  leaderCharacter?: {
    name: string;
    level: number;
    vocation: string;
    guild?: string | { name: string; rank: string };
  };
}

export default function MyRoomsPage() {
  const [user] = useAuthState(auth);
  const [myRooms, setMyRooms] = useState<PartyRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'rooms'),
      where('createdBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const roomsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as PartyRoom[];

      setMyRooms(roomsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleApproveRequest = async (roomId: string, request: JoinRequest) => {
    try {
      console.log('=== INÍCIO DO PROCESSO DE APROVAÇÃO ===');
      const roomRef = doc(db, 'rooms', roomId);
      
      // Primeiro, ler os dados atuais da sala
      const roomDoc = await getDoc(roomRef);
      const currentData = roomDoc.data();
      
      console.log('Dados atuais da sala antes da aprovação:', currentData);

      // Preparar dados do membro - REMOVENDO campos undefined
      const memberData: any = {
        characterName: request.characterName || 'Nome não informado'
      };

      // Adicionar campos apenas se não forem undefined/null
      if (request.characterLevel !== undefined && request.characterLevel !== null) {
        memberData.characterLevel = request.characterLevel;
      }
      
      if (request.characterVocation && request.characterVocation !== undefined) {
        memberData.characterVocation = request.characterVocation;
      }
      
      if (request.characterGuild && request.characterGuild !== undefined && request.characterGuild !== null) {
        memberData.characterGuild = request.characterGuild;
      }
      
      if (request.characterWorld && request.characterWorld !== undefined) {
        memberData.characterWorld = request.characterWorld;
      }

      console.log('Dados do membro limpos (sem undefined):', {
        userId: request.userId,
        memberData
      });

      // Preparar novos dados completos
      const currentMemberCharacters = currentData?.memberCharacters || {};
      const newMemberCharacters = {
        ...currentMemberCharacters,
        [request.userId]: memberData
      };

      console.log('memberCharacters após merge:', newMemberCharacters);

      // Fazer a atualização
      const updates = {
        members: arrayUnion(request.userId),
        memberCharacters: newMemberCharacters,
        joinRequests: arrayRemove(request),
        currentMembers: (currentData?.currentMembers || 0) + 1
      };

      console.log('Updates finais a serem aplicados:', updates);

      await updateDoc(roomRef, updates);

      // Verificar se foi salvo corretamente
      const verifyDoc = await getDoc(roomRef);
      const verifyData = verifyDoc.data();
      console.log('Verificação pós-salvamento:', {
        members: verifyData?.members,
        memberCharacters: verifyData?.memberCharacters,
        memberCharactersKeys: verifyData?.memberCharacters ? Object.keys(verifyData.memberCharacters) : 'undefined'
      });

      console.log('=== APROVAÇÃO CONCLUÍDA COM SUCESSO ===');
    } catch (error) {
      console.error('=== ERRO NA APROVAÇÃO ===', error);
    }
  };

  const handleRejectRequest = async (roomId: string, request: JoinRequest) => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      
      // Apenas remover da lista de solicitações
      await updateDoc(roomRef, {
        joinRequests: arrayRemove(request)
      });
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
    }
  };

  const getHuntTypeIcon = (type: string) => {
    switch (type) {
      case 'hunt': return <Swords className="h-4 w-4" />;
      case 'quest': return <Trophy className="h-4 w-4" />;
      case 'boss': return <Crown className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getHuntTypeColor = (type: string) => {
    switch (type) {
      case 'hunt': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'quest': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'boss': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="mt-4">Carregando suas salas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Minhas Salas</h1>
          <p className="text-white/80">Gerencie suas parties e solicitações de entrada</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {myRooms.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Nenhuma sala criada</h2>
            <p className="text-gray-500">Você ainda não criou nenhuma party.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myRooms.map((room) => (
              <Card key={room.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{room.title}</CardTitle>
                      <p className="text-gray-400 text-sm mt-1">{room.description}</p>
                    </div>
                    <Badge className={`ml-2 ${getHuntTypeColor(room.huntType)}`}>
                      <div className="flex items-center gap-1">
                        {getHuntTypeIcon(room.huntType)}
                        <span className="capitalize">{room.huntType}</span>
                      </div>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Informações da sala */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Level Range</p>
                      <p className="text-white">{room.minLevel} - {room.maxLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Membros</p>
                      <p className="text-white">{room.currentMembers}/{room.maxMembers}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Mundo</p>
                      <p className="text-white">{room.world}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <Badge className={room.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}>
                        {room.isActive ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                  </div>

                  {/* Vocações necessárias */}
                  {room.requiredVocations.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Vocações necessárias:</p>
                      <div className="flex flex-wrap gap-1">
                        {room.requiredVocations.map((vocation) => (
                          <Badge key={vocation} className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {vocation}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Solicitações pendentes */}
                  {room.joinRequests && room.joinRequests.length > 0 && (
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-yellow-400 text-sm font-medium mb-3">
                        Solicitações pendentes ({room.joinRequests.length})
                      </p>
                      <div className="space-y-3">
                        {room.joinRequests.map((request, index) => (
                          <div key={index} className="bg-gray-800/50 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-white font-medium">{request.characterName}</p>
                                  {request.characterLevel && request.characterVocation && (
                                    <Badge className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      Level {request.characterLevel} {request.characterVocation}
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-xs text-gray-400 space-y-1">
                                  <p>{request.userEmail}</p>
                                  {request.characterWorld && (
                                    <p>Mundo: {request.characterWorld}</p>
                                  )}
                                  {request.characterGuild && (
                                    <p>Guild: {request.characterGuild}</p>
                                  )}
                                  <p>Solicitado em: {request.requestedAt?.toDate?.()?.toLocaleString() || 'Data não disponível'}</p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2 ml-3">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveRequest(room.id, request)}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 h-8"
                                >
                                  <UserCheck className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectRequest(room.id, request)}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 px-3 py-1 h-8"
                                >
                                  <UserX className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Data de criação */}
                  <div className="flex items-center gap-2 text-gray-400 text-xs pt-2 border-t border-gray-700">
                    <Calendar className="h-3 w-3" />
                    <span>Criada em {room.createdAt?.toDate?.()?.toLocaleDateString() || 'Data não disponível'}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
