import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile, RoomLimits } from '../types/user';

export const useRoomLimits = (userId: string | undefined) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [roomLimits, setRoomLimits] = useState<RoomLimits>({
    maxRoomsPerDay: 1,
    maxSimultaneousRooms: 1,
    canCreateRoom: false,
    roomsCreatedToday: 0,
    activeRooms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userRef = doc(db, 'userProfiles', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          setUserProfile(profile);
          await updateRoomLimits(profile);
        } else {
          const defaultProfile: UserProfile = {
            uid: userId,
            email: '',
            accountType: 'free',
            roomsCreatedToday: 0,
            lastRoomCreatedDate: '',
            isPremium: false
          };
          
          await setDoc(userRef, defaultProfile);
          setUserProfile(defaultProfile);
          await updateRoomLimits(defaultProfile);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const updateRoomLimits = async (profile: UserProfile) => {
    const today = new Date().toDateString();
    const lastCreatedDate = profile.lastRoomCreatedDate || '';
    
    // Reset contador se é um novo dia
    const roomsToday = lastCreatedDate === today ? (profile.roomsCreatedToday || 0) : 0;
    
    // Contar salas ativas do usuário
    const activeRoomsCount = await getActiveRoomsCount(profile.uid);
    
    // Definir limites baseados no tipo de conta
    const isPremium = profile.accountType === 'premium' || profile.isPremium;
    const maxRoomsPerDay = isPremium ? Infinity : 1;
    const maxSimultaneous = isPremium ? 2 : 1;
    
    // Usuário pode criar se não atingiu o limite diário E não atingiu o limite simultâneo
    const canCreate = (isPremium || roomsToday < 1) && activeRoomsCount < maxSimultaneous;

    setRoomLimits({
      maxRoomsPerDay: maxRoomsPerDay,
      maxSimultaneousRooms: maxSimultaneous,
      canCreateRoom: canCreate,
      roomsCreatedToday: roomsToday,
      activeRooms: activeRoomsCount
    });
  };

  const getActiveRoomsCount = async (uid: string): Promise<number> => {
    try {
      const roomsQuery = query(
        collection(db, 'rooms'),
        where('createdBy', '==', uid),
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(roomsQuery);
      return snapshot.size;
    } catch (error) {
      console.error('Erro ao contar salas ativas:', error);
      return 0;
    }
  };

  const incrementRoomCount = async () => {
    if (!userId || !userProfile) return false;

    const today = new Date().toDateString();
    const lastCreatedDate = userProfile.lastRoomCreatedDate || '';
    
    // Reset contador se é um novo dia
    const currentCount = lastCreatedDate === today ? (userProfile.roomsCreatedToday || 0) : 0;
    const activeRoomsCount = await getActiveRoomsCount(userProfile.uid);

    // Verificar limites
    const isPremium = userProfile.accountType === 'premium' || userProfile.isPremium;
    const maxSimultaneous = isPremium ? 2 : 1;
    
    if (!isPremium && currentCount >= 1) {
      return false; // Limite diário excedido para conta gratuita
    }
    
    if (activeRoomsCount >= maxSimultaneous) {
      return false; // Limite de salas simultâneas excedido
    }

    try {
      const userRef = doc(db, 'userProfiles', userId);
      const newCount = lastCreatedDate === today ? currentCount + 1 : 1;
      
      const updates = {
        roomsCreatedToday: newCount,
        lastRoomCreatedDate: today
      };

      await updateDoc(userRef, updates);
      
      // Atualizar estado local
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      await updateRoomLimits(updatedProfile);
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar contador de salas:', error);
      return false;
    }
  };

  const upgradeToPremium = async () => {
    if (!userId) return false;

    try {
      const userRef = doc(db, 'userProfiles', userId);
      const premiumExpiry = new Date();
      premiumExpiry.setFullYear(premiumExpiry.getFullYear() + 1); // 1 ano de premium

      const updates = {
        accountType: 'premium' as const,
        isPremium: true,
        premiumExpiry: premiumExpiry
      };

      await updateDoc(userRef, updates);
      
      const updatedProfile = { ...userProfile!, ...updates };
      setUserProfile(updatedProfile);
      await updateRoomLimits(updatedProfile);
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer upgrade para premium:', error);
      return false;
    }
  };

  const getRemainingRooms = () => {
    const isPremium = userProfile?.accountType === 'premium' || userProfile?.isPremium;
    if (isPremium) return Infinity;
    
    const today = new Date().toDateString();
    const lastCreatedDate = userProfile?.lastRoomCreatedDate || '';
    const roomsToday = lastCreatedDate === today ? (userProfile?.roomsCreatedToday || 0) : 0;
    
    return Math.max(0, 1 - roomsToday);
  };

  const getRemainingSimultaneous = () => {
    const isPremium = userProfile?.accountType === 'premium' || userProfile?.isPremium;
    const maxSimultaneous = isPremium ? 2 : 1;
    return Math.max(0, maxSimultaneous - roomLimits.activeRooms);
  };

  const getResetTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  const refreshLimits = async () => {
    if (userProfile) {
      await updateRoomLimits(userProfile);
    }
  };

  return {
    userProfile,
    roomLimits,
    loading,
    incrementRoomCount,
    upgradeToPremium,
    getRemainingRooms,
    getRemainingSimultaneous,
    getResetTime,
    refreshLimits
  };
};
