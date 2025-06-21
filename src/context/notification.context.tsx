import React, { useContext, useState, useCallback } from 'react';
import { Notification } from '../components/Notification';
import { AlertColor } from '@mui/material';

interface NotificationMessage {
  id: string;
  message: string;
  severity: AlertColor;
  autoHideDuration?: number;
}

interface ContextProps {
  showNotification: (message: string, severity: AlertColor, autoHideDuration?: number) => void;
  showSuccess: (message: string, autoHideDuration?: number) => void;
  showError: (message: string, autoHideDuration?: number) => void;
  showWarning: (message: string, autoHideDuration?: number) => void;
  showInfo: (message: string, autoHideDuration?: number) => void;
}

const NotificationContext = React.createContext<ContextProps | null>(null);

const DEFAULT_AUTO_HIDE_DURATION = 6000; // 6 seconds

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const showNotification = useCallback(
    (message: string, severity: AlertColor, autoHideDuration = DEFAULT_AUTO_HIDE_DURATION) => {
      const id = Math.random().toString(36).substring(7);
      setNotifications(prev => [...prev, { id, message, severity, autoHideDuration }]);
    },
    []
  );

  const showSuccess = useCallback(
    (message: string, autoHideDuration?: number) => {
      showNotification(message, 'success', autoHideDuration);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message: string, autoHideDuration?: number) => {
      showNotification(message, 'error', autoHideDuration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message: string, autoHideDuration?: number) => {
      showNotification(message, 'warning', autoHideDuration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message: string, autoHideDuration?: number) => {
      showNotification(message, 'info', autoHideDuration);
    },
    [showNotification]
  );

  const value = {
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <NotificationContext.Provider value={value}>
      {notifications.map(notification => (
        <Notification
          key={notification.id}
          handleClose={() => removeNotification(notification.id)}
          open={true}
          msg={notification.message}
          severity={notification.severity}
          autoHideDuration={notification.autoHideDuration}
        />
      ))}
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
