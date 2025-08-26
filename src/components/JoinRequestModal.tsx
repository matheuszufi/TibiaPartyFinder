import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { searchCharacter } from '../lib/tibia-api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Loader2, Search } from 'lucide-react';

interface JoinRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomTitle: string;
}

export function JoinRequestModal({ isOpen, onClose, roomId, roomTitle }: JoinRequestModalProps) {
  const [user] = useAuthState(auth);
  const [characterName, setCharacterName] = useState('');
  const [characterData, setCharacterData] = useState<any>(null);
  const [searchingCharacter, setSearchingCharacter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearchCharacter = async () => {
    if (!characterName.trim()) {
      setError('Digite o nome do personagem');
      return;
    }

    setSearchingCharacter(true);
    setError('');

    try {
      const character = await searchCharacter(characterName.trim());
      if (character) {
        setCharacterData(character);
      } else {
        setError('Personagem não encontrado');
        setCharacterData(null);
      }
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      setError('Erro ao buscar personagem');
      setCharacterData(null);
    }

    setSearchingCharacter(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !characterName.trim()) {
      setError('Nome do personagem é obrigatório');
      return;
    }

    // Se não temos dados do personagem, vamos buscá-los primeiro
    if (!characterData) {
      await handleSearchCharacter();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const roomRef = doc(db, 'rooms', roomId);
      
      // Criar objeto com valores seguros (sem undefined)
      const joinRequest: any = {
        userId: user.uid,
        characterName: characterData.name || characterName.trim(),
        userEmail: user.email || 'Email não disponível',
        requestedAt: new Date()
      };

      // Adicionar campos opcionais apenas se existirem e não forem undefined
      if (characterData.level !== undefined && characterData.level !== null) {
        joinRequest.characterLevel = characterData.level;
      }
      
      if (characterData.vocation && characterData.vocation !== undefined) {
        joinRequest.characterVocation = characterData.vocation;
      }
      
      if (characterData.world && characterData.world !== undefined) {
        joinRequest.characterWorld = characterData.world;
      }
      
      if (characterData.guild && characterData.guild !== undefined) {
        const guildName = typeof characterData.guild === 'object' 
          ? characterData.guild.name 
          : characterData.guild;
        if (guildName && guildName !== undefined) {
          joinRequest.characterGuild = guildName;
        }
      }

      await updateDoc(roomRef, {
        joinRequests: arrayUnion(joinRequest)
      });

      // Reset form and close modal
      setCharacterName('');
      setCharacterData(null);
      onClose();
      
      // Show success message (você pode implementar um toast aqui)
      alert('Solicitação enviada com sucesso!');
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setError('Erro ao enviar solicitação. Tente novamente.');
    }

    setLoading(false);
  };

  const handleClose = () => {
    if (!loading && !searchingCharacter) {
      setCharacterName('');
      setCharacterData(null);
      setError('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-black/90 border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Solicitar Entrada na Party</DialogTitle>
          <DialogDescription className="text-gray-300">
            Envie uma solicitação para entrar na party "{roomTitle}"
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="characterName" className="text-white text-sm font-medium leading-none">
              Nome do Personagem *
            </label>
            <div className="flex gap-2 mt-1">
              <div className="relative flex-1">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="characterName"
                  type="text"
                  placeholder="Digite o nome do seu personagem"
                  value={characterName}
                  onChange={(e) => {
                    setCharacterName(e.target.value);
                    setCharacterData(null); // Reset character data when name changes
                  }}
                  className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                  disabled={loading || searchingCharacter}
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleSearchCharacter}
                disabled={!characterName.trim() || loading || searchingCharacter}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                {searchingCharacter ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Exibir informações do personagem encontrado */}
          {characterData && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Personagem encontrado</span>
              </div>
              <div className="text-sm text-gray-300 space-y-1">
                <p><strong>{characterData.name}</strong></p>
                <p>Level {characterData.level} {characterData.vocation}</p>
                <p>Mundo: {characterData.world}</p>
                {characterData.guild && (
                  <p>Guild: {typeof characterData.guild === 'object' ? characterData.guild.name : characterData.guild}</p>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-400 text-sm bg-red-900/20 border border-red-500/30 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading || searchingCharacter}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || searchingCharacter || !characterData}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : characterData ? (
                'Solicitar Entrada'
              ) : (
                'Buscar Personagem'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
