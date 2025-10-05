import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Browser notification (if permitted)
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/parking-icon.png'
      });
    }
  };

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Check for upcoming expiries every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const bookings = JSON.parse(localStorage.getItem('parkingBookings') || '[]');
      
      bookings.forEach(booking => {
        const endTime = new Date(booking.endTime);
        const now = new Date();
        const timeDiff = endTime - now;
        const minutesRemaining = Math.floor(timeDiff / (1000 * 60));

        // Notify 30 minutes before expiry
        if (minutesRemaining === 30 && timeDiff > 0) {
          addNotification({
            type: 'warning',
            title: 'Parking Expiring Soon',
            message: `Your parking at ${booking.slot} expires in 30 minutes. Consider extending if needed.`,
            bookingId: booking.id
          });
        }

        // Notify when expired
        if (minutesRemaining <= 0 && timeDiff > -5 * 60 * 1000) { // Within 5 minutes of expiry
          addNotification({
            type: 'info',
            title: 'Parking Expired',
            message: `Your parking at ${booking.slot} has expired. Thank you for using ParkMate!`,
            bookingId: booking.id
          });
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearAll,
      unreadCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};