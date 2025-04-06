import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { TicketStatus } from '@/types';
import { useTranslation } from 'react-i18next';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  size?: 'small' | 'medium' | 'large';
}

export const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({
  status,
  size = 'medium',
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { t } = useTranslation();
  
  // Determine badge color based on status
  const getBadgeColor = () => {
    switch (status) {
      case 'active':
        return colors.warning;
      case 'viewed':
        return colors.info;
      case 'closed':
        return colors.inactive;
      default:
        return colors.inactive;
    }
  };
  
  // Determine badge size based on size prop
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: SPACING.xs,
          paddingVertical: 2,
          fontSize: FONT_SIZE.xs,
        };
      case 'medium':
        return {
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          fontSize: FONT_SIZE.sm,
        };
      case 'large':
        return {
          paddingHorizontal: SPACING.md,
          paddingVertical: SPACING.sm,
          fontSize: FONT_SIZE.md,
        };
      default:
        return {
          paddingHorizontal: SPACING.sm,
          paddingVertical: SPACING.xs,
          fontSize: FONT_SIZE.sm,
        };
    }
  };
  
  const badgeSize = getBadgeSize();
  const badgeColor = getBadgeColor();
  
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: badgeColor + '20',
          paddingHorizontal: badgeSize.paddingHorizontal,
          paddingVertical: badgeSize.paddingVertical,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: badgeColor }]} />
      <Text
        style={[
          styles.text,
          {
            color: badgeColor,
            fontSize: badgeSize.fontSize,
          },
        ]}
      >
        {t(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SPACING.xs,
  },
  text: {
    fontWeight: '500',
  },
});

export default TicketStatusBadge;