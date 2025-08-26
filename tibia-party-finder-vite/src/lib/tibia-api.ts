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
