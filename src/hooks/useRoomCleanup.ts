import { useEffect } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export const useRoomCleanup = () => {
  useEffect(() => {
    const cleanupExpiredRooms = async () => {
      try {
        const now = new Date();
        const roomsRef = collection(db, 'rooms');
        
        // Buscar todas as salas
        const roomsSnapshot = await getDocs(roomsRef);
        
        const deletionPromises: Promise<void>[] = [];
        
        roomsSnapshot.forEach((roomDoc) => {
          const roomData = roomDoc.data();
          const expiresAt = roomData.expiresAt?.toDate();
          
          // Se a sala expirou, marcar para deletar
          if (expiresAt && now > expiresAt) {
            deletionPromises.push(deleteDoc(doc(db, 'rooms', roomDoc.id)));
          }
        });
        
        // Executar todas as deleções
        if (deletionPromises.length > 0) {
          await Promise.all(deletionPromises);
          console.log(`${deletionPromises.length} salas expiradas foram removidas`);
        }
      } catch (error) {
        console.error('Erro ao limpar salas expiradas:', error);
      }
    };

    // Executar limpeza ao carregar
    cleanupExpiredRooms();
    
    // Executar limpeza a cada 5 minutos
    const interval = setInterval(cleanupExpiredRooms, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
};
