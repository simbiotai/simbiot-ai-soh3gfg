import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';

interface TabBadgeProps {
  visible: boolean;
}

export const TabBadge: React.FC<TabBadgeProps> = ({ visible }) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  
  if (!visible) {
    return null;
  }
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: colors.success,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default TabBadge;