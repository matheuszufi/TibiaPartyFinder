import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { searchCharacter, type Character } from '../lib/tibia-api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft, User, Save, Crown, Search, Loader2, Eye, EyeOff, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserData {
  characterName: string;
  level: string;
  vocation: string;
  world: string;
  isPremium: boolean;
  premiumEndDate?: any; // Firebase Timestamp
  guild?: string;
  email: string;
}

export const ProfilePage = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [characterSearchName, setCharacterSearchName] = useState('');
  const [foundCharacter, setFoundCharacter] = useState<Character | null>(null);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Function to calculate remaining premium days
  const calculatePremiumDaysRemaining = (): number | null => {
    if (!userData?.isPremium || !userData?.premiumEndDate) {
      return null;
    }

    try {
      const expirationDate = userData.premiumEndDate.toDate();
      const currentDate = new Date();
      const diffTime = expirationDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      console.error('Error calculating premium days:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'userProfiles', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData(data);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [user]);

  const handleSearchCharacter = async () => {
    if (!characterSearchName.trim()) return;

    setIsSearching(true);
    try {
      const character = await searchCharacter(characterSearchName.trim());
      if (character) {
        setFoundCharacter(character);
      } else {
        alert('Personagem não encontrado. Verifique o nome e tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao buscar personagem:', error);
      alert('Erro ao buscar personagem. Tente novamente.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveCharacter = async () => {
    if (!user || !foundCharacter) return;

    setIsSaving(true);
    try {
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        characterName: foundCharacter.name,
        level: foundCharacter.level.toString(),
        vocation: foundCharacter.vocation,
        world: foundCharacter.world,
        guild: foundCharacter.guild?.name || ''
      });
      
      // Atualizar estado local
      setUserData(prev => prev ? {
        ...prev,
        characterName: foundCharacter.name,
        level: foundCharacter.level.toString(),
        vocation: foundCharacter.vocation,
        world: foundCharacter.world,
        guild: foundCharacter.guild?.name || ''
      } : null);
      
      setFoundCharacter(null);
      setCharacterSearchName('');
      alert('Personagem atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar personagem:', error);
      alert('Erro ao salvar personagem. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !passwordForm.currentPassword || !passwordForm.newPassword) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('A confirmação da nova senha não confere.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Reautenticar o usuário
      const credential = EmailAuthProvider.credential(user.email!, passwordForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Alterar a senha
      await updatePassword(user, passwordForm.newPassword);
      
      // Limpar o formulário
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordSection(false);
      
      alert('Senha alterada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao alterar senha:', error);
      if (error.code === 'auth/wrong-password') {
        alert('Senha atual incorreta.');
      } else {
        alert('Erro ao alterar senha. Tente novamente.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Carregando perfil...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-lg text-red-600">Erro ao carregar dados do usuário</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header style={{ backgroundColor: 'rgb(17, 24, 31)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Meu Perfil</h1>
                <p className="text-sm text-gray-300">Gerencie suas informações</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {userData.isPremium && (
                <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-medium rounded-full">
                  <Crown className="h-3 w-3" />
                  Premium
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Busca de Personagem */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Search className="h-5 w-5" />
                Buscar Personagem Principal
              </CardTitle>
              <CardDescription className="text-gray-600">
                Digite o nome do seu personagem principal no Tibia para buscar automaticamente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={characterSearchName}
                  onChange={(e) => setCharacterSearchName(e.target.value)}
                  placeholder="Nome do personagem"
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchCharacter()}
                />
                <Button
                  onClick={handleSearchCharacter}
                  disabled={isSearching || !characterSearchName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {foundCharacter && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-900 mb-2">Personagem Encontrado:</h4>
                  <div className="space-y-1 text-sm text-green-800">
                    <p><strong>Nome:</strong> {foundCharacter.name}</p>
                    <p><strong>Level:</strong> {foundCharacter.level}</p>
                    <p><strong>Vocação:</strong> {foundCharacter.vocation}</p>
                    <p><strong>Servidor:</strong> {foundCharacter.world}</p>
                    {foundCharacter.guild && (
                      <p><strong>Guild:</strong> {foundCharacter.guild.name} ({foundCharacter.guild.rank})</p>
                    )}
                  </div>
                  <Button
                    onClick={handleSaveCharacter}
                    disabled={isSaving}
                    className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Salvando...' : 'Salvar como Personagem Principal'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Informações Atuais */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <User className="h-5 w-5" />
                Informações Atuais
              </CardTitle>
              <CardDescription className="text-gray-600">
                Dados do seu personagem principal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  value={userData.email}
                  disabled
                  className="bg-gray-50 text-gray-600"
                />
              </div>

              {/* Character Info Display */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personagem
                  </label>
                  <Input
                    value={userData.characterName || 'Não definido'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level
                  </label>
                  <Input
                    value={userData.level || 'Não definido'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vocação
                  </label>
                  <Input
                    value={userData.vocation || 'Não definido'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Servidor
                  </label>
                  <Input
                    value={userData.world || 'Não definido'}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              {userData.guild && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guild
                  </label>
                  <Input
                    value={userData.guild}
                    disabled
                    className="bg-gray-50 text-gray-600"
                  />
                </div>
              )}

              {/* Account Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Conta
                </label>
                <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md">
                  {userData.isPremium ? (
                    <>
                      <Crown className="h-5 w-5 text-yellow-500" />
                      <div className="flex-1">
                        <span className="font-medium text-gray-900">Conta Premium</span>
                        {(() => {
                          const daysRemaining = calculatePremiumDaysRemaining();
                          if (daysRemaining !== null) {
                            if (daysRemaining > 0) {
                              return (
                                <div className="text-sm">
                                  <span className="text-green-600 font-medium">
                                    {daysRemaining} {daysRemaining === 1 ? 'dia restante' : 'dias restantes'}
                                  </span>
                                  {userData.premiumEndDate && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Expira em: {userData.premiumEndDate.toDate().toLocaleDateString('pt-BR')}
                                    </div>
                                  )}
                                </div>
                              );
                            } else {
                              return (
                                <div className="text-sm">
                                  <span className="text-red-600 font-medium">Expirado</span>
                                  {userData.premiumEndDate && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      Expirou em: {userData.premiumEndDate.toDate().toLocaleDateString('pt-BR')}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                          }
                          return null;
                        })()}
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="h-5 w-5 text-gray-500" />
                      <span className="font-medium text-gray-900">Conta Free</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  {userData.isPremium 
                    ? (() => {
                        const daysRemaining = calculatePremiumDaysRemaining();
                        if (daysRemaining !== null && daysRemaining > 0) {
                          return "Você pode criar salas ilimitadas e agendar parties";
                        } else if (daysRemaining === 0) {
                          return "Sua conta premium expirou. Renove para continuar com os benefícios.";
                        }
                        return "Você pode criar salas ilimitadas e agendar parties";
                      })()
                    : "Você pode criar 1 sala por dia"
                  }
                </p>
                {!userData.isPremium && (
                  <div className="mt-3">
                    <Link to="/premium">
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                        <Crown className="h-4 w-4 mr-2" />
                        Comprar Premium - R$ 5,00/mês
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Seção de Alteração de Senha */}
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Lock className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
              <CardDescription className="text-gray-600">
                Altere sua senha de acesso
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showPasswordSection ? (
                <Button
                  onClick={() => setShowPasswordSection(true)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Senha Atual */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Senha Atual *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder="Digite sua senha atual"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Nova Senha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nova Senha * (mínimo 6 caracteres)
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder="Digite sua nova senha"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Nova Senha */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Nova Senha *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder="Confirme sua nova senha"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handlePasswordChange}
                      disabled={isChangingPassword || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
                    </Button>
                    <Button
                      onClick={() => {
                        setShowPasswordSection(false);
                        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                      variant="outline"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};
