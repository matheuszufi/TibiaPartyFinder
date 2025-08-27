import React from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

interface NotificationComponentProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationComponentProps> = ({ 
  notification, 
  onRemove 
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div
      className={cn(
        'mb-3 p-4 border rounded-lg shadow-lg relative animate-in slide-in-from-right-full duration-300',
        getBackgroundColor()
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{notification.title}</h4>
          <p className="text-sm mt-1 opacity-90">{notification.message}</p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Barra de progresso para mostrar tempo restante */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 h-1 bg-black/20 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-current opacity-50 animate-pulse"
            style={{
              animation: `notification-progress ${notification.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  );
};

interface NotificationsContainerProps {
  notifications: Notification[];
  onRemove: (id: string) => void;
}

export const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onRemove
}) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 w-80 max-w-sm">
      <style>
        {`
          @keyframes notification-progress {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
      
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};
