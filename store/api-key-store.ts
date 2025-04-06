import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiKeyState, ApiKey } from '@/types';
import { useAuthStore } from './auth-store';
import { Platform } from 'react-native';

// API endpoint for sending API keys
const API_ENDPOINT = 'https://api.simbiot.example/api/keys';

export const useApiKeyStore = create<ApiKeyState>()(
  persist(
    (set, get) => ({
      apiKeys: [],
      isLoading: false,
      error: null,
      
      addApiKey: async (exchangeName: string, apiKey: string, apiSecret: string, offlineMode: boolean = false) => {
        set({ isLoading: true, error: null });
        
        try {
          const user = useAuthStore.getState().user;
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Create a new API key object
          const newApiKey: ApiKey = {
            id: Date.now().toString(),
            userId: user.id,
            exchangeName,
            apiKey,
            apiSecret,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // In a real app, we would send to the external server
          // For Expo Go compatibility, we'll just simulate this
          // and add directly to local state
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update the status based on the "response"
          newApiKey.status = 'connected';
          
          // Add to the local state
          set({ 
            apiKeys: [...get().apiKeys, newApiKey],
            isLoading: false 
          });
          
          return newApiKey;
        } catch (error) {
          // If there's an error, still add the key but mark it as failed
          // unless we're in offline mode
          if (offlineMode) {
            const user = useAuthStore.getState().user;
            if (user) {
              const offlineApiKey: ApiKey = {
                id: Date.now().toString(),
                userId: user.id,
                exchangeName,
                apiKey,
                apiSecret,
                status: 'connected', // Mark as connected in offline mode
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set({ 
                apiKeys: [...get().apiKeys, offlineApiKey],
                isLoading: false
              });
              
              return offlineApiKey;
            }
          } else {
            const user = useAuthStore.getState().user;
            if (user) {
              const failedApiKey: ApiKey = {
                id: Date.now().toString(),
                userId: user.id,
                exchangeName,
                apiKey,
                apiSecret,
                status: 'failed',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              
              set({ 
                apiKeys: [...get().apiKeys, failedApiKey],
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to connect API key'
              });
            } else {
              set({ 
                isLoading: false,
                error: 'User not authenticated'
              });
            }
          }
          
          throw error;
        }
      },
      
      deleteApiKey: async (id: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would call an API to delete the key
          // For now, we'll just remove it from the local state
          set({ 
            apiKeys: get().apiKeys.filter(key => key.id !== id),
            isLoading: false 
          });
          
          return true;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete API key'
          });
          throw error;
        }
      },
      
      fetchApiKeys: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // In a real app, you would fetch the keys from an API
          // For now, we'll just use the local state
          set({ isLoading: false });
          return get().apiKeys;
        } catch (error) {
          set({ 
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch API keys'
          });
          throw error;
        }
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'api-key-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);