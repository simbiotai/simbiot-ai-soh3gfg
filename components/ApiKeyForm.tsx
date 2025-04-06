import React, { useState } from 'react';
import { apiService, ApiKeyData } from '../services/api';

export const ApiKeyForm: React.FC = () => {
  const [formData, setFormData] = useState<ApiKeyData>({
    exchange: '',
    apiKey: '',
    apiSecret: ''
  });
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      await apiService.sendApiKeys(formData);
      setStatus({
        type: 'success',
        message: 'API ключи успешно отправлены на сервер'
      });
      setFormData({ exchange: '', apiKey: '', apiSecret: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Ошибка при отправке API ключей'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Ввод API ключей</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Биржа
          </label>
          <select
            name="exchange"
            value={formData.exchange}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Выберите биржу</option>
            <option value="binance">Binance</option>
            <option value="bybit">Bybit</option>
            <option value="gateio">Gate.io</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            API Ключ
          </label>
          <input
            type="text"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Секретный ключ
          </label>
          <input
            type="password"
            name="apiSecret"
            value={formData.apiSecret}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>

      {status.type && (
        <div className={`mt-4 p-4 rounded-md ${
          status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {status.message}
        </div>
      )}
    </div>
  );
}; 