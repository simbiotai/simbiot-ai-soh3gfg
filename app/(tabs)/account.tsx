import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import Button from '@/components/Button';
import LanguageSelector from '@/components/LanguageSelector';
import { 
  Moon, 
  Sun, 
  Bell, 
  LogOut, 
  Trash2,
  Globe
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function AccountScreen() {
  const { theme, toggleTheme } = useThemeStore();
  const colors = Colors[theme];
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const { t } = useTranslation();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const handleLogout = () => {
    Alert.alert(
      t('logout'),
      t('logoutConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('logout'),
          onPress: () => {
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      t('deleteAccount'),
      t('deleteAccountConfirmation'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => {
            // In a real app, this would call an API to delete the account
            logout();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };
  
  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };
  
  const handleThemeToggle = () => {
    // Toggle the theme
    toggleTheme();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.profileSection}>
            <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Text>
            </View>
            
            <Text style={[styles.userName, { color: colors.text }]}>
              {user?.name || 'User'}
            </Text>
            
            <Text style={[styles.userEmail, { color: colors.secondaryText }]}>
              {user?.email || 'user@example.com'}
            </Text>
            
            <View style={styles.userInfo}>
              <View style={styles.userInfoItem}>
                <Text style={[styles.userInfoLabel, { color: colors.secondaryText }]}>
                  ID:
                </Text>
                <Text style={[styles.userInfoValue, { color: colors.text }]}>
                  {user?.id || '1'}
                </Text>
              </View>
              
              <View style={styles.userInfoItem}>
                <Text style={[styles.userInfoLabel, { color: colors.secondaryText }]}>
                  {t('role')}:
                </Text>
                <View style={styles.userRole}>
                  <Text style={[styles.roleText, { color: colors.primary }]}>
                    {user?.role === 'admin' ? t('admin') : t('user')}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.settingsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('settings')}
            </Text>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  {theme === 'dark' ? (
                    <Moon size={20} color={colors.primary} />
                  ) : (
                    <Sun size={20} color={colors.primary} />
                  )}
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t('darkMode')}
                </Text>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={handleThemeToggle}
                trackColor={{ false: colors.inactive, true: colors.primary + '80' }}
                thumbColor={theme === 'dark' ? colors.primary : colors.background}
              />
            </View>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Globe size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t('language')}
                </Text>
              </View>
              <LanguageSelector style={styles.languageSelector} />
            </View>
            
            <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
              <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  {t('notifications')}
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={toggleNotifications}
                trackColor={{ false: colors.inactive, true: colors.primary + '80' }}
                thumbColor={notificationsEnabled ? colors.primary : colors.background}
              />
            </View>
          </View>
          
          <View style={styles.actionsSection}>
            <Button
              title={t('logout')}
              onPress={handleLogout}
              variant="outline"
              icon={<LogOut size={20} color={colors.primary} />}
              style={{ marginBottom: SPACING.md }}
            />
            
            <Button
              title={t('deleteAccount')}
              onPress={handleDeleteAccount}
              variant="outline"
              icon={<Trash2 size={20} color={colors.error} />}
              style={{ borderColor: colors.error }}
              textStyle={{ color: colors.error }}
            />
          </View>
          
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.secondaryText }]}>
              {t('appName')} v1.0.0
            </Text>
          </View>
        </ScrollView>
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
  profileSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
  },
  userInfo: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.sm,
  },
  userInfoItem: {
    alignItems: 'center',
  },
  userInfoLabel: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  userInfoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  userRole: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  roleText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '500',
  },
  settingsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingText: {
    fontSize: FONT_SIZE.md,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketCount: {
    fontSize: FONT_SIZE.md,
    marginRight: SPACING.sm,
  },
  languageSelector: {
    maxWidth: 150,
  },
  actionsSection: {
    marginBottom: SPACING.xl,
  },
  footer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  footerText: {
    fontSize: FONT_SIZE.sm,
  },
});