// Tipos básicos para o projeto

export interface Character {
  name: string;
  level: number;
  vocation: string;
  world: string;
}

export interface PartyRoom {
  id: string;
  title: string;
  description: string;
  huntType: string;
  minLevel: number;
  maxLevel: number;
  maxMembers: number;
  currentMembers: number;
  requiredVocations: string[];
  world: string;
  createdBy: string;
  createdAt: any; // Firebase Timestamp
  members: string[];
  isActive: boolean;
  isScheduled?: boolean; // Indica se a sala é agendada
  scheduledFor?: any; // Firebase Timestamp para quando a sala deve começar
  expiresAt?: any; // Firebase Timestamp para quando a sala expira
  activityType?: string;
  selectedTargets?: string[];
}

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
  status: 'open' | 'closed' | 'full';
}

export type Vocation = 'knight' | 'paladin' | 'druid' | 'sorcerer' | 'monk';

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
}
