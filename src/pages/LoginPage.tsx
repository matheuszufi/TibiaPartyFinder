import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { signInWithGoogle } from '../lib/auth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import exiva2 from '../assets/images/exiva2.png';

export default function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      console.log('Tentando fazer login com:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Verificar se o email foi verificado
      if (!userCredential.user.emailVerified) {
        setNeedsVerification(true);
        setError(t('login.verificationError'));
        setLoading(false);
        return;
      }
      
      console.log('Login realizado com sucesso:', userCredential.user.uid);
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Erro no login:', error);
      if (error.code === 'auth/user-not-found') {
        setError(t('login.userNotFound'));
      } else if (error.code === 'auth/wrong-password') {
        setError(t('login.wrongPassword'));
      } else if (error.code === 'auth/invalid-email') {
        setError(t('login.invalidEmail'));
      } else {
        setError(t('login.genericError'));
      }
    }

    setLoading(false);
  };

  const resendVerificationEmail = async () => {
    if (!email) {
      setError(t('login.emailPlaceholder'));
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      setError(t('login.verificationSent'));
    } catch (error) {
      setError(t('login.resendVerification'));
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      if (result?.user) {
        console.log('Login com Google realizado com sucesso:', result.user.uid);
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Erro no login com Google:', error);
      setError(t('login.googleError'));
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('login.backButton')}
          </Link>
        </Button>

        <Card className="bg-white shadow-xl border border-gray-200">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center mx-auto">
              <img src={exiva2} alt="Exiva" className="h-20 w-20" />
            </div>
            <CardTitle className="text-2xl text-gray-900">{t('login.title')}</CardTitle>
            <CardDescription className="text-gray-600">
              {t('login.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder={t('login.emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm text-center">{error}</p>
                  {needsVerification && (
                    <Button
                      type="button"
                      onClick={resendVerificationEmail}
                      className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-sm"
                    >
                      {t('login.resendVerification')}
                    </Button>
                  )}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? t('login.loggingIn') : t('login.loginButton')}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">{t('login.orDivider')}</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t('login.googleButton')}
            </Button>

            <div className="text-center">
              <p className="text-gray-600">
                {t('login.noAccount')}{' '}
                <Link to="/register" className="text-blue-600 hover:text-blue-700 hover:underline">
                  {t('login.signUpLink')}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
