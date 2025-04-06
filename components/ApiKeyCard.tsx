import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Animated, Platform } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/theme';
import { ApiKey } from '@/types';
import { StatusIndicator } from './StatusIndicator';
import Button from './Button';
import { Trash2 } from 'lucide-react-native';
import { useApiKeyStore } from '@/store/api-key-store';

interface ApiKeyCardProps {
  apiKey: ApiKey;
}

export const ApiKeyCard: React.FC<ApiKeyCardProps> = ({ apiKey }) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { deleteApiKey } = useApiKeyStore();
  
  // Animation for deletion
  const [deleteAnim] = useState(new Animated.Value(1));
  const [isDeleting, setIsDeleting] = useState(false);
  
  const confirmDelete = () => {
    Alert.alert(
      'Delete API Key',
      `Are you sure you want to delete the API key for ${apiKey.exchangeName}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: handleDelete,
        },
      ]
    );
  };
  
  const handleDelete = () => {
    setIsDeleting(true);
    
    // Animate the card out
    Animated.timing(deleteAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // Delete the API key after animation completes
      deleteApiKey(apiKey.id);
    });
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
  
  // Mask the API key and secret
  const maskText = (text: string) => {
    if (!text) return '';
    if (text.length <= 8) {
      return '•'.repeat(text.length);
    }
    return text.substring(0, 4) + '•'.repeat(text.length - 8) + text.substring(text.length - 4);
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: deleteAnim,
          transform: [
            { scale: deleteAnim },
            { translateX: deleteAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-300, 0],
            })},
          ],
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.exchangeName, { color: colors.text }]}>
          {apiKey.exchangeName}
        </Text>
        <StatusIndicator status={apiKey.status} />
      </View>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>API Key:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {maskText(apiKey.apiKey)}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.secondaryText }]}>Created:</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>
            {formatDate(apiKey.createdAt)}
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <Button
          title="Delete"
          onPress={confirmDelete}
          variant="outline"
          size="small"
          icon={<Trash2 size={16} color={colors.error} />}
          style={{ borderColor: colors.error }}
          textStyle={{ color: colors.error }}
          disabled={isDeleting}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  exchangeName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  details: {
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: SPACING.xs,
  },
  detailLabel: {
    width: 80,
    fontSize: FONT_SIZE.sm,
  },
  detailValue: {
    flex: 1,
    fontSize: FONT_SIZE.sm,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default ApiKeyCard;