import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { searchCharacter, fetchBosses, fetchCreatures, TIBIA_QUESTS, type Boss, type Creature } from '../lib/tibia-api';
import { useRoomLimits } from '../hooks/useRoomLimits';
import { calculateRoomExpiration } from '../utils/roomExpiration';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { User, Search, Loader2, X, Plus, Crown, AlertCircle, Calendar, Clock } from 'lucide-react';

const ACTIVITY_TYPES = ['boss', 'hunt', 'quest'];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [user] = useAuthState(auth);
  const { userProfile, incrementRoomCount, upgradeToPremium } = useRoomLimits(user?.uid);
  const [title, setTitle] = useState('');
  const [activityType, setActivityType] = useState('');
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [minLevel, setMinLevel] = useState('');
  const [maxMembers, setMaxMembers] = useState('5');
  const [loading, setLoading] = useState(false);
  
  // Estados para agendamento
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
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

    // Verificar se é conta premium (agora obrigatório para criar salas)
    if (userProfile?.accountType !== 'premium') {
      alert('Apenas contas Premium podem criar salas! Faça o upgrade para continuar.');
      return;
    }

    // Validar agendamento se especificado
    let scheduledDateTime: Date | undefined;
    if (isScheduled && scheduledDate && scheduledTime) {
      scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      // Verificar se a data/hora é no futuro
      if (scheduledDateTime <= new Date()) {
        alert('A data e hora agendada deve ser no futuro!');
        return;
      }
    }

    setLoading(true);

    try {
      // Incrementar contador de salas criadas
      const canProceed = await incrementRoomCount();
      if (!canProceed) {
        alert('Erro ao verificar limites da conta. Tente novamente.');
        setLoading(false);
        return;
      }

      // Calcular validade da sala
      const expiresAt = calculateRoomExpiration(scheduledDateTime);

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
        expiresAt, // Nova propriedade para validade
        scheduledFor: scheduledDateTime || null, // Data agendada se especificada
        isScheduled: !!scheduledDateTime, // Flag para salas agendadas
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
      setMaxMembers('5');
      setIsScheduled(false);
      setScheduledDate('');
      setScheduledTime('');
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
      <DialogContent className="bg-white border border-gray-200 shadow-xl max-w-lg">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            Criar Nova Party
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Preencha os detalhes da sua party para encontrar outros jogadores.
          </DialogDescription>
        </DialogHeader>

        {/* Status da Conta */}
        {userProfile && (
          <Card className={`border-2 ${userProfile.accountType === 'premium' ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' : 'border-red-300 bg-gradient-to-r from-red-50 to-orange-50'}`}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {userProfile.accountType === 'premium' ? (
                    <Crown className="h-4 w-4 text-yellow-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-sm font-semibold ${userProfile.accountType === 'premium' ? 'text-yellow-700' : 'text-red-700'}`}>
                    Conta {userProfile.accountType === 'premium' ? 'Premium' : 'Gratuita'}
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  {userProfile.accountType === 'premium' ? (
                    <span className="text-green-600 font-medium">Salas ilimitadas</span>
                  ) : (
                    <span className="text-red-600 font-medium">Não pode criar salas</span>
                  )}
                </div>
              </div>
              
              {userProfile.accountType === 'free' && (
                <div className="mt-2 p-2 bg-red-100 border border-red-200 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-red-700">
                      <AlertCircle className="h-3 w-3" />
                      <span>Apenas contas Premium podem criar salas!</span>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={async () => {
                        const success = await upgradeToPremium();
                        if (success) {
                          alert('Parabéns! Sua conta foi upgradada para Premium! 🎉');
                        }
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 text-black text-xs px-2 py-1 h-6"
                    >
                      <Crown className="h-3 w-3 mr-1" />
                      Upgrade
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título da Party
            </label>
            <Input
              placeholder="Ex: Hunt Dragons, Boss Ferumbras, Quest POI..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Campo de busca do líder */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personagem Líder
            </label>
            <div className="flex gap-2">
              <Input
                placeholder="Nome do personagem líder"
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Button
                type="button"
                onClick={handleSearchLeader}
                disabled={searchingLeader || !leaderName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                {searchingLeader ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {leaderError && (
              <p className="text-red-600 text-sm mt-2 bg-red-50 border border-red-200 rounded p-2">{leaderError}</p>
            )}

            {leaderData && (
              <Card className="mt-3 bg-green-50 border-green-200">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <User className="h-4 w-4" />
                    <span className="font-semibold">{leaderData.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1 space-y-1">
                    <p>Level {leaderData.level} {leaderData.vocation}</p>
                    <p>Mundo: {leaderData.world}</p>
                    {leaderData.guild && <p>Guild: {leaderData.guild.name}</p>}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Atividade
            </label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                <SelectValue placeholder="Selecione o tipo de atividade" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                {ACTIVITY_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-gray-900 hover:bg-gray-100 focus:bg-blue-50 focus:text-blue-900">
                    {type === 'boss' ? 'Boss' : type === 'hunt' ? 'Hunt' : 'Quest'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Campo dinâmico para seleção de targets */}
          {activityType && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white"
                />
              </div>

              {/* Lista de selecionados */}
              {selectedTargets.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-gray-700 mb-2 font-medium">Selecionados:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedTargets.map((target) => (
                      <div
                        key={target}
                        className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1 flex items-center gap-2"
                      >
                        <span className="text-blue-700 text-sm font-medium">{target}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTarget(target)}
                          className="text-blue-500 hover:text-red-500 transition-colors"
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
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded bg-gray-50">
                  {getFilteredTargets().map((target) => (
                    <button
                      key={target}
                      type="button"
                      onClick={() => handleAddTarget(target)}
                      disabled={selectedTargets.includes(target)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-900 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between border-b border-gray-100 last:border-b-0"
                    >
                      <span>{target}</span>
                      {!selectedTargets.includes(target) && (
                        <Plus className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {loadingData && (
                <div className="flex items-center justify-center py-4 bg-gray-50 rounded border border-gray-200">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Carregando...</span>
                </div>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level Mínimo
              </label>
              <Input
                type="number"
                placeholder="Ex: 100"
                value={minLevel}
                onChange={(e) => setMinLevel(e.target.value)}
                required
                min="1"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Máximo de Membros
                {userProfile?.accountType === 'premium' && (
                  <span className="text-xs text-yellow-600 ml-1">(Premium: até 40)</span>
                )}
              </label>
              <Select value={maxMembers} onValueChange={setMaxMembers}>
                <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                  {userProfile?.accountType === 'premium' ? 
                    // Opções para contas Premium
                    [2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-gray-900 hover:bg-gray-100">
                        {num} membros
                        {num > 5 && <span className="text-yellow-600 text-xs ml-1">(Premium)</span>}
                      </SelectItem>
                    ))
                    :
                    // Opções para contas gratuitas (limitadas)
                    [2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()} className="text-gray-900 hover:bg-gray-100">
                        {num} membros
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Agendamento (apenas para Premium) */}
          {userProfile?.accountType === 'premium' && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  id="isScheduled"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isScheduled" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Agendar sala para data/hora específica
                </label>
              </div>
              
              {isScheduled && (
                <div className="grid grid-cols-2 gap-4 p-3 bg-blue-50 border border-blue-200 rounded">
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Data
                    </label>
                    <Input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required={isScheduled}
                      className="border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Horário
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-500" />
                      <Input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        required={isScheduled}
                        className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 pl-10"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
                      <AlertCircle className="inline h-3 w-3 mr-1" />
                      Salas agendadas ficam válidas até a data/hora especificada. 
                      Salas imediatas têm validade de 1 hora.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || userProfile?.accountType !== 'premium'}
              className={`font-semibold ${
                userProfile?.accountType !== 'premium'
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Criando...
                </>
              ) : 
               userProfile?.accountType !== 'premium' ? 'Apenas Premium' : 
               'Criar Party'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
