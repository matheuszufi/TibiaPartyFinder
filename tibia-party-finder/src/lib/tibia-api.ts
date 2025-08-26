import { Character, TibiaWorld, Quest, Boss, Hunt } from '../types';

const TIBIA_API_BASE = 'https://api.tibiadata.com/v4';

export const tibiaApi = {
  // Buscar personagem
  async getCharacter(name: string): Promise<Character | null> {
    try {
      const response = await fetch(`${TIBIA_API_BASE}/character/${encodeURIComponent(name)}`);
      const data = await response.json();
      
      if (data.character && data.character.character) {
        const char = data.character.character;
        return {
          name: char.name,
          level: char.level,
          vocation: char.vocation,
          world: char.world
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching character:', error);
      return null;
    }
  },

  // Buscar mundos
  async getWorlds(): Promise<TibiaWorld[]> {
    try {
      const response = await fetch(`${TIBIA_API_BASE}/worlds`);
      const data = await response.json();
      
      if (data.worlds && data.worlds.regular_worlds) {
        return data.worlds.regular_worlds.map((world: any) => ({
          name: world.name,
          status: world.status,
          players_online: world.players_online,
          location: world.location,
          pvp_type: world.pvp_type
        }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching worlds:', error);
      return [];
    }
  },

  // Dados mockados para quests, bosses e hunts (a API do Tibia não tem essas informações estruturadas)
  getQuests(): Quest[] {
    return [
      { name: "The Inquisition Quest", danger_level: 5, category: "Main Quest" },
      { name: "Annihilator Quest", danger_level: 4, category: "Equipment Quest" },
      { name: "Demon Oak Quest", danger_level: 3, category: "Achievement Quest" },
      { name: "Wrath of the Emperor", danger_level: 5, category: "Main Quest" },
      { name: "The Secret Library", danger_level: 4, category: "Main Quest" },
      { name: "Grave Danger", danger_level: 5, category: "Main Quest" },
      { name: "Heart of Destruction", danger_level: 5, category: "Main Quest" },
      { name: "The Order of the Falcon", danger_level: 3, category: "Achievement Quest" }
    ];
  },

  getBosses(): Boss[] {
    return [
      { name: "Ferumbras", hp: 35000, locations: ["Ferumbras Citadel"], loot: ["Ferumbras' Hat", "Ceremonial Ankh"] },
      { name: "Morgaroth", hp: 55000, locations: ["Pits of Inferno"], loot: ["Morgaroth's Heart", "Demon Legs"] },
      { name: "Orshabaal", hp: 20000, locations: ["Pits of Inferno"], loot: ["Orshabaal's Brain", "Mastermind Shield"] },
      { name: "Ghazbaran", hp: 60000, locations: ["Pits of Inferno"], loot: ["Ghazbaran's Head", "Magic Plate Armor"] },
      { name: "Zugurosh", hp: 52500, locations: ["Deeper Banuta"], loot: ["Zugurosh's Heart", "Banana Staff"] },
      { name: "Latrivan", hp: 65000, locations: ["Secret Library"], loot: ["Latrivan's Mask", "Soulcutter"] },
      { name: "Lloyd", hp: 60000, locations: ["Secret Library"], loot: ["Lloyd's Beacon", "Falcon Battleaxe"] },
      { name: "Preceptor Lazare", hp: 75000, locations: ["Secret Library"], loot: ["Preceptor's Seal", "Soulshredder"] }
    ];
  },

  getHunts(): Hunt[] {
    return [
      { name: "Roshamuul Bridge", location: "Roshamuul", experience_bonus: 150, profit_bonus: 100, level_requirement: 130 },
      { name: "Asura Palace", location: "Tiquanda", experience_bonus: 120, profit_bonus: 80, level_requirement: 80 },
      { name: "Banuta -4", location: "Banuta", experience_bonus: 100, profit_bonus: 60, level_requirement: 60 },
      { name: "Oramond West", location: "Oramond", experience_bonus: 140, profit_bonus: 90, level_requirement: 100 },
      { name: "Prison -1", location: "Liberty Bay", experience_bonus: 160, profit_bonus: 120, level_requirement: 150 },
      { name: "Lower Roshamuul", location: "Roshamuul", experience_bonus: 180, profit_bonus: 150, level_requirement: 200 },
      { name: "Falcon Bastion", location: "Edron", experience_bonus: 200, profit_bonus: 180, level_requirement: 250 },
      { name: "Cobras", location: "Feyrist", experience_bonus: 170, profit_bonus: 140, level_requirement: 180 }
    ];
  }
};
