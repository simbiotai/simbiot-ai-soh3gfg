import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AdminScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { user } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  
  React.useEffect(() => {
    // Check if user is admin, if not redirect
    if (user?.role !== 'admin') {
      Alert.alert(
        t('accessDenied'),
        t('adminAccessDenied'),
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    }
  }, [user, router, t]);
  
  // If not admin, don't render anything
  if (user?.role !== 'admin') {
    return null;
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('adminPanel')}
          </Text>
        </View>
        
        <View style={styles.centerContent}>
          <Text style={[styles.message, { color: colors.text }]}>
            Admin panel is under construction
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
  }
});