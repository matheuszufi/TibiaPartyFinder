import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, getDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Users, Calendar, MapPin, Clock, UserCheck, UserX, Eye, Trash2, UserMinus, LogOut } from 'lucide-react';
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
  requiredVocations?: string[];
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
  isOwner?: boolean;
}

export default function MyRoomsPage() {
  const [user] = useAuthState(auth);
  const [myRooms, setMyRooms] = useState<(PartyRoom & { isOwner: boolean })[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        // Tentar diferentes métodos para encontrar os dados do membro
        let finalMemberInfo = memberInfo;
        
        if (!finalMemberInfo && room.memberCharacters) {
          // Método alternativo: verificar se o memberId está em alguma chave
          const foundKey = Object.keys(room.memberCharacters).find(key => 
            key === memberId || key.includes(memberId) || memberId.includes(key)
          );
          if (foundKey) {
            finalMemberInfo = room.memberCharacters[foundKey];
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

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Data não disponível';
    try {
      return timestamp.toDate().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Data não disponível';
    }
  };

  useEffect(() => {
    if (!user) return;

    // Query para salas criadas pelo usuário
    const createdRoomsQuery = query(
      collection(db, 'rooms'),
      where('createdBy', '==', user.uid)
    );

    // Query para salas onde o usuário é membro
    const memberRoomsQuery = query(
      collection(db, 'rooms'),
      where('members', 'array-contains', user.uid)
    );

    const unsubscribeCreated = onSnapshot(createdRoomsQuery, (snapshot) => {
      const createdRooms = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        isOwner: true
      })) as (PartyRoom & { isOwner: boolean })[];

      const unsubscribeMember = onSnapshot(memberRoomsQuery, (memberSnapshot) => {
        const memberRooms = memberSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          isOwner: false
        })) as (PartyRoom & { isOwner: boolean })[];

        // Combinar as salas, removendo duplicatas (caso seja criador E membro)
        const allRooms = [...createdRooms];
        memberRooms.forEach(memberRoom => {
          if (!allRooms.find(room => room.id === memberRoom.id)) {
            allRooms.push(memberRoom);
          }
        });

        setMyRooms(allRooms);
        setLoading(false);
      });

      return () => unsubscribeMember();
    });

    return () => unsubscribeCreated();
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

  const handleRemoveMember = async (roomId: string, memberId: string) => {
    if (!confirm('Tem certeza que deseja remover este membro da party?')) {
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomDoc = await getDoc(roomRef);
      const currentData = roomDoc.data();

      if (!currentData) return;

      // Remover o membro da lista de membros
      const updatedMembers = currentData.members.filter((id: string) => id !== memberId);
      
      // Remover dados do personagem do membro
      const updatedMemberCharacters = { ...currentData.memberCharacters };
      delete updatedMemberCharacters[memberId];

      await updateDoc(roomRef, {
        members: updatedMembers,
        memberCharacters: updatedMemberCharacters,
        currentMembers: updatedMembers.length
      });

      console.log('Membro removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover membro:', error);
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta sala? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const roomRef = doc(db, 'rooms', roomId);
      await deleteDoc(roomRef);
      console.log('Sala deletada com sucesso');
    } catch (error) {
      console.error('Erro ao deletar sala:', error);
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!confirm('Tem certeza que deseja sair desta sala?')) {
      return;
    }

    if (!user) return;

    try {
      const roomRef = doc(db, 'rooms', roomId);
      const roomDoc = await getDoc(roomRef);
      const currentData = roomDoc.data();

      if (!currentData) return;

      // Remover o usuário da lista de membros
      const updatedMembers = currentData.members.filter((id: string) => id !== user.uid);
      
      // Remover dados do personagem do usuário
      const updatedMemberCharacters = { ...currentData.memberCharacters };
      delete updatedMemberCharacters[user.uid];

      await updateDoc(roomRef, {
        members: updatedMembers,
        memberCharacters: updatedMemberCharacters,
        currentMembers: updatedMembers.length
      });

      console.log('Você saiu da sala com sucesso');
    } catch (error) {
      console.error('Erro ao sair da sala:', error);
    }
  };

  const getHuntTypeColor = (type: string) => {
    switch (type) {
      case 'EXP Hunt': return 'text-red-400';
      case 'Profit Hunt': return 'text-green-400';
      case 'Boss Hunt': return 'text-purple-400';
      case 'Quest': return 'text-blue-400';
      case 'Task': return 'text-yellow-400';
      case 'Bestiary': return 'text-pink-400';
      default: return 'text-gray-400';
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
          <h1 className="text-3xl font-bold mb-2">Minhas Parties</h1>
          <p className="text-white/80">Salas criadas por você e parties que você participa</p>
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
              <Card key={room.id} className="bg-black/30 border-white/20 backdrop-blur-sm hover:bg-black/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{room.title}</span>
                      {room.isOwner ? (
                        <Badge className="text-xs bg-orange-500/20 text-orange-400 border-orange-500/30">
                          Owner
                        </Badge>
                      ) : (
                        <Badge className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                          Membro
                        </Badge>
                      )}
                    </div>
                    <span className="text-sm font-normal text-gray-300">
                      {room.currentMembers}/{room.maxMembers}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className={`font-semibold ${getHuntTypeColor(room.huntType)}`}>{room.huntType}</span>
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
                      <span>Level {room.minLevel}+</span>
                    </div>
                    <div className="flex items-center text-gray-400 text-xs">
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>Criado às {formatTime(room.createdAt)}</span>
                    </div>
                  </div>

                  
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
                  
                  {/* Gerenciamento de Membros - apenas para owners */}
                  {room.isOwner && room.members && room.members.length > 1 && (
                    <div className="border-t border-gray-700 pt-4">
                      <p className="text-blue-400 text-sm font-medium mb-3">
                        Gerenciar Membros
                      </p>
                      <div className="space-y-2">
                        {room.members.slice(1).map((memberId, index) => {
                          const memberInfo = room.memberCharacters?.[memberId];
                          return (
                            <div key={memberId} className="flex items-center justify-between bg-gray-800/30 rounded-lg p-2">
                              <div className="flex-1">
                                {memberInfo ? (
                                  <span className="text-sm text-white">
                                    {getVocationInitials(memberInfo.characterVocation || '')} ({memberInfo.characterLevel || 'N/A'}) {memberInfo.characterName || 'N/A'}
                                  </span>
                                ) : (
                                  <span className="text-sm text-gray-400">Membro {index + 1}</span>
                                )}
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveMember(room.id, memberId)}
                                className="border-red-500/30 text-red-400 hover:bg-red-500/20 px-2 py-1 h-7"
                              >
                                <UserMinus className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Ações da Sala */}
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex gap-2">
                      {room.isOwner ? (
                        // Botão para deletar sala (apenas owner)
                        <Button
                          onClick={() => handleDeleteRoom(room.id)}
                          variant="outline"
                          className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Deletar Sala
                        </Button>
                      ) : (
                        // Botão para sair da sala (apenas membro)
                        <Button
                          onClick={() => handleLeaveRoom(room.id)}
                          variant="outline"
                          className="flex-1 border-orange-500/30 text-orange-400 hover:bg-orange-500/20"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair da Sala
                        </Button>
                      )}
                    </div>
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
