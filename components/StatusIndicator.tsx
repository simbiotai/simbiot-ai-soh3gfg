import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { FONT_SIZE, SPACING } from '@/constants/theme';

type StatusType = 'connected' | 'failed' | 'pending';

interface StatusIndicatorProps {
  status: StatusType;
  showText?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  showText = true,
  size = 'medium',
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  
  // Animation for the indicator
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (status === 'pending') {
      // Pulse animation for pending status
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
      
      // Rotation animation for pending status
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Reset animations for other statuses
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [status, pulseAnim, rotateAnim]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Determine indicator color based on status
  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return colors.success;
      case 'failed':
        return colors.error;
      case 'pending':
        return colors.warning;
      default:
        return colors.inactive;
    }
  };
  
  // Determine indicator size based on size prop
  const getIndicatorSize = () => {
    switch (size) {
      case 'small':
        return 8;
      case 'medium':
        return 12;
      case 'large':
        return 16;
      default:
        return 12;
    }
  };
  
  // Determine text based on status
  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'Connected';
      case 'failed':
        return 'Failed';
      case 'pending':
        return 'Pending';
      default:
        return '';
    }
  };
  
  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.indicator,
          {
            backgroundColor: getStatusColor(),
            width: getIndicatorSize(),
            height: getIndicatorSize(),
            transform: [
              { scale: status === 'pending' ? pulseAnim : 1 },
              { rotate: status === 'pending' ? rotate : '0deg' },
            ],
          },
        ]}
      />
      {showText && (
        <Text
          style={[
            styles.text,
            { color: colors.secondaryText, fontSize: size === 'small' ? FONT_SIZE.xs : FONT_SIZE.sm },
          ]}
        >
          {getStatusText()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    borderRadius: 999,
  },
  text: {
    marginLeft: SPACING.xs,
  },
});

export default StatusIndicator;