import { useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useRoomCleanup = () => {
  useEffect(() => {
    const cleanupExpiredRooms = async () => {
      try {
        const now = new Date();
        const roomsRef = collection(db, 'rooms');
        
        // Buscar todas as salas ativas
        const activeRoomsQuery = query(roomsRef, where('isActive', '==', true));
        const roomsSnapshot = await getDocs(activeRoomsQuery);
        
        const deletionPromises: Promise<void>[] = [];
        
        roomsSnapshot.forEach((roomDoc) => {
          const roomData = roomDoc.data();
          const expiresAt = roomData.expiresAt?.toDate();
          const createdAt = roomData.createdAt?.toDate();
          
          // Verificar se a sala expirou por expiresAt OU por ter mais de 1 hora
          let shouldDelete = false;
          
          if (expiresAt && now > expiresAt) {
            shouldDelete = true;
          } else if (createdAt && !expiresAt) {
            // Fallback para salas antigas sem expiresAt
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            if (createdAt < oneHourAgo) {
              shouldDelete = true;
            }
          }
          
          if (shouldDelete) {
            console.log(`Removendo sala expirada: ${roomData.title} (ID: ${roomDoc.id})`);
            deletionPromises.push(deleteDoc(doc(db, 'rooms', roomDoc.id)));
          }
        });
        
        // Executar todas as deleções
        if (deletionPromises.length > 0) {
          await Promise.all(deletionPromises);
          console.log(`✅ ${deletionPromises.length} salas expiradas foram removidas automaticamente`);
        }
      } catch (error) {
        console.error('❌ Erro ao limpar salas expiradas:', error);
      }
    };

    // Executar limpeza ao carregar
    cleanupExpiredRooms();
    
    // Executar limpeza a cada 2 minutos (mais frequente)
    const interval = setInterval(cleanupExpiredRooms, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
};
