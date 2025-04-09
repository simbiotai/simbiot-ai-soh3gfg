iimport create from 'zustand';
import { useApi } from '../services/api';

export const useApiKeyStore = create((set) => ({
  apiKeys: [],
  fetchApiKeys: async () => {
    const api = useApi();
    try {
      const response = await api.post('/get-api-keys', {});
      set({ apiKeys: response.data });
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    }
  },
  banApiKey: async (id) => {
    const api = useApi();
    await api.post('/ban-api-key', { id });
    set((state) => ({
      apiKeys: state.apiKeys.map((key) =>
        key.id === id ? { ...key, banned: true } : key
      ),
    }));
  },
}));