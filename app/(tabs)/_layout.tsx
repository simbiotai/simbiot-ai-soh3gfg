import React from "react";
import { Tabs } from "expo-router";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import Colors from "@/constants/colors";
import { Key, MessageSquare, User, ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import TabBadge from "@/components/TabBadge";
import { View, Platform } from "react-native";
import { useTicketStore } from "@/store/ticket-store";

export default function TabLayout() {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const colors = Colors[theme];
  const { t } = useTranslation();
  const { hasUnreadMessages } = useTicketStore();
  
  // Check if user is admin - this is the key check
  const isAdmin = user?.role === 'admin';
  
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.inactive,
          tabBarStyle: {
            backgroundColor: theme === 'dark' ? colors.card : colors.background,
            borderTopColor: colors.border,
          },
          headerStyle: {
            backgroundColor: theme === 'dark' ? colors.card : colors.background,
          },
          headerTintColor: colors.text,
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShadowVisible: false,
          headerTitle: t('appName'),
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('apiKeys'),
            tabBarIcon: ({ color, size }) => <Key size={size} color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="support"
          options={{
            title: t('support'),
            tabBarIcon: ({ color, size }) => (
              <View>
                <MessageSquare size={size} color={color} />
                <TabBadge visible={hasUnreadMessages} />
              </View>
            ),
          }}
        />
        
        <Tabs.Screen
          name="account"
          options={{
            title: t('account'),
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
        
        {/* Only render the admin tab if the user is an admin */}
        {isAdmin && (
          <Tabs.Screen
            name="admin"
            options={{
              title: t('admin'),
              tabBarIcon: ({ color, size }) => <ShieldCheck size={size} color={color} />,
            }}
          />
        )}
      </Tabs>
    </View>
  );
}