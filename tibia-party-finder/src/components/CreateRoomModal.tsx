import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { tibiaApi } from '../lib/tibia-api';
import { Character, Vocation, VocationRequirement } from '../types';
import { Plus, Minus, Search, User } from 'lucide-react';

interface CreateRoomModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRoom: (roomData: any) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  open,
  onOpenChange,
  onCreateRoom
}) => {
  const [step, setStep] = useState(1);
  const [characterName, setCharacterName] = useState('');
  const [character, setCharacter] = useState<Character | null>(null);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [activityType, setActivityType] = useState<'quest' | 'boss' | 'hunt'>('quest');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [playerCount, setPlayerCount] = useState(2);
  const [vocationRequirements, setVocationRequirements] = useState<VocationRequirement[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const vocations: Vocation[] = ['knight', 'paladin', 'druid', 'sorcerer', 'monk'];
  const vocationLabels = {
    knight: 'Knight',
    paladin: 'Paladin',
    druid: 'Druid',
    sorcerer: 'Sorcerer',
    monk: 'Monk'
  };

  const quests = tibiaApi.getQuests();
  const bosses = tibiaApi.getBosses();
  const hunts = tibiaApi.getHunts();

  const getActivities = () => {
    switch (activityType) {
      case 'quest':
        return quests.map(q => ({ name: q.name, value: q.name }));
      case 'boss':
        return bosses.map(b => ({ name: b.name, value: b.name }));
      case 'hunt':
        return hunts.map(h => ({ name: h.name, value: h.name }));
      default:
        return [];
    }
  };

  const searchCharacter = async () => {
    if (!characterName.trim()) return;
    
    setCharacterLoading(true);
    try {
      const result = await tibiaApi.getCharacter(characterName.trim());
      setCharacter(result);
      if (result) {
        setTitle(`${result.name}'s ${activityType} party`);
      }
    } catch (error) {
      console.error('Error searching character:', error);
    }
    setCharacterLoading(false);
  };

  const initializeVocationRequirements = () => {
    const requirements: VocationRequirement[] = [];
    for (let i = 1; i <= playerCount; i++) {
      requirements.push({
        vocation: 'knight',
        count: 1,
        filled: i === 1 && character ? 1 : 0 // O primeiro player é o criador da sala
      });
    }
    setVocationRequirements(requirements);
  };

  const updateVocationRequirement = (index: number, vocation: Vocation) => {
    const updated = [...vocationRequirements];
    updated[index] = {
      ...updated[index],
      vocation
    };
    setVocationRequirements(updated);
  };

  const handleNext = () => {
    if (step === 1 && character) {
      setStep(2);
    } else if (step === 2 && selectedActivity) {
      setStep(3);
      initializeVocationRequirements();
    }
  };

  const handleCreateRoom = () => {
    if (!character || !selectedActivity || !title.trim()) return;

    const roomData = {
      title: title.trim(),
      description: description.trim(),
      world: character.world,
      activity: {
        type: activityType,
        name: selectedActivity
      },
      maxPlayers: playerCount,
      requiredVocations: vocationRequirements,
      creatorCharacter: character
    };

    onCreateRoom(roomData);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setCharacterName('');
    setCharacter(null);
    setSelectedActivity('');
    setPlayerCount(2);
    setVocationRequirements([]);
    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  useEffect(() => {
    if (playerCount !== vocationRequirements.length) {
      initializeVocationRequirements();
    }
  }, [playerCount]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Sala</DialogTitle>
          <DialogDescription>
            Configure sua sala para encontrar outros jogadores
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Character Search */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Buscar seu personagem
              </label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Nome do personagem"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchCharacter()}
                />
                <Button 
                  onClick={searchCharacter}
                  disabled={characterLoading || !characterName.trim()}
                >
                  {characterLoading ? 'Buscando...' : <Search className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {character && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>{character.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Nível:</span>
                      <p className="font-medium">{character.level}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Vocação:</span>
                      <p className="font-medium">{character.vocation}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Mundo:</span>
                      <p className="font-medium">{character.world}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 2: Activity Selection */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tipo de atividade
              </label>
              <Select value={activityType} onValueChange={(value: any) => setActivityType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quest">Quest</SelectItem>
                  <SelectItem value="boss">Boss</SelectItem>
                  <SelectItem value="hunt">Hunt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Selecione a atividade
              </label>
              <Select value={selectedActivity} onValueChange={setSelectedActivity}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha uma atividade" />
                </SelectTrigger>
                <SelectContent>
                  {getActivities().map((activity) => (
                    <SelectItem key={activity.value} value={activity.value}>
                      {activity.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Step 3: Team Configuration */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Título da sala
              </label>
              <Input
                placeholder="Ex: Inquisition Quest Team"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Descrição (opcional)
              </label>
              <Input
                placeholder="Informações adicionais sobre a sala..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Número de jogadores (2-15)
              </label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPlayerCount(Math.max(2, playerCount - 1))}
                  disabled={playerCount <= 2}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-8 text-center">{playerCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPlayerCount(Math.min(15, playerCount + 1))}
                  disabled={playerCount >= 15}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Vocações necessárias
              </label>
              <div className="space-y-2">
                {vocationRequirements.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 w-16">
                      Player {index + 1}:
                    </span>
                    <Select
                      value={req.vocation}
                      onValueChange={(value: Vocation) => updateVocationRequirement(index, value)}
                      disabled={index === 0} // O primeiro player é sempre o criador
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vocations.map((vocation) => (
                          <SelectItem key={vocation} value={vocation}>
                            {vocationLabels[vocation]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {index === 0 && (
                      <span className="text-xs text-gray-500">(Você)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Voltar
            </Button>
          )}
          
          {step < 3 ? (
            <Button 
              onClick={handleNext}
              disabled={
                (step === 1 && !character) ||
                (step === 2 && !selectedActivity)
              }
            >
              Próximo
            </Button>
          ) : (
            <Button 
              onClick={handleCreateRoom}
              disabled={!title.trim()}
            >
              Criar Sala
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;
