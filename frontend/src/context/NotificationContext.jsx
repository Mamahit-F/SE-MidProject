import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { notificationApi } from '../api/notificationApi';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);

  const fetchNotifications = useCallback(async (silent = false) => {
    if (!currentUser) return;
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    if (!silent) setLoading(true);

    try {
      const rawData = await notificationApi.getAll();
      const rawList = Array.isArray(rawData) ? rawData : rawData?.data || [];
      const list = rawList.map((n) => ({
        ...n,
        isRead: Boolean(n.isRead !== undefined ? n.isRead : (n.read !== undefined ? n.read : n.is_read)),
      }));
      setNotifications(list);
      const unread = list.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      // Non-intrusive logging for background polling failures
      console.warn('Failed to fetch notifications:', err?.message || err);
    } finally {
      isFetchingRef.current = false;
      if (!silent) setLoading(false);
    }
  }, [currentUser]);

  // Periodic polling every 20 seconds when user is logged in
  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    // Initial fetch
    fetchNotifications();

    // 20-second interval polling
    const intervalId = setInterval(() => {
      fetchNotifications(true);
    }, 20000);

    return () => clearInterval(intervalId);
  }, [currentUser, fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
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
