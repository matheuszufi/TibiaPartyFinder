import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { searchCharacter } from '../lib/tibia-api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Sword, ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validar personagem
      const character = await searchCharacter(characterName);
      if (!character) {
        setError('Personagem não encontrado. Verifique o nome digitado.');
        setLoading(false);
        return;
      }

      // Criar conta
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Salvar dados do usuário
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        characterName: character.name,
        level: character.level,
        vocation: character.vocation,
        world: character.world,
        createdAt: new Date()
      });

      navigate('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está sendo usado');
      } else if (error.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres');
      } else {
        setError('Erro ao criar conta. Tente novamente.');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>

        <Card className="bg-black/40 border-white/20 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Sword className="h-12 w-12 text-yellow-400" />
            </div>
            <CardTitle className="text-white text-2xl">Cadastrar</CardTitle>
            <CardDescription className="text-gray-300">
              Crie sua conta para começar a formar parties
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Senha (mínimo 6 caracteres)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              <div>
                <Input
                  type="text"
                  placeholder="Nome do Personagem"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  required
                  className="bg-black/20 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold"
              >
                {loading ? 'Criando conta...' : 'Cadastrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-400">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-yellow-400 hover:text-yellow-300 underline">
                  Faça login aqui
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
