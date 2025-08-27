import { useEffect, useRef } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNotifications } from './useNotifications';

interface PartyRoom {
  id: string;
  title: string;
  maxMembers: number;
  currentMembers: number;
  members: string[];
  isActive: boolean;
}

export const useRoomCompletionNotifier = () => {
  const [user] = useAuthState(auth);
  const { notifyRoomComplete, requestNotificationPermission } = useNotifications();
  const completedRoomsRef = useRef(new Set<string>());

  useEffect(() => {
    if (!user) return;

    // Solicitar permissão para notificações do browser apenas uma vez
    requestNotificationPermission();

    // Monitorar salas onde o usuário é membro
    const userRoomsQuery = query(
      collection(db, 'rooms'),
      where('members', 'array-contains', user.uid),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(userRoomsQuery, (snapshot) => {
      snapshot.forEach((doc) => {
        const room = doc.data() as PartyRoom;
        const roomId = doc.id;

        // Verificar se a sala acabou de ficar completa
        if (room.currentMembers >= room.maxMembers && !completedRoomsRef.current.has(roomId)) {
          console.log(`🎉 Sala completa detectada: ${room.title} (${room.currentMembers}/${room.maxMembers})`);
          
          // Marcar como já notificada
          completedRoomsRef.current.add(roomId);
          
          // Enviar notificação com delay para evitar conflitos
          setTimeout(() => {
            notifyRoomComplete(room.title);
          }, 500);
        }

        // Se a sala não está mais completa, remover da lista de completas
        if (room.currentMembers < room.maxMembers && completedRoomsRef.current.has(roomId)) {
          completedRoomsRef.current.delete(roomId);
        }
      });
    }, (error) => {
      console.error('Erro ao monitorar salas completas:', error);
    });

    return () => {
      unsubscribe();
      completedRoomsRef.current.clear();
    };
  }, [user, notifyRoomComplete, requestNotificationPermission]);
};
