import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeState } from '@/types';

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as 'light' | 'dark',
      
      toggleTheme: () => {
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }));
      },
      
      setTheme: (theme: 'light' | 'dark') => {
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);