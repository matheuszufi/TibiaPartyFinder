import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import exivaLogo from '../assets/images/exiva.png';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50" style={{ backgroundColor: 'rgb(17, 24, 31)' }}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-1 rounded-lg flex items-center justify-center">
              <img src={exivaLogo} alt="Exiva" className="h-20 w-20" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-gray-700">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao Site
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-900">
              Termos de Serviço
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Última atualização: 29 de agosto de 2025
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Aceitação dos Termos</h2>
                <p>
                  Ao acessar e usar o Exiva Party Finder, você concorda em cumprir estes Termos de Serviço. 
                  Se você não concordar com qualquer parte destes termos, não deve usar nosso serviço.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Descrição do Serviço</h2>
                <p>
                  O Exiva é uma plataforma que facilita a formação de grupos (parties) para o jogo Tibia. 
                  Oferecemos ferramentas para:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criar e gerenciar parties</li>
                  <li>Encontrar outros jogadores</li>
                  <li>Organizar atividades no jogo</li>
                  <li>Comunicação entre membros</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Registro de Conta</h2>
                <p>Para usar nossos serviços, você deve:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ter pelo menos 13 anos de idade</li>
                  <li>Fornecer informações precisas e atualizadas</li>
                  <li>Manter a segurança de sua conta</li>
                  <li>Possuir um personagem válido no Tibia</li>
                  <li>Usar apenas uma conta por pessoa</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Regras de Conduta</h2>
                <p>Ao usar nossa plataforma, você concorda em:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tratar outros usuários com respeito</li>
                  <li>Não usar linguagem ofensiva ou discriminatória</li>
                  <li>Não criar parties falsas ou enganosas</li>
                  <li>Não fazer spam ou propaganda não solicitada</li>
                  <li>Não tentar burlar sistemas de segurança</li>
                  <li>Não compartilhar conteúdo ilegal ou inadequado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Responsabilidades do Usuário</h2>
                <p>Você é responsável por:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Todas as atividades em sua conta</li>
                  <li>Manter suas informações atualizadas</li>
                  <li>Cumprir as regras do Tibia</li>
                  <li>Resolver disputas com outros jogadores</li>
                  <li>Proteger suas credenciais de acesso</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Propriedade Intelectual</h2>
                <p>
                  Todo o conteúdo do site (design, código, textos, logotipos) é propriedade do Exiva ou licenciado. 
                  Tibia é marca registrada da CipSoft GmbH. Este site não é afiliado oficialmente com a CipSoft.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Suspensão e Encerramento</h2>
                <p>Podemos suspender ou encerrar sua conta se:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Você violar estes termos</li>
                  <li>Houver atividade suspeita ou fraudulenta</li>
                  <li>For solicitado por autoridades legais</li>
                  <li>Sua conta ficar inativa por muito tempo</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitação de Responsabilidade</h2>
                <p>
                  O Exiva é fornecido "como está". Não garantimos que o serviço será ininterrupto ou livre de erros. 
                  Não somos responsáveis por:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Perdas ou danos no jogo Tibia</li>
                  <li>Disputas entre jogadores</li>
                  <li>Problemas técnicos ou indisponibilidade</li>
                  <li>Ações de terceiros</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Publicidade</h2>
                <p>
                  Nosso site exibe anúncios para manter o serviço gratuito. 
                  Usuários premium podem ter experiência sem anúncios. 
                  Não somos responsáveis pelo conteúdo dos anúncios de terceiros.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Modificações do Serviço</h2>
                <p>
                  Reservamos o direito de modificar, suspender ou descontinuar qualquer parte do serviço 
                  a qualquer momento, com ou sem aviso prévio.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Lei Aplicável</h2>
                <p>
                  Estes termos são regidos pelas leis brasileiras. 
                  Qualquer disputa será resolvida nos tribunais do Brasil.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contato</h2>
                <p>Para dúvidas sobre estes termos, entre em contato:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email: contato@exiva.com</li>
                  <li>GitHub: <a href="https://github.com/matheuszufi" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@matheuszufi</a></li>
                </ul>
              </section>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  Este site não é afiliado oficialmente com Tibia ou CipSoft GmbH. 
                  Tibia é uma marca registrada da CipSoft GmbH.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
