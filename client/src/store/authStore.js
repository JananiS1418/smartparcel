import { create } from 'zustand';
import api from '../lib/api';

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  initializing: true,
  error: null,

  initializeAuth: async () => {
    set({ initializing: true, error: null });

    try {
      const response = await api.get('/auth/me');
      set({ user: response.data, initializing: false, error: null });
      return response.data;
    } catch (error) {
      set({
        user: null,
        initializing: false,
        error: error.response?.status === 401 ? null : error.response?.data?.message || 'Failed to restore session'
      });
      return null;
    }
  },

  login: async (email, password, role) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password, role });
      const user = response.data;
      set({ user, loading: false, initializing: false, error: null });
      return true;
    } catch (error) {
      let errorMessage = 'Login failed';
      if (!error.response) {
        errorMessage = 'Server is unreachable. Please ensure the backend is running on port 5000.';
      } else {
        errorMessage = error.response.data?.message || 'Invalid email or password';
      }
      set({ user: null, error: errorMessage, loading: false, initializing: false });
      return false;
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/auth/register', userData);
      const user = response.data;
      set({ user, loading: false, initializing: false, error: null });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false, initializing: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Clear local auth state even if the server session is already gone.
    } finally {
      set({ user: null, error: null, initializing: false });
    }
  },

  updateUser: async (updatedData) => {
    set({ loading: true, error: null });

    try {
      const response = await api.put('/auth/profile', updatedData);
      set({ user: response.data, loading: false });
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update profile', loading: false });
      return false;
    }
  }
}));

export default useAuthStore;
