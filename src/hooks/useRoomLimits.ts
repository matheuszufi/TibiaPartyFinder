import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { UserProfile, RoomLimits } from '../types/user';

export const useRoomLimits = (userId: string | undefined) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [roomLimits, setRoomLimits] = useState<RoomLimits>({
    maxRoomsPerDay: 1,
    canCreateRoom: false,
    roomsCreatedToday: 0
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
          updateRoomLimits(profile);
        } else {
          // Criar perfil padrão para usuários novos
          const defaultProfile: UserProfile = {
            uid: userId,
            email: '',
            accountType: 'free',
            roomsCreatedToday: 0,
            lastRoomCreatedDate: ''
          };
          
          await setDoc(userRef, defaultProfile);
          setUserProfile(defaultProfile);
          updateRoomLimits(defaultProfile);
        }
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const updateRoomLimits = (profile: UserProfile) => {
    const today = new Date().toDateString();
    const lastCreatedDate = profile.lastRoomCreatedDate || '';
    
    // Reset contador se é um novo dia
    const roomsToday = lastCreatedDate === today ? (profile.roomsCreatedToday || 0) : 0;
    
    const maxRooms = profile.accountType === 'premium' ? Infinity : 1;
    const canCreate = roomsToday < maxRooms;

    setRoomLimits({
      maxRoomsPerDay: profile.accountType === 'premium' ? Infinity : 1,
      canCreateRoom: canCreate,
      roomsCreatedToday: roomsToday
    });
  };

  const incrementRoomCount = async () => {
    if (!userId || !userProfile) return false;

    const today = new Date().toDateString();
    const lastCreatedDate = userProfile.lastRoomCreatedDate || '';
    
    // Reset contador se é um novo dia
    const currentCount = lastCreatedDate === today ? (userProfile.roomsCreatedToday || 0) : 0;
    
    // Verificar se pode criar
    if (userProfile.accountType === 'free' && currentCount >= 1) {
      return false;
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
      updateRoomLimits(updatedProfile);
      
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
        premiumExpiry: premiumExpiry
      };

      await updateDoc(userRef, updates);
      
      const updatedProfile = { ...userProfile!, ...updates };
      setUserProfile(updatedProfile);
      updateRoomLimits(updatedProfile);
      
      return true;
    } catch (error) {
      console.error('Erro ao fazer upgrade para premium:', error);
      return false;
    }
  };

  const getRemainingRooms = () => {
    if (userProfile?.accountType === 'premium') return Infinity;
    return Math.max(0, 1 - roomLimits.roomsCreatedToday);
  };

  const getResetTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  return {
    userProfile,
    roomLimits,
    loading,
    incrementRoomCount,
    upgradeToPremium,
    getRemainingRooms,
    getResetTime
  };
};
