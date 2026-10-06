import axiosClient, { shouldUseMock } from './axiosClient';
import { mockStorage } from '../mock/mockStorage';

export const notificationApi = {
  getAll: async () => {
    if (shouldUseMock() && mockStorage.getNotifications) {
      return mockStorage.getNotifications();
    }
    return axiosClient.get('/api/notifications');
  },

  getUnreadCount: async () => {
    if (shouldUseMock() && mockStorage.getUnreadNotificationCount) {
      return mockStorage.getUnreadNotificationCount();
    }
    return axiosClient.get('/api/notifications/unread-count');
  },

  markAsRead: async (id) => {
    if (shouldUseMock() && mockStorage.markNotificationAsRead) {
      return mockStorage.markNotificationAsRead(id);
    }
    return axiosClient.patch(`/api/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    if (shouldUseMock() && mockStorage.markAllNotificationsAsRead) {
      return mockStorage.markAllNotificationsAsRead();
    }
    return axiosClient.patch('/api/notifications/read-all');
  },
};
