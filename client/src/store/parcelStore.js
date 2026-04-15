import { create } from 'zustand';
import api from '../lib/api';
const mergeParcel = (currentParcels, updatedParcel) =>
  currentParcels.map((parcel) => (parcel._id === updatedParcel._id ? updatedParcel : parcel));

const useParcelStore = create((set, get) => ({
  parcels: [],
  matches: [],
  loading: false,
  error: null,

  createParcel: async (parcelData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/parcels', parcelData);
      set((state) => ({ parcels: [...state.parcels, response.data], loading: false }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to create parcel', loading: false });
      return null;
    }
  },

  findMatches: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/parcels/match', { params });
      set({ matches: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to find matches', loading: false });
      return [];
    }
  },

  calculatePrice: async (data) => {
    try {
      const response = await api.post('/parcels/calculate-price', data);
      return response.data;
    } catch (error) {
      console.error('Pricing error', error);
      return null;
    }
  },

  fetchUserParcels: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/parcels');
      set({ parcels: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch parcels', loading: false });
    }
  },

  fetchAllParcels: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/parcels');
      set({ parcels: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch all parcels', loading: false });
    }
  },

  fetchParcelById: async (parcelId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/parcels/${parcelId}`);
      set({ loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch parcel', loading: false });
      return null;
    }
  },

  updateParcelStatus: async (parcelId, status) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/parcels/${parcelId}/status`, { status });
      set((state) => ({
        parcels: mergeParcel(state.parcels, response.data),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update status', loading: false });
      return false;
    }
  },

  settlePayment: async (parcelId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/parcels/${parcelId}/settle`);
      set((state) => ({
        parcels: mergeParcel(state.parcels, response.data),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to settle payment', loading: false });
      return false;
    }
  },

  submitReview: async (parcelId, rating, feedback) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/parcels/${parcelId}/review`, { rating, feedback });
      set((state) => ({
        parcels: mergeParcel(state.parcels, response.data),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to submit review', loading: false });
      return false;
    }
  },

  updateDriverProgress: async (parcelId, collectorDistanceKm) => {
    set({ loading: true, error: null });
    try {
      const response = await api.patch(`/parcels/${parcelId}/driver-progress`, { collectorDistanceKm });
      set((state) => ({
        parcels: mergeParcel(state.parcels, response.data),
        loading: false
      }));
      return true;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update driver progress', loading: false });
      return false;
    }
  }
}));

export default useParcelStore;
