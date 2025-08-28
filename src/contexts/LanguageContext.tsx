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
    
    // HomePage
    'home.title': 'Encontre Jogadores do Tibia',
    'home.subtitle': 'Conecte-se com outros jogadores para hunts, bosses e quests',
    'home.startNow': 'Começar Agora',
    'home.availableParties': 'Parties Disponíveis',
    'home.noParties': 'Nenhuma party encontrada.',
    'home.waitForParties': 'Aguarde novos jogadores criarem parties!',
    'home.registerToJoin': 'Cadastre-se para Participar',
    'home.viewAllParties': 'Ver Todas as Parties',
    
    // Dashboard
    'dashboard.availableParties': 'Parties Disponíveis',
    'dashboard.createParty': 'Criar Party',
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
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español'
  },
  en: {
    // Header
    'header.myRooms': 'My Rooms',
    'header.profile': 'Profile',
    'header.logout': 'Logout',
    'header.login': 'Login',
    'header.register': 'Register',
    
    // HomePage
    'home.title': 'Find Tibia Players',
    'home.subtitle': 'Connect with other players for hunts, bosses and quests',
    'home.startNow': 'Start Now',
    'home.availableParties': 'Available Parties',
    'home.noParties': 'No parties found.',
    'home.waitForParties': 'Wait for new players to create parties!',
    'home.registerToJoin': 'Register to Join',
    'home.viewAllParties': 'View All Parties',
    
    // Dashboard
    'dashboard.availableParties': 'Available Parties',
    'dashboard.createParty': 'Create Party',
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
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español'
  },
  es: {
    // Header
    'header.myRooms': 'Mis Salas',
    'header.profile': 'Perfil',
    'header.logout': 'Salir',
    'header.login': 'Entrar',
    'header.register': 'Registrarse',
    
    // HomePage
    'home.title': 'Encuentra Jugadores de Tibia',
    'home.subtitle': 'Conéctate con otros jugadores para hunts, bosses y quests',
    'home.startNow': 'Empezar Ahora',
    'home.availableParties': 'Parties Disponibles',
    'home.noParties': 'No se encontraron parties.',
    'home.waitForParties': '¡Espera a que nuevos jugadores creen parties!',
    'home.registerToJoin': 'Regístrate para Participar',
    'home.viewAllParties': 'Ver Todas las Parties',
    
    // Dashboard
    'dashboard.availableParties': 'Parties Disponibles',
    'dashboard.createParty': 'Crear Party',
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
    
    // Language
    'language.portuguese': 'Português',
    'language.english': 'English',
    'language.spanish': 'Español'
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
    return translations[language][key as keyof typeof translations['pt']] || key;
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
