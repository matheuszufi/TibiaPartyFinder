import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { searchCharacter, fetchBosses, fetchCreatures, TIBIA_QUESTS, type Boss, type Creature } from '../lib/tibia-api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { User, Search, Loader2, X, Plus } from 'lucide-react';

const ACTIVITY_TYPES = ['boss', 'hunt', 'quest'];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState('');
  const [maxMembers, setMaxMembers] = useState('4');
  const [loading, setLoading] = useState(false);
  
  // Estados para busca de personagem
  const [leaderName, setLeaderName] = useState('');
  const [leaderData, setLeaderData] = useState<any>(null);
  const [searchingLeader, setSearchingLeader] = useState(false);
  const [leaderError, setLeaderError] = useState('');

  // Estados para dados da API
  const [bosses, setBosses] = useState<Boss[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Buscar dados da API quando o tipo de atividade mudar
  useEffect(() => {
    const loadActivityData = async () => {
      if (activityType === 'boss' && bosses.length === 0) {
        setLoadingData(true);
        const bossData = await fetchBosses();
        setBosses(bossData);
        setLoadingData(false);
      } else if (activityType === 'hunt' && creatures.length === 0) {
        setLoadingData(true);
        const creatureData = await fetchCreatures();
        setCreatures(creatureData);
        setLoadingData(false);
      }
    };

    if (activityType) {
      loadActivityData();
    }
  }, [activityType, bosses.length, creatures.length]);

  // Limpar seleções quando mudar tipo de atividade
  useEffect(() => {
    setSelectedTargets([]);
    setSearchTerm('');
  }, [activityType]);

  const handleSearchLeader = async () => {
    if (!leaderName.trim()) {
      setLeaderError('Digite o nome do personagem');
      return;
    }

    setSearchingLeader(true);
    setLeaderError('');

    try {
      const character = await searchCharacter(leaderName);
      if (character) {
        setLeaderData(character);
        setLeaderError('');
      } else {
        setLeaderError('Personagem não encontrado');
        setLeaderData(null);
      }
    } catch (error) {
      setLeaderError('Erro ao buscar personagem');
      setLeaderData(null);
    }

    setSearchingLeader(false);
  };

  const handleAddTarget = (targetName: string) => {
    if (!selectedTargets.includes(targetName)) {
      setSelectedTargets([...selectedTargets, targetName]);
    }
    setSearchTerm('');
  };

  const handleRemoveTarget = (targetName: string) => {
    setSelectedTargets(selectedTargets.filter(t => t !== targetName));
  };

  const getFilteredTargets = () => {
    let targets: string[] = [];
    
    if (activityType === 'boss') {
      targets = bosses.map(boss => boss.name);
    } else if (activityType === 'hunt') {
      targets = creatures.map(creature => creature.name);
    } else if (activityType === 'quest') {
      targets = TIBIA_QUESTS;
    }

    if (searchTerm.trim()) {
      return targets.filter(target => 
        target.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return targets.slice(0, 20); // Limitar para performance
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!leaderData) {
      setLeaderError('Busque um personagem válido para ser o líder');
      return;
    }

    setLoading(true);

    try {
      // Verificar se o usuário já criou uma sala
      const existingRoomsQuery = query(
        collection(db, 'rooms'),
        where('createdBy', '==', user.uid)
      );
      const existingRoomsSnapshot = await getDocs(existingRoomsQuery);

      if (!existingRoomsSnapshot.empty) {
        alert('Você já criou uma sala. Cada usuário pode criar apenas uma sala por vez.');
        setLoading(false);
        return;
      }

      await addDoc(collection(db, 'rooms'), {
        title,
        activityType,
        selectedTargets,
        minLevel: parseInt(minLevel),
        maxMembers: parseInt(maxMembers),
        currentMembers: 1,
        world: leaderData.world,
        createdBy: user.uid,
        createdAt: new Date(),
        members: [user.uid],
        isActive: true,
        // Dados do líder
        leaderCharacter: {
          name: leaderData.name,
          level: leaderData.level,
          vocation: leaderData.vocation,
          guild: leaderData.guild || null
        }
      });

      // Reset form
      setTitle('');
      setActivityType('');
      setSelectedTargets([]);
      setMinLevel('');
      setMaxMembers('4');
      setLeaderName('');
      setLeaderData(null);
      setLeaderError('');
      onClose();
    } catch (error) {
      console.error('Erro ao criar sala:', error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Party</DialogTitle>
          <DialogDescription className="text-gray-300">
            Preencha os detalhes da sua party para encontrar outros jogadores.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Título da Party"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          {/* Campo de busca do líder */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Personagem Líder
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do personagem líder"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="bg-black/20 border-white/20 text-white placeholder:text-gray-400 flex-1"
              />
              <Button
                type="button"
                onClick={handleSearchLeader}
                disabled={searchingLeader || !leaderName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {searchingLeader ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {leaderError && (
              <p className="text-red-400 text-sm mt-1">{leaderError}</p>
            )}

            {leaderData && (
              <Card className="mt-3 bg-green-900/20 border-green-500/30">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-green-400">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{leaderData.name}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-1">
                    <p>Level {leaderData.level} {leaderData.vocation}</p>
                    <p>World: {leaderData.world}</p>
                    {leaderData.guild && <p>Guild: {leaderData.guild.name}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="Tipo de Atividade" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                    {type === 'boss' ? 'Boss' : type === 'hunt' ? 'Hunt' : 'Quest'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo dinâmico para seleção de targets */}
          {activityType && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {activityType === 'boss' ? 'Bosses' : 
                 activityType === 'hunt' ? 'Criaturas' : 'Quests'}
              </label>
              
              {/* Campo de busca */}
              <div className="mb-3">
                <Input
                  placeholder={`Buscar ${activityType === 'boss' ? 'boss' : 
                                         activityType === 'hunt' ? 'criatura' : 'quest'}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              {/* Lista de selecionados */}
              {selectedTargets.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-300 mb-2">Selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTargets.map((target) => (
                      <div
                        key={target}
                        className="bg-yellow-600/20 border border-yellow-600/30 rounded px-2 py-1 flex items-center gap-2"
                      >
                        <span className="text-yellow-300 text-sm">{target}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTarget(target)}
                          className="text-yellow-300 hover:text-red-300 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lista de opções disponíveis */}
              {!loadingData && activityType && (
                <div className="max-h-32 overflow-y-auto border border-white/20 rounded bg-black/20">
                  {getFilteredTargets().map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handleAddTarget(target)}
                      disabled={selectedTargets.includes(target)}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between"
                    >
                      <span>{target}</span>
                      {!selectedTargets.includes(target) && (
                        <Plus className="h-4 w-4 text-green-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {loadingData && (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  <span className="ml-2 text-gray-400">Carregando...</span>
                </div>
              )}
            </div>
          )}

          <div>
            <Input
              type="number"
              placeholder="Level Min"
              value={minLevel}
              onChange={(e) => setMinLevel(e.target.value)}
              required
              min="1"
              max="2000"
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Select value={maxMembers} onValueChange={setMaxMembers}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="Máximo de Membros" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <SelectItem key={num} value={num.toString()} className="text-white hover:bg-white/10">
                    {num} jogadores
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
            >
              {loading ? 'Criando...' : 'Criar Party'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
