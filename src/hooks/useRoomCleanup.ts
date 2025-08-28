import { useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../lib/firebase';

export const useRoomCleanup = () => {
  const [user] = useAuthState(auth);

  useEffect(() => {
    // Só executar se o usuário estiver autenticado
    if (!user) return;

    const cleanupExpiredRooms = async () => {
      try {
        const now = new Date();
        const roomsRef = collection(db, 'rooms');
        
        // Buscar apenas as salas do usuário atual para limpeza
        const userRoomsQuery = query(roomsRef, where('createdBy', '==', user.uid));
        const roomsSnapshot = await getDocs(userRoomsQuery);
        
        const deletionPromises: Promise<void>[] = [];
        
        roomsSnapshot.forEach((roomDoc) => {
          const roomData = roomDoc.data();
          const expiresAt = roomData.expiresAt?.toDate();
          const createdAt = roomData.createdAt?.toDate();
          const isScheduled = roomData.isScheduled;
          const scheduledFor = roomData.scheduledFor?.toDate();
          
          // Verificar se a sala expirou
          let shouldDelete = false;
          
          if (isScheduled && scheduledFor) {
            // Para salas agendadas, deletar quando passar da data/hora agendada
            if (now > scheduledFor) {
              shouldDelete = true;
              console.log(`🗓️ Sala agendada expirou: ${roomData.title} (agendada para ${scheduledFor.toLocaleString()})`);
            }
          } else if (expiresAt && now > expiresAt) {
            // Para salas normais, usar expiresAt
            shouldDelete = true;
            console.log(`⏰ Sala expirou: ${roomData.title} (expirava em ${expiresAt.toLocaleString()})`);
          } else if (createdAt && !expiresAt) {
            // Fallback para salas antigas sem expiresAt - 2 horas para dar mais tempo
            const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            if (createdAt < twoHoursAgo) {
              shouldDelete = true;
              console.log(`🕐 Sala antiga sem expiresAt: ${roomData.title} (criada em ${createdAt.toLocaleString()})`);
            }
          }
          
          if (shouldDelete) {
            console.log(`🗑️ Removendo sala expirada do usuário: ${roomData.title} (ID: ${roomDoc.id})`);
            deletionPromises.push(deleteDoc(doc(db, 'rooms', roomDoc.id)));
          }
        });
        
        // Executar todas as deleções
        if (deletionPromises.length > 0) {
          await Promise.all(deletionPromises);
          console.log(`✅ ${deletionPromises.length} salas expiradas do usuário foram removidas`);
        }
      } catch (error) {
        console.error('❌ Erro ao limpar salas expiradas do usuário:', error);
      }
    };

    // Executar limpeza ao carregar (com delay para garantir autenticação)
    const initialTimeout = setTimeout(cleanupExpiredRooms, 3000);
    
    // Executar limpeza a cada 10 minutos (menos frequente)
    const interval = setInterval(cleanupExpiredRooms, 10 * 60 * 1000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [user]);
};
