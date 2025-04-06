import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthState, User } from '@/types';

// In a real app, this would be an API call to your backend
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, make anyone with @admin.com an admin
  const isAdmin = email.endsWith('@admin.com');
  
  if (email && password.length >= 6) {
    return {
      id: '1',
      email,
      role: isAdmin ? 'admin' : 'user',
      name: email.split('@')[0],
      createdAt: new Date().toISOString(),
      isBanned: false,
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockSignup = async (email: string, password: string, name?: string): Promise<User> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // For demo purposes, make anyone with @admin.com an admin
  const isAdmin = email.endsWith('@admin.com');
  
  if (email && password.length >= 6) {
    return {
      id: '1',
      email,
      role: isAdmin ? 'admin' : 'user',
      name: name || email.split('@')[0],
      createdAt: new Date().toISOString(),
      isBanned: false,
    };
  }
  
  throw new Error('Invalid credentials');
};

// Mock users for the admin panel
const mockUsers: User[] = [
  {
    id: '2',
    email: 'user1@example.com',
    role: 'user',
    name: 'User One',
    createdAt: new Date().toISOString(),
    isBanned: false,
  },
  {
    id: '3',
    email: 'user2@example.com',
    role: 'user',
    name: 'User Two',
    createdAt: new Date().toISOString(),
    isBanned: true,
  },
  {
    id: '4',
    email: 'admin@admin.com',
    role: 'admin',
    name: 'Admin User',
    createdAt: new Date().toISOString(),
    isBanned: false,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockLogin(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Login failed', 
            isLoading: false 
          });
        }
      },
      
      signup: async (email: string, password: string, name?: string) => {
        set({ isLoading: true, error: null });
        try {
          const user = await mockSignup(email, password, name);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Signup failed', 
            isLoading: false 
          });
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      banUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just update the local state
          
          // If the user is banning themselves, throw an error
          if (get().user?.id === userId) {
            throw new Error('You cannot ban yourself');
          }
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update the user in the mock users list
          const updatedMockUsers = mockUsers.map(user => 
            user.id === userId ? { ...user, isBanned: true } : user
          );
          
          // If the user being banned is the current user, update the current user
          if (get().user?.id === userId) {
            set({ user: { ...get().user!, isBanned: true } });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to ban user', 
            isLoading: false 
          });
        }
      },
      
      unbanUser: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, this would be an API call
          // For now, we'll just update the local state
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Update the user in the mock users list
          const updatedMockUsers = mockUsers.map(user => 
            user.id === userId ? { ...user, isBanned: false } : user
          );
          
          // If the user being unbanned is the current user, update the current user
          if (get().user?.id === userId) {
            set({ user: { ...get().user!, isBanned: false } });
          }
          
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to unban user', 
            isLoading: false 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);