import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Traduções
const translations = {
  pt: {
    // Header
    'header.myRooms': 'Minhas Salas',
    'header.profile': 'Perfil',
    'header.logout': 'Sair',
    'header.login': 'Entrar',
    'header.register': 'Cadastrar',
    'header.premium': 'Premium',
    
    // HomePage
    'home.title': 'Encontre Jogadores do Tibia',
    'home.subtitle': 'Veja algumas das parties ativas no momento. Cadastre-se para solicitar entrada e participar!',
    'home.startNow': 'Começar Agora',
    'home.availableParties': 'Parties Disponíveis',
    'home.noParties': 'Nenhuma party encontrada.',
    'home.noPartiesFilter': 'Nenhuma party corresponde aos filtros.',
    'home.waitForParties': 'Aguarde novos jogadores criarem parties!',
    'home.registerToJoin': 'Cadastre-se para Participar',
    'home.viewAllParties': 'Ver Todas as Parties',
    'home.createRoom': 'Criar Sala',
    'home.noRooms': 'Nenhuma party encontrada',
    'home.joinButton': 'Entrar',
    'home.membersCount': 'membros',
    'home.level': 'Level',
    'home.cta': 'Criar Conta Grátis',
    'home.searchPlaceholder': 'Buscar parties...',
    'home.searchTitle': 'Buscar Parties',
    'home.waitingMessage': 'Aguarde novos jogadores criarem parties!',
    'home.filterMessage': 'Tente ajustar os filtros de busca.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.availableParties': 'Parties Disponíveis',
    'dashboard.createParty': 'Criar Party',
    'dashboard.createRoom': 'Criar Nova Party',
    'dashboard.alreadyCreated': 'Você já criou uma party',
    'dashboard.filters': 'Filtros de Busca',
    'dashboard.searchParties': 'Buscar parties...',
    'dashboard.activityType': 'Tipo de Atividade',
    'dashboard.allTypes': 'Todos os Tipos',
    'dashboard.hunt': 'Hunt',
    'dashboard.boss': 'Boss',
    'dashboard.quest': 'Quest',
    'dashboard.world': 'World',
    'dashboard.allWorlds': 'Todos os Worlds',
    'dashboard.myWorld': 'Meu World',
    
    // Login page
    'login.title': 'Entrar',
    'login.subtitle': 'Acesse sua conta para encontrar parties',
    'login.emailPlaceholder': 'Email',
    'login.passwordPlaceholder': 'Senha',
    'login.loginButton': 'Entrar',
    'login.loggingIn': 'Entrando...',
    'login.googleButton': 'Continuar com Google',
    'login.noAccount': 'Não tem uma conta?',
    'login.signUpLink': 'Cadastre-se aqui',
    'login.backButton': 'Voltar',
    'login.orDivider': 'ou',
    'login.verificationError': 'Sua conta não foi verificada. Verifique seu email ou clique no botão abaixo para reenviar.',
    'login.resendVerification': 'Reenviar Email de Verificação',
    'login.verificationSent': 'Email de verificação reenviado! Verifique sua caixa de entrada.',
    'login.userNotFound': 'Usuário não encontrado',
    'login.wrongPassword': 'Senha incorreta',
    'login.invalidEmail': 'Email inválido',
    'login.genericError': 'Email ou senha incorretos',
    'login.googleError': 'Erro ao fazer login com Google. Tente novamente.',

    // Register page
    'register.title': 'Criar Conta',
    'register.subtitle': 'Junte-se à comunidade de jogadores',
    'register.namePlaceholder': 'Nome completo',
    'register.emailPlaceholder': 'Email',
    'register.passwordPlaceholder': 'Senha',
    'register.confirmPasswordPlaceholder': 'Confirmar senha',
    'register.createButton': 'Criar Conta',
    'register.creating': 'Criando conta...',
    'register.hasAccount': 'Já tem uma conta?',
    'register.loginLink': 'Entre aqui',
    'register.backButton': 'Voltar',
    
    // Cards
    'card.members': 'Membros',
    'card.minLevel': 'Level mínimo',
    'card.createdAt': 'Criado às',
    'card.scheduledFor': 'Agendada para',
    'card.bosses': 'Bosses:',
    'card.creatures': 'Criaturas:',
    'card.quests': 'Quests:',
    'card.freeSlot': 'Vaga Livre',
    
    // Features
    'features.findPlayers': 'Encontre Jogadores',
    'features.findPlayersDesc': 'Descubra outros jogadores do seu world e nivel para formar groups incríveis.',
    'features.createParties': 'Crie Parties',
    'features.createPartiesDesc': 'Monte seu próprio grupo especificando level, vocação e objetivos da hunt.',
    'features.safeReliable': 'Seguro & Confiável',
    'features.safeReliableDesc': 'Validação automática de personagens e sistema de reputação para uma experiência segura.',
    
    // Common
    'common.loading': 'Carregando...',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.close': 'Fechar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.clear': 'Limpar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.create': 'Criar',
    'common.update': 'Atualizar',
    'common.yes': 'Sim',
    'common.no': 'Não',
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español',
    
    // Footer
    'footer.developer': 'Desenvolvedor',
    'footer.github': 'GitHub',
    'footer.character': 'Personagem no Tibia',
    'footer.legal': 'Informações Legais',
    'footer.privacy': 'Política de Privacidade',
    'footer.terms': 'Termos de Serviço',
    'footer.about': 'Sobre',
    'footer.aboutDescription': 'Party Finder para Tibia',
    'footer.aboutSince': 'Conectando jogadores desde 2024',
    'footer.copyright': '© 2024 Exiva. Não afiliado oficialmente com Tibia ou CipSoft GmbH.',
    'footer.hasAccount': 'Já tem uma conta?',
    'footer.loginHere': 'Faça login aqui',
    'footer.readyTitle': 'Pronto para Aventurar?',
    'footer.readyDescription': 'Junte-se à nossa comunidade e comece a formar parties épicas hoje mesmo!'
  },
  en: {
    // Header
    'header.myRooms': 'My Rooms',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.register': 'Register',
    'header.premium': 'Premium',
    
    // HomePage
    'home.title': 'Find Tibia Players',
    'home.subtitle': 'See some of the active parties right now. Sign up to request entry and participate!',
    'home.startNow': 'Start Now',
    'home.availableParties': 'Available Parties',
    'home.noParties': 'No parties found.',
    'home.noPartiesFilter': 'No parties match the filters.',
    'home.waitForParties': 'Wait for new players to create parties!',
    'home.registerToJoin': 'Register to Join',
    'home.viewAllParties': 'View All Parties',
    'home.createRoom': 'Create Room',
    'home.noRooms': 'No parties found',
    'home.joinButton': 'Join',
    'home.membersCount': 'members',
    'home.level': 'Level',
    'home.cta': 'Create Free Account',
    'home.searchPlaceholder': 'Search parties...',
    'home.searchTitle': 'Search Parties',
    'home.waitingMessage': 'Wait for new players to create parties!',
    'home.filterMessage': 'Try adjusting the search filters.',
    
    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.availableParties': 'Available Parties',
    'dashboard.createParty': 'Create Party',
    'dashboard.createRoom': 'Create New Party',
    'dashboard.alreadyCreated': 'You already created a party',
    'dashboard.filters': 'Search Filters',
    'dashboard.searchParties': 'Search parties...',
    'dashboard.activityType': 'Activity Type',
    'dashboard.allTypes': 'All Types',
    'dashboard.hunt': 'Hunt',
    'dashboard.boss': 'Boss',
    'dashboard.quest': 'Quest',
    'dashboard.world': 'World',
    'dashboard.allWorlds': 'All Worlds',
    'dashboard.myWorld': 'My World',
    
    // Login page
    'login.title': 'Login',
    'login.subtitle': 'Access your account to find parties',
    'login.emailPlaceholder': 'Email',
    'login.passwordPlaceholder': 'Password',
    'login.loginButton': 'Login',
    'login.loggingIn': 'Logging in...',
    'login.googleButton': 'Continue with Google',
    'login.noAccount': "Don't have an account?",
    'login.signUpLink': 'Sign up here',
    'login.backButton': 'Back',
    'login.orDivider': 'or',
    'login.verificationError': 'Your account is not verified. Check your email or click the button below to resend.',
    'login.resendVerification': 'Resend Verification Email',
    'login.verificationSent': 'Verification email resent! Check your inbox.',
    'login.userNotFound': 'User not found',
    'login.wrongPassword': 'Wrong password',
    'login.invalidEmail': 'Invalid email',
    'login.genericError': 'Incorrect email or password',
    'login.googleError': 'Error logging in with Google. Please try again.',

    // Register page
    'register.title': 'Create Account',
    'register.subtitle': 'Join the player community',
    'register.namePlaceholder': 'Full name',
    'register.emailPlaceholder': 'Email',
    'register.passwordPlaceholder': 'Password',
    'register.confirmPasswordPlaceholder': 'Confirm password',
    'register.createButton': 'Create Account',
    'register.creating': 'Creating account...',
    'register.hasAccount': 'Already have an account?',
    'register.loginLink': 'Login here',
    'register.backButton': 'Back',
    
    // Cards
    'card.members': 'Members',
    'card.minLevel': 'Min level',
    'card.createdAt': 'Created at',
    'card.scheduledFor': 'Scheduled for',
    'card.bosses': 'Bosses:',
    'card.creatures': 'Creatures:',
    'card.quests': 'Quests:',
    'card.freeSlot': 'Free Slot',
    
    // Features
    'features.findPlayers': 'Find Players',
    'features.findPlayersDesc': 'Discover other players from your world and level to form amazing groups.',
    'features.createParties': 'Create Parties',
    'features.createPartiesDesc': 'Build your own group specifying level, vocation and hunt objectives.',
    'features.safeReliable': 'Safe & Reliable',
    'features.safeReliableDesc': 'Automatic character validation and reputation system for a safe experience.',
    
    // Common
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.clear': 'Clear',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español',
    
    // Footer
    'footer.developer': 'Developer',
    'footer.github': 'GitHub',
    'footer.character': 'Character in Tibia',
    'footer.legal': 'Legal Information',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.about': 'About',
    'footer.aboutDescription': 'Party Finder for Tibia',
    'footer.aboutSince': 'Connecting players since 2024',
    'footer.copyright': '© 2024 Exiva. Not officially affiliated with Tibia or CipSoft GmbH.',
    'footer.hasAccount': 'Already have an account?',
    'footer.loginHere': 'Login here',
    'footer.readyTitle': 'Ready to Adventure?',
    'footer.readyDescription': 'Join our community and start forming epic parties today!'
  },
  es: {
    // Header
    'header.myRooms': 'Mis Salas',
    'header.profile': 'Perfil',
    'header.logout': 'Salir',
    'header.login': 'Entrar',
    'header.register': 'Registrarse',
    'header.premium': 'Premium',
    
    // HomePage
    'home.title': 'Encuentra Jugadores de Tibia',
        'home.subtitle': 'Ve algunas de las parties activas en este momento. ¡Regístrate para solicitar entrada y participar!',
    'home.startNow': 'Empezar Ahora',
    'home.availableParties': 'Parties Disponibles',
    'home.noParties': 'No se encontraron parties.',
    'home.noPartiesFilter': 'Ninguna party coincide con los filtros.',
    'home.waitForParties': '¡Espera a que nuevos jugadores creen parties!',
    'home.registerToJoin': 'Regístrate para Participar',
    'home.viewAllParties': 'Ver Todas las Parties',
    'home.createRoom': 'Crear Sala',
    'home.noRooms': 'No se encontraron parties',
    'home.joinButton': 'Unirse',
    'home.membersCount': 'miembros',
    'home.level': 'Nivel',
    'home.cta': 'Crear Cuenta Gratuita',
    'home.searchPlaceholder': 'Buscar parties...',
    'home.searchTitle': 'Buscar Parties',
    'home.waitingMessage': '¡Espera a que nuevos jugadores creen parties!',
    'home.filterMessage': 'Intenta ajustar los filtros de búsqueda.',
    
    // Dashboard
    'dashboard.title': 'Panel',
    'dashboard.availableParties': 'Parties Disponibles',
    'dashboard.createParty': 'Crear Party',
    'dashboard.createRoom': 'Crear Nueva Party',
    'dashboard.alreadyCreated': 'Ya creaste una party',
    'dashboard.filters': 'Filtros de Búsqueda',
    'dashboard.searchParties': 'Buscar parties...',
    'dashboard.activityType': 'Tipo de Actividad',
    'dashboard.allTypes': 'Todos los Tipos',
    'dashboard.hunt': 'Hunt',
    'dashboard.boss': 'Boss',
    'dashboard.quest': 'Quest',
    'dashboard.world': 'Mundo',
    'dashboard.allWorlds': 'Todos los Mundos',
    'dashboard.myWorld': 'Mi Mundo',
    
    // Login page
    'login.title': 'Entrar',
    'login.subtitle': 'Accede a tu cuenta para encontrar parties',
    'login.emailPlaceholder': 'Email',
    'login.passwordPlaceholder': 'Contraseña',
    'login.loginButton': 'Entrar',
    'login.loggingIn': 'Entrando...',
    'login.googleButton': 'Continuar con Google',
    'login.noAccount': '¿No tienes una cuenta?',
    'login.signUpLink': 'Regístrate aquí',
    'login.backButton': 'Volver',
    'login.orDivider': 'o',
    'login.verificationError': 'Tu cuenta no está verificada. Revisa tu email o haz clic en el botón de abajo para reenviar.',
    'login.resendVerification': 'Reenviar Email de Verificación',
    'login.verificationSent': '¡Email de verificación reenviado! Revisa tu bandeja de entrada.',
    'login.userNotFound': 'Usuario no encontrado',
    'login.wrongPassword': 'Contraseña incorrecta',
    'login.invalidEmail': 'Email inválido',
    'login.genericError': 'Email o contraseña incorrectos',
    'login.googleError': 'Error al iniciar sesión con Google. Inténtalo de nuevo.',

    // Register page
    'register.title': 'Crear Cuenta',
    'register.subtitle': 'Únete a la comunidad de jugadores',
    'register.namePlaceholder': 'Nombre completo',
    'register.emailPlaceholder': 'Email',
    'register.passwordPlaceholder': 'Contraseña',
    'register.confirmPasswordPlaceholder': 'Confirmar contraseña',
    'register.createButton': 'Crear Cuenta',
    'register.creating': 'Creando cuenta...',
    'register.hasAccount': '¿Ya tienes una cuenta?',
    'register.loginLink': 'Entra aquí',
    'register.backButton': 'Volver',
    
    // Cards
    'card.members': 'Miembros',
    'card.minLevel': 'Nivel mínimo',
    'card.createdAt': 'Creado a las',
    'card.scheduledFor': 'Programada para',
    'card.bosses': 'Bosses:',
    'card.creatures': 'Criaturas:',
    'card.quests': 'Quests:',
    'card.freeSlot': 'Lugar Libre',
    
    // Features
    'features.findPlayers': 'Encuentra Jugadores',
    'features.findPlayersDesc': 'Descubre otros jugadores de tu mundo y nivel para formar grupos increíbles.',
    'features.createParties': 'Crea Parties',
    'features.createPartiesDesc': 'Arma tu propio grupo especificando nivel, vocación y objetivos de hunt.',
    'features.safeReliable': 'Seguro y Confiable',
    'features.safeReliableDesc': 'Validación automática de personajes y sistema de reputación para una experiencia segura.',
    
    // Common
    'common.loading': 'Cargando...',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.clear': 'Limpiar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español',
    
    // Footer
    'footer.developer': 'Desarrollador',
    'footer.github': 'GitHub',
    'footer.character': 'Personaje en Tibia',
    'footer.legal': 'Información Legal',
    'footer.privacy': 'Política de Privacidad',
    'footer.terms': 'Términos de Servicio',
    'footer.about': 'Acerca de',
    'footer.aboutDescription': 'Party Finder para Tibia',
    'footer.aboutSince': 'Conectando jugadores desde 2024',
    'footer.copyright': '© 2024 Exiva. No afiliado oficialmente con Tibia o CipSoft GmbH.',
    'footer.hasAccount': '¿Ya tienes una cuenta?',
    'footer.loginHere': 'Inicia sesión aquí',
    'footer.readyTitle': '¿Listo para Aventurar?',
    'footer.readyDescription': '¡Únete a nuestra comunidad y comienza a formar parties épicas hoy mismo!'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('tibia-party-finder-language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tibia-party-finder-language', lang);
  };

  const t = (key: string): string => {
    const translation = translations[language];
    return (translation as any)[key] || key;
  };

  useEffect(() => {
    // Atualizar a tag html lang
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
