import { create } from 'zustand';
import api from '../lib/api';

const useUserStore = create((set) => ({
  users: [],
  publicDrivers: [],
  adminOverview: null,
  loadingUsers: false,
  loadingPublicDrivers: false,
  loadingOverview: false,
  error: null,

  fetchUsers: async (params = {}) => {
    set({ loadingUsers: true, error: null });

    try {
      const response = await api.get('/users', { params });
      set({ users: response.data, loadingUsers: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch users', loadingUsers: false });
      return [];
    }
  },

  fetchPublicDrivers: async (params = {}) => {
    set({ loadingPublicDrivers: true, error: null });

    try {
      const response = await api.get('/users/public/drivers', { params });
      set({ publicDrivers: response.data, loadingPublicDrivers: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch drivers', loadingPublicDrivers: false });
      return [];
    }
  },

  fetchAdminOverview: async () => {
    set({ loadingOverview: true, error: null });

    try {
      const response = await api.get('/users/admin/overview');
      set({ adminOverview: response.data, loadingOverview: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch admin overview', loadingOverview: false });
      return null;
    }
  }
}));

export default useUserStore;
