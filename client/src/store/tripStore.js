import { create } from 'zustand';
import api from '../lib/api';

const useTripStore = create((set) => ({
  trips: [],
  loading: false,
  error: null,

  createTrip: async (tripData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/trips', tripData);
      set((state) => ({ trips: [...state.trips, response.data], loading: false }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create trip', loading: false });
      return false;
    }
  },

  fetchTrips: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/trips');
      set({ trips: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch trips', loading: false });
    }
  },

  updateTripStatus: async (tripId, status) => {
    try {
      await api.patch(`/trips/${tripId}/status`, { status });
      set((state) => ({
        trips: state.trips.map(t => t._id === tripId ? { ...t, status } : t)
      }));
    } catch (error) {
      console.error('Update status error', error);
    }
  },

  fetchDriverTrips: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/trips/driver');
      set({ trips: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch driver trips', loading: false });
    }
  }
}));

export default useTripStore;
