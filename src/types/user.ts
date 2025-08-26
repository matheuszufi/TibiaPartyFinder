export interface UserProfile {
  uid: string;
  email: string;
  accountType: 'free' | 'premium';
  roomsCreatedToday?: number;
  lastRoomCreatedDate?: string;
  premiumExpiry?: Date;
}

export interface RoomLimits {
  maxRoomsPerDay: number;
  canCreateRoom: boolean;
  roomsCreatedToday: number;
}
