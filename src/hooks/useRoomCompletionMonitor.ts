import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useToast } from '../contexts/ToastContext';

// Set para controlar quais salas já foram notificadas
const notifiedRooms = new Set<string>();

export const useRoomCompletionMonitor = () => {
  const [user] = useAuthState(auth);
  const { showRoomCompleteNotification } = useToast();

  useEffect(() => {
    if (!user) return;

    // Query para monitorar salas onde o usuário é membro
    const userRoomsQuery = query(
      collection(db, 'rooms'),
      where('members', 'array-contains', user.uid),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(userRoomsQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          const roomData = change.doc.data();
          const roomId = change.doc.id;
          
          // Verificar se a sala ficou completa
          if (roomData.currentMembers >= roomData.maxMembers && !notifiedRooms.has(roomId)) {
            console.log(`🎉 Sala completa detectada para membro: ${roomData.title}`);
            
            // Marcar como notificada
            notifiedRooms.add(roomId);
            
            // Mostrar notificação toast após um pequeno delay
            setTimeout(() => {
              showRoomCompleteNotification(roomData.title);
              
              // Também mostrar notificação do browser
              if ('Notification' in window) {
                if (Notification.permission === 'granted') {
                  new Notification('Party Completa! 🎉', {
                    body: `A party "${roomData.title}" está completa e pronta para iniciar!`,
                    icon: '/favicon.ico',
                    tag: 'room-complete'
                  });
                } else if (Notification.permission === 'default') {
                  Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                      new Notification('Party Completa! 🎉', {
                        body: `A party "${roomData.title}" está completa e pronta para iniciar!`,
                        icon: '/favicon.ico',
                        tag: 'room-complete'
                      });
                    }
                  });
                }
              }
              
              // Som de notificação
              try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.8);
              } catch (error) {
                console.log('Som não disponível:', error);
              }
            }, 1000);
          }
          
          // Se a sala não está mais completa, remover da lista
          if (roomData.currentMembers < roomData.maxMembers && notifiedRooms.has(roomId)) {
            notifiedRooms.delete(roomId);
          }
        }
      });
    }, (error) => {
      console.error('Erro ao monitorar salas completas:', error);
    });

    return () => {
      unsubscribe();
      notifiedRooms.clear();
    };
  }, [user, showRoomCompleteNotification]);
};
