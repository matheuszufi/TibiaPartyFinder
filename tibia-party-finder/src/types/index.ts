// Tipos para o TibiaData API
export interface Character {
  name: string;
  level: number;
  vocation: string;
  world: string;
}

export interface TibiaWorld {
  name: string;
  status: string;
  players_online: number;
  location: string;
  pvp_type: string;
}

export interface Quest {
  name: string;
  danger_level: number;
  category: string;
}

export interface Boss {
  name: string;
  hp: number;
  locations: string[];
  loot: string[];
}

export interface Hunt {
  name: string;
  location: string;
  experience_bonus: number;
  profit_bonus: number;
  level_requirement: number;
}

// Tipos para o sistema de salas
export interface Room {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  world: string;
  activity: {
    type: 'quest' | 'boss' | 'hunt';
    name: string;
  };
  maxPlayers: number;
  currentPlayers: number;
  requiredVocations: VocationRequirement[];
  players: RoomPlayer[];
  status: 'open' | 'closed' | 'full';
}

export interface VocationRequirement {
  vocation: Vocation;
  count: number;
  filled: number;
}

export interface RoomPlayer {
  userId: string;
  characterName: string;
  vocation: Vocation;
  level: number;
  joinedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export type Vocation = 'knight' | 'paladin' | 'druid' | 'sorcerer' | 'monk';

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}
