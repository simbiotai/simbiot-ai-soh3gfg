import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageState, Language } from '@/types';
import i18n from '@/i18n';

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en' as Language,
      
      setLanguage: (language: Language) => {
        i18n.changeLanguage(language);
        set({ language });
      },
    }),
    {
      name: 'language-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);