export interface UserProfile {
  uid: string;
  email: string;
  accountType: 'free' | 'premium';
  roomsCreatedToday?: number;
  lastRoomCreatedDate?: string;
  premiumExpiry?: Date;
  isPremium?: boolean;
}

export interface RoomLimits {
  maxRoomsPerDay: number;
  maxSimultaneousRooms: number; // Nova propriedade para salas simultâneas
  canCreateRoom: boolean;
  roomsCreatedToday: number;
  activeRooms: number; // Quantas salas o usuário tem ativas no momento
}
