import React, { useState, useEffect } from 'react';
import { X, Users, PartyPopper } from 'lucide-react';

interface ToastNotification {
  id: string;
  type: 'room-complete';
  title: string;
  message: string;
  roomTitle: string;
  duration?: number;
}

interface ToastProps {
  notification: ToastNotification;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Animar entrada
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Animar progresso
    const duration = notification.duration || 8000;
    const interval = 100;
    const steps = duration / interval;
    const progressStep = 100 / steps;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - progressStep;
        if (newProgress <= 0) {
          clearInterval(progressInterval);
          handleRemove();
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => {
      clearTimeout(showTimer);
      clearInterval(progressInterval);
    };
  }, [notification.duration]);

  const handleRemove = () => {
    setIsVisible(false);
    setTimeout(() => onRemove(notification.id), 300);
  };

  return (
    <div
      className={`
        fixed top-20 right-6 z-50 w-96 max-w-sm
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-2xl border border-green-400 overflow-hidden">
        {/* Header com ícone e título */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <PartyPopper className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white">
                    {notification.title}
                  </h3>
                  <div className="animate-bounce">🎉</div>
                </div>
                <p className="text-green-100 text-sm mt-1">
                  {notification.message}
                </p>
              </div>
            </div>
            <button
              onClick={handleRemove}
              className="text-white hover:text-green-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informações da sala */}
        <div className="px-4 pb-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center space-x-2 text-white">
              <Users className="w-4 h-4" />
              <span className="font-medium text-sm">Party:</span>
              <span className="text-sm font-bold">{notification.roomTitle}</span>
            </div>
            <p className="text-green-100 text-xs mt-1">
              Todos os membros foram notificados! A party está pronta para começar.
            </p>
          </div>
        </div>

        {/* Barra de progresso */}
        <div className="h-1 bg-green-700">
          <div 
            className="h-full bg-white transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  notifications: ToastNotification[];
  onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  notifications,
  onRemove
}) => {
  return (
    <>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{ top: `${80 + index * 120}px` }}
          className="relative"
        >
          <Toast notification={notification} onRemove={onRemove} />
        </div>
      ))}
    </>
  );
};

// Hook para gerenciar notificações toast
export const useToastNotifications = () => {
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  const addNotification = (notification: Omit<ToastNotification, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: ToastNotification = {
      id,
      duration: 8000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const showRoomCompleteNotification = (roomTitle: string) => {
    return addNotification({
      type: 'room-complete',
      title: 'Party Completa!',
      message: 'Sua party está completa e pronta para a aventura!',
      roomTitle: roomTitle,
      duration: 10000 // 10 segundos para essa notificação especial
    });
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    showRoomCompleteNotification
  };
};
