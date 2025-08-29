import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import exivaLogo from '../assets/images/exiva.png';

export default function PrivacyPolicyPage() {

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
              Política de Privacidade
            </CardTitle>
            <p className="text-center text-gray-600 mt-2">
              Última atualização: 29 de agosto de 2025
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-gray-700">
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Informações que Coletamos</h2>
                <div className="space-y-3">
                  <h3 className="font-medium">1.1 Informações Fornecidas por Você</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nome de usuário e senha para criação de conta</li>
                    <li>Endereço de email para verificação e comunicação</li>
                    <li>Nome do personagem do Tibia para validação</li>
                    <li>Informações de perfil opcionais (server, level, vocação)</li>
                  </ul>
                  
                  <h3 className="font-medium">1.2 Informações Coletadas Automaticamente</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Endereço IP e dados de navegação</li>
                    <li>Cookies e tecnologias similares</li>
                    <li>Informações de uso da plataforma</li>
                    <li>Dados de analytics (Google Analytics)</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Como Usamos suas Informações</h2>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Fornecer e manter nossos serviços</li>
                  <li>Autenticar usuários e verificar personagens</li>
                  <li>Facilitar a formação de grupos (parties)</li>
                  <li>Enviar notificações importantes sobre o serviço</li>
                  <li>Melhorar nossos serviços através de analytics</li>
                  <li>Cumprir obrigações legais</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Compartilhamento de Informações</h2>
                <p>Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, exceto:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Com seu consentimento explícito</li>
                  <li>Para cumprir obrigações legais</li>
                  <li>Com provedores de serviços (Firebase, Vercel) sob acordos de confidencialidade</li>
                  <li>Para proteger nossos direitos e segurança</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cookies e Tecnologias Similares</h2>
                <p>Utilizamos cookies para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Manter você logado em sua conta</li>
                  <li>Lembrar suas preferências</li>
                  <li>Coletar dados de analytics (Google Analytics)</li>
                  <li>Exibir anúncios relevantes (Google AdSense)</li>
                </ul>
                <p className="mt-2">Você pode desabilitar cookies em seu navegador, mas isso pode afetar a funcionalidade do site.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Publicidade</h2>
                <p>Utilizamos o Google AdSense para exibir anúncios personalizados. O Google pode usar cookies para:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Exibir anúncios baseados em suas visitas a este e outros sites</li>
                  <li>Medir a eficácia dos anúncios</li>
                  <li>Fornecer anúncios mais relevantes</li>
                </ul>
                <p className="mt-2">
                  Você pode optar por não receber anúncios personalizados visitando 
                  <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                    Configurações de Anúncios do Google
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Segurança</h2>
                <p>Implementamos medidas de segurança adequadas para proteger suas informações:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Criptografia de dados em trânsito (HTTPS)</li>
                  <li>Autenticação segura via Firebase</li>
                  <li>Acesso limitado aos dados pessoais</li>
                  <li>Monitoramento regular de segurança</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Seus Direitos</h2>
                <p>Você tem o direito de:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Acessar suas informações pessoais</li>
                  <li>Corrigir dados incorretos</li>
                  <li>Excluir sua conta e dados</li>
                  <li>Optar por não receber comunicações</li>
                  <li>Transferir seus dados</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Retenção de Dados</h2>
                <p>Mantemos suas informações pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei. Contas inativas por mais de 2 anos podem ser excluídas.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Menores de Idade</h2>
                <p>Nossos serviços são destinados a usuários maiores de 13 anos. Não coletamos intencionalmente informações de menores de 13 anos.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Alterações nesta Política</h2>
                <p>Podemos atualizar esta política periodicamente. Notificaremos sobre mudanças significativas por email ou através do site.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contato</h2>
                <p>Para dúvidas sobre esta política de privacidade, entre em contato:</p>
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
