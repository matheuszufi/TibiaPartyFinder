const API_BASE_URL = 'https://api.tibiadata.com/v4';

export interface Character {
  name: string;
  level: number;
  vocation: string;
  world: string;
  sex: string;
  residence: string;
  last_login: string;
  account_status: string;
  status: string;
  guild?: {
    name: string;
    rank: string;
  };
}

export interface World {
  name: string;
  status: string;
  players_online: number;
  location: string;
  pvp_type: string;
  premium_only: boolean;
  transfer_type: string;
  world_quest_titles: string[];
  battleye_protected: boolean;
  battleye_date: string;
  game_world_type: string;
  tournament_world_type: string;
}

export interface Boss {
  name: string;
  race: string;
  image_url?: string;
}

export interface Creature {
  name: string;
  race: string;
  image_url?: string;
}

export interface BosstiaryResponse {
  bosstiary: {
    bosses: Boss[];
  };
}

export interface CreaturesResponse {
  creatures: {
    creatures: Creature[];
  };
}

export async function searchCharacter(name: string): Promise<Character | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/character/${encodeURIComponent(name)}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.character && data.character.character) {
      return data.character.character;
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar personagem:', error);
    return null;
  }
}

export async function getWorlds(): Promise<World[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/worlds`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.worlds && data.worlds.regular_worlds) {
      return data.worlds.regular_worlds;
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao buscar mundos:', error);
    return [];
  }
}

export async function fetchBosses(): Promise<Boss[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/bosstiary`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: BosstiaryResponse = await response.json();
    return data.bosstiary?.bosses || [];
  } catch (error) {
    console.error('Erro ao buscar bosses:', error);
    return [];
  }
}

export async function fetchCreatures(): Promise<Creature[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/creatures`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CreaturesResponse = await response.json();
    return data.creatures?.creatures || [];
  } catch (error) {
    console.error('Erro ao buscar criaturas:', error);
    return [];
  }
}

// Lista estática de quests populares (já que a API não tem endpoint específico)
export const TIBIA_QUESTS = [
  'Heart of Destruction',
  'Forgotten Knowledge', 
  'Grave Danger',
  'Cobra Bastion',
  'Falcon Bastion',
  'Ferumbras Ascendant',
  'Goshnar\'s Hatred',
  'The Secret Library',
  'Kilmaresh',
  'Bounac',
  'The Elemental Spheres',
  'The Isle of Evil',
  'The Inquisition',
  'The Demon Oak',
  'Dreamers Challenge',
  'Warzones',
  'The Annihilator',
  'Demon Helmet Quest',
  'The Postman Missions',
  'Blessed Ankh',
  'Explorer Society',
  'Pits of Inferno',
  'The Thieves Guild',
  'What a Foolish Quest',
  'Demon Legs',
  'Giant Sword Quest',
  'Fire Axe Quest',
  'Crusader Helmet',
  'Black Knight Quest',
  'Vampire Shield'
];
