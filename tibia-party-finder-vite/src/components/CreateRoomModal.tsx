import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { searchCharacter } from '../lib/tibia-api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Card, CardContent } from './ui/card';
import { User, Search, Loader2 } from 'lucide-react';

const VOCATIONS = [
  'Druid',
  'Knight', 
  'Paladin',
  'Sorcerer'
];

const HUNT_TYPES = [
  'EXP Hunt',
  'Profit Hunt',
  'Boss Hunt',
  'Quest',
  'Task',
  'Bestiary',
  'Outros'
];

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [huntType, setHuntType] = useState('');
  const [minLevel, setMinLevel] = useState('');
  const [maxLevel, setMaxLevel] = useState('');
  const [maxMembers, setMaxMembers] = useState('4');
  const [requiredVocations, setRequiredVocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para busca de personagem
  const [leaderName, setLeaderName] = useState('');
  const [leaderData, setLeaderData] = useState<any>(null);
  const [searchingLeader, setSearchingLeader] = useState(false);
  const [leaderError, setLeaderError] = useState('');

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

  const handleVocationToggle = (vocation: string) => {
    setRequiredVocations(prev =>
      prev.includes(vocation)
        ? prev.filter(v => v !== vocation)
        : [...prev, vocation]
    );
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
      await addDoc(collection(db, 'rooms'), {
        title,
        description,
        huntType,
        minLevel: parseInt(minLevel),
        maxLevel: parseInt(maxLevel),
        maxMembers: parseInt(maxMembers),
        currentMembers: 1,
        requiredVocations,
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
      setDescription('');
      setHuntType('');
      setMinLevel('');
      setMaxLevel('');
      setMaxMembers('4');
      setRequiredVocations([]);
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
            <Input
              placeholder="Descrição (ex: local da hunt)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <div>
            <Select value={huntType} onValueChange={setHuntType}>
              <SelectTrigger className="bg-black/20 border-white/20 text-white">
                <SelectValue placeholder="Tipo de Hunt" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-white/20">
                {HUNT_TYPES.map((type) => (
                  <SelectItem key={type} value={type} className="text-white hover:bg-white/10">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
            <Input
              type="number"
              placeholder="Level Max"
              value={maxLevel}
              onChange={(e) => setMaxLevel(e.target.value)}
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

          <div>
            <p className="text-sm text-gray-300 mb-2">Vocações desejadas (opcional):</p>
            <div className="grid grid-cols-2 gap-2">
              {VOCATIONS.map((vocation) => (
                <Button
                  key={vocation}
                  type="button"
                  variant={requiredVocations.includes(vocation) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleVocationToggle(vocation)}
                  className={
                    requiredVocations.includes(vocation)
                      ? "bg-yellow-600 hover:bg-yellow-700 text-black"
                      : "bg-transparent border-white/20 text-white hover:bg-white/10"
                  }
                >
                  {vocation}
                </Button>
              ))}
            </div>
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
