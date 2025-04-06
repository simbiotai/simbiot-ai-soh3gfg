import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import { TicketMessage } from '@/types';
import { useAuthStore } from '@/store/auth-store';

interface MessageBubbleProps {
  message: TicketMessage;
  onImagePress?: (imageUrl: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onImagePress,
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { user } = useAuthStore();
  
  // Determine if the message is from the current user
  const isCurrentUser = user?.role === 'admin' 
    ? message.senderType === 'admin' 
    : message.senderType === 'user';
  
  // Format the date
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <View
      style={[
        styles.container,
        isCurrentUser ? styles.currentUser : styles.otherUser,
      ]}
    >
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: isCurrentUser 
              ? colors.primary + '20' 
              : theme === 'dark' 
                ? colors.card 
                : colors.inputBackground,
            borderBottomLeftRadius: isCurrentUser ? BORDER_RADIUS.md : 0,
            borderBottomRightRadius: isCurrentUser ? 0 : BORDER_RADIUS.md,
          },
        ]}
      >
        <Text style={[styles.content, { color: colors.text }]}>
          {message.content}
        </Text>
        
        {message.imageUrl && (
          <TouchableOpacity
            onPress={() => onImagePress && onImagePress(message.imageUrl!)}
            activeOpacity={0.8}
            style={styles.imageContainer}
          >
            <Image
              source={{ uri: message.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        )}
        
        <Text style={[styles.time, { color: colors.secondaryText }]}>
          {formatTime(message.createdAt)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
    maxWidth: '80%',
  },
  currentUser: {
    alignSelf: 'flex-end',
  },
  otherUser: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
  },
  content: {
    fontSize: FONT_SIZE.md,
    lineHeight: 20,
  },
  imageContainer: {
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.md,
  },
  time: {
    fontSize: FONT_SIZE.xs,
    alignSelf: 'flex-end',
    marginTop: SPACING.xs,
  },
});

export default MessageBubble;