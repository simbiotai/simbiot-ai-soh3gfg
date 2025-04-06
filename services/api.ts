import axios from 'axios';

const API_URL = 'http://77.91.123.72/api';

export interface ApiKeyData {
  exchange: string;
  apiKey: string;
  apiSecret: string;
}

export const apiService = {
  async sendApiKeys(data: ApiKeyData) {
    try {
      const response = await axios.post(`${API_URL}/keys`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 48de6d2a-0368-4aa9-a02b-36ec5291af58'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при отправке API ключей:', error);
      throw error;
    }
  },

  async testConnection() {
    try {
      const response = await axios.get(`${API_URL}/test`, {
        headers: {
          'Authorization': 'Bearer 48de6d2a-0368-4aa9-a02b-36ec5291af58'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при проверке соединения:', error);
      throw error;
    }
  }
}; 