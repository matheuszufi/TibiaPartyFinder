import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useToastNotifications, ToastContainer } from '../components/ToastNotification';

interface ToastContextType {
  showRoomCompleteNotification: (roomTitle: string) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const { notifications, removeNotification, showRoomCompleteNotification } = useToastNotifications();

  return (
    <ToastContext.Provider value={{ showRoomCompleteNotification }}>
      {children}
      <ToastContainer 
        notifications={notifications} 
        onRemove={removeNotification} 
      />
    </ToastContext.Provider>
  );
};
