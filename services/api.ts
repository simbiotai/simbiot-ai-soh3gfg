import axios from 'axios';
import { useLanguageStore } from '../store/language-store';

const api = axios.create({
  baseURL: 'http://77.91.123.72:5000',
});

export const useApi = () => {
  const { language } = useLanguageStore();
  return {
    post: async (endpoint: string, data: any) => {
      return api.post(endpoint, data, { headers: { 'Accept-Language': language } });
    },
  };
};

export default api;