import { Stack } from 'expo-router';
import { useAuthStore } from '../store/auth-store';

export default function Layout() {
  const { user } = useAuthStore();

  return (
    <Stack screenOptions={{}}>
      <Stack.Screen
        name="auth/login"
        options={{ headerShown: false, title: 'Login' }}
      />
      <Stack.Screen
        name="auth/signup"
        options={{ headerShown: false, title: 'Sign Up' }}
      />
      <Stack.Screen
        name="auth/forgot-password"
        options={{ headerShown: false, title: 'Reset Password' }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {user?.isAdmin && (
        <Stack.Screen name="(tabs)/admin" options={{ title: 'Admin Panel' }} />
      )}
    </Stack>
  );
}