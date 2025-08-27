import { useState, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Função para adicionar uma nova notificação
  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: 5000, // 5 segundos por padrão
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remover após o duration especificado
    if (newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Função para remover uma notificação
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Função para limpar todas as notificações
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Função para notificação de sala completa
  const notifyRoomComplete = useCallback((roomTitle: string) => {
    // Notificação visual
    addNotification({
      type: 'success',
      title: 'Party Completa! 🎉',
      message: `A party "${roomTitle}" está completa e pronta para iniciar!`,
      duration: 10000 // 10 segundos para essa notificação especial
    });

    // Notificação do browser (se permitido)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Party Completa! 🎉', {
        body: `A party "${roomTitle}" está completa e pronta para iniciar!`,
        icon: '/favicon.ico',
        tag: 'room-complete'
      });
    }

    // Som de notificação usando Web Audio API
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Criar uma sequência de notas para um som de sucesso
      const playTone = (frequency: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };
      
      const now = audioContext.currentTime;
      // Melodia de sucesso: C-E-G-C (Dó maior)
      playTone(523.25, now, 0.2);       // C5
      playTone(659.25, now + 0.2, 0.2); // E5  
      playTone(783.99, now + 0.4, 0.2); // G5
      playTone(1046.50, now + 0.6, 0.4); // C6
      
    } catch (error) {
      // Ignorar erro de áudio se não suportar Web Audio API
      console.log('Som de notificação não disponível');
    }
  }, [addNotification]);

  // Solicitar permissão para notificações do browser
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.log('Erro ao solicitar permissão de notificação:', error);
        return false;
      }
    }
    return Notification.permission === 'granted';
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    notifyRoomComplete,
    requestNotificationPermission
  };
};
