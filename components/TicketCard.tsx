import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { Ticket } from '@/types';
import TicketStatusBadge from './TicketStatusBadge';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react-native';

interface TicketCardProps {
  ticket: Ticket;
  onPress: (ticket: Ticket) => void;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { t } = useTranslation();
  
  // Animation for press effect
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Get the last message preview
  const getLastMessagePreview = () => {
    if (ticket.messages.length === 0) {
      return '';
    }
    
    const lastMessage = ticket.messages[ticket.messages.length - 1];
    if (lastMessage.content.length > 50) {
      return lastMessage.content.substring(0, 50) + '...';
    }
    
    return lastMessage.content;
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={() => onPress(ticket)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <Text style={[styles.subject, { color: colors.text }]}>
            {ticket.subject}
          </Text>
          <TicketStatusBadge status={ticket.status} size="small" />
        </View>
        
        <Text style={[styles.preview, { color: colors.secondaryText }]}>
          {getLastMessagePreview()}
        </Text>
        
        <View style={styles.footer}>
          <Text style={[styles.date, { color: colors.secondaryText }]}>
            {formatDate(ticket.lastMessageAt)}
          </Text>
          
          <View style={styles.footerRight}>
            {ticket.unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                <Text style={styles.badgeText}>
                  {ticket.unreadCount}
                </Text>
              </View>
            )}
            <ChevronRight size={16} color={colors.secondaryText} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  subject: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    flex: 1,
    marginRight: SPACING.sm,
  },
  preview: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: FONT_SIZE.xs,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: 'bold',
  },
});

export default TicketCard;