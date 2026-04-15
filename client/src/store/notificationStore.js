import { create } from 'zustand';
import api from '../lib/api';
import useAuthStore from './authStore';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,
  error: null,

  fetchNotifications: async () => {
    if (!useAuthStore.getState().user) {
      set({ notifications: [] });
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await api.get('/notifications');
      set({ notifications: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch notifications', loading: false });
    }
  },

  markNotificationRead: async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      set((state) => ({
        notifications: state.notifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update notification' });
    }
  },

  unreadCount: () => get().notifications.filter((notification) => !notification.read).length
}));

export default useNotificationStore;
