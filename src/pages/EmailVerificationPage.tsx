import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Mail, RefreshCw } from 'lucide-react';

export default function EmailVerificationPage() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const resendVerificationEmail = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage('');

    try {
      await sendEmailVerification(user);
      setMessage('Email de verificação reenviado com sucesso!');
      setCountdown(60); // 60 segundos de cooldown
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      setMessage('Erro ao reenviar email. Tente novamente.');
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const refreshVerificationStatus = () => {
    if (user) {
      user.reload().then(() => {
        if (user.emailVerified) {
          window.location.href = '/dashboard';
        } else {
          setMessage('Email ainda não verificado. Verifique sua caixa de entrada.');
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl border border-gray-200">
        <CardHeader className="text-center space-y-4">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Verificação de Email</CardTitle>
          <CardDescription className="text-gray-600">
            Enviamos um email de verificação para <strong>{user?.email}</strong>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              Clique no link do email para verificar sua conta. Após verificar, clique no botão abaixo para continuar.
            </p>

            {message && (
              <div className={`p-3 rounded-lg ${
                message.includes('sucesso') 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-red-50 border border-red-200 text-red-700'
              }`}>
                <p className="text-sm text-center">{message}</p>
              </div>
            )}

            <Button
              onClick={refreshVerificationStatus}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Verificar Status
            </Button>

            <Button
              onClick={resendVerificationEmail}
              disabled={loading || countdown > 0}
              variant="outline"
              className="w-full"
            >
              {loading ? 'Enviando...' : countdown > 0 ? `Aguarde ${countdown}s` : 'Reenviar Email'}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-gray-600 text-sm mb-2">
                Não recebeu o email? Verifique sua pasta de spam.
              </p>
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-900"
              >
                Fazer login com outra conta
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
