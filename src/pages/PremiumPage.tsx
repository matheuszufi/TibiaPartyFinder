import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, Crown, CreditCard, Shield, Star, Users, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const PremiumPage = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const handlePurchase = async () => {
    if (!user || !paymentMethod) return;

    setIsProcessing(true);
    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Atualizar status premium do usuário
      await updateDoc(doc(db, 'userProfiles', user.uid), {
        isPremium: true,
        premiumStartDate: new Date(),
        premiumEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
      });
      
      // Redirecionar para o perfil com sucesso
      navigate('/profile?premium=success');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const premiumFeatures = [
    {
      icon: <Users className="h-5 w-5 text-green-600" />,
      title: "Salas Ilimitadas",
      description: "Crie quantas salas de party quiser sem limitações"
    },
    {
      icon: <Calendar className="h-5 w-5 text-blue-600" />,
      title: "Agendamento de Parties",
      description: "Agende suas hunts e eventos para datas futuras"
    },
    {
      icon: <Star className="h-5 w-5 text-purple-600" />,
      title: "Destaque Especial",
      description: "Suas salas aparecem em destaque na lista"
    },
    {
      icon: <Shield className="h-5 w-5 text-orange-600" />,
      title: "Suporte Prioritário",
      description: "Atendimento prioritário para usuários premium"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header style={{ backgroundColor: 'rgb(17, 24, 31)' }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/profile">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-gray-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Perfil
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-yellow-400" />
              <h1 className="text-2xl font-bold text-white">Exiva Premium</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full mb-4">
              <Crown className="h-5 w-5 text-yellow-600" />
              <span className="text-yellow-800 font-medium">Oferta Especial</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Torne-se Premium
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Desbloqueie todos os recursos e aproveite ao máximo o Exiva
            </p>
            <div className="text-center">
              <span className="text-5xl font-bold text-gray-900">R$ 5,00</span>
              <span className="text-xl text-gray-600">/mês</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Features */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Recursos Premium
              </h3>
              <div className="space-y-4">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="bg-gray-50 p-2 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison */}
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Comparação de Planos
                </h3>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Recurso</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Free</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-yellow-700">Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Salas de Party</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">Até 2</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">Ilimitadas</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Agendamento</td>
                        <td className="px-4 py-3 text-center text-sm text-red-600">✗</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600">✓</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Destaque</td>
                        <td className="px-4 py-3 text-center text-sm text-red-600">✗</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600">✓</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm text-gray-700">Suporte</td>
                        <td className="px-4 py-3 text-center text-sm text-gray-600">Padrão</td>
                        <td className="px-4 py-3 text-center text-sm text-green-600 font-medium">Prioritário</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <Card className="bg-white shadow-lg border border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-900">
                    <CreditCard className="h-5 w-5" />
                    Finalizar Compra
                  </CardTitle>
                  <CardDescription>
                    Complete o pagamento para ativar sua conta premium
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Método de Pagamento
                    </label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="border-gray-300">
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit">Cartão de Débito</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="boleto">Boleto Bancário</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === 'credit' || paymentMethod === 'debit' ? (
                    <>
                      {/* Card Number */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número do Cartão
                        </label>
                        <Input
                          placeholder="1234 5678 9012 3456"
                          value={cardForm.number}
                          onChange={(e) => setCardForm({...cardForm, number: e.target.value})}
                          className="border-gray-300"
                        />
                      </div>

                      {/* Card Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome no Cartão
                        </label>
                        <Input
                          placeholder="João Silva"
                          value={cardForm.name}
                          onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
                          className="border-gray-300"
                        />
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validade
                          </label>
                          <Input
                            placeholder="MM/AA"
                            value={cardForm.expiry}
                            onChange={(e) => setCardForm({...cardForm, expiry: e.target.value})}
                            className="border-gray-300"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <Input
                            placeholder="123"
                            value={cardForm.cvv}
                            onChange={(e) => setCardForm({...cardForm, cvv: e.target.value})}
                            className="border-gray-300"
                          />
                        </div>
                      </div>
                    </>
                  ) : paymentMethod === 'pix' ? (
                    <div className="text-center py-8">
                      <div className="bg-gray-100 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-600 mb-2">Chave PIX:</p>
                        <p className="font-mono text-lg font-medium text-gray-900">premium@exiva.com</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        Após o pagamento, sua conta será ativada automaticamente
                      </p>
                    </div>
                  ) : paymentMethod === 'boleto' ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-600 mb-4">
                        O boleto será gerado após confirmar a compra
                      </p>
                      <p className="text-xs text-gray-500">
                        Prazo de pagamento: 3 dias úteis
                      </p>
                    </div>
                  ) : null}

                  {/* Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Exiva Premium (1 mês)</span>
                      <span className="font-medium text-gray-900">R$ 5,00</span>
                    </div>
                    <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between items-center">
                      <span className="font-medium text-gray-900">Total</span>
                      <span className="font-bold text-lg text-gray-900">R$ 5,00</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <Button
                    onClick={handlePurchase}
                    disabled={!paymentMethod || isProcessing}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processando Pagamento...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Ativar Premium por R$ 5,00
                      </div>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    Ao continuar, você concorda com nossos termos de serviço e política de privacidade
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PremiumPage;
