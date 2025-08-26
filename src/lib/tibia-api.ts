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
  image_url: string;
  featured: boolean;
}

export interface Creature {
  name: string;
  race: string;
  image_url: string;
  featured: boolean;
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
    const response = await fetch(`${API_BASE_URL}/boostablebosses`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Bosses data received:', data);
    
    // A resposta tem a estrutura: { boostable_bosses: { boostable_boss_list: [...] } }
    return data.boostable_bosses?.boostable_boss_list?.map((boss: any) => ({
      name: boss.name,
      image_url: boss.image_url,
      featured: boss.featured
    })) || [];
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
    
    const data = await response.json();
    console.log('Creatures data received:', data);
    
    // A resposta tem a estrutura: { creatures: { creature_list: [...] } }
    return data.creatures?.creature_list?.map((creature: any) => ({
      name: creature.name,
      race: creature.race,
      image_url: creature.image_url,
      featured: creature.featured
    })) || [];
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
