import { Tabs } from 'expo-router';
import { useAuthStore } from '../../store/auth-store';

export default function TabLayout() {
  const { user } = useAuthStore();

  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="account" options={{ title: 'Account' }} />
      <Tabs.Screen name="support" options={{ title: 'Support' }} />
      {user?.isAdmin && (
        <Tabs.Screen name="admin" options={{ title: 'Admin' }} />
      )}
    </Tabs>
  );
}