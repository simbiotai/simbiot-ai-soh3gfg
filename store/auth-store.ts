import create from 'zustand';
import { useApi } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  login: async (email, password) => {
    const api = useApi();
    try {
      const response = await api.post('/login', { email, password });
      const userData = response.data;
      set({ user: { email: userData.email, isAdmin: userData.isAdmin || false } });
    } catch (error) {
      throw new Error('Login failed');
    }
  },
  logout: () => set({ user: null }),
}));