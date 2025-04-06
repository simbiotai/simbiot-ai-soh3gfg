import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle,
  Animated,
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { BORDER_RADIUS, SPACING } from '@/constants/theme';
import { SHADOWS } from '@/constants/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  elevation?: 'none' | 'small' | 'medium' | 'large';
  animated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  elevation = 'small',
  animated = false,
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const shadows = SHADOWS[theme];
  
  // Animation for hover/press effect
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  
  React.useEffect(() => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  }, [animated, onPress, scaleAnim]);
  
  const handlePressIn = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (animated && onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }).start();
    }
  };
  
  // Get shadow style based on elevation
  const getShadowStyle = () => {
    switch (elevation) {
      case 'none':
        return {};
      case 'small':
        return shadows.small;
      case 'medium':
        return shadows.medium;
      case 'large':
        return shadows.large;
      default:
        return shadows.small;
    }
  };
  
  const cardStyle = [
    styles.card,
    {
      backgroundColor: colors.card,
      borderColor: colors.border,
    },
    getShadowStyle(),
    style,
  ];
  
  if (onPress) {
    return (
      <Animated.View
        style={[
          cardStyle,
          animated && { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
          onTouchCancel={handlePressOut}
        >
          {children}
        </View>
      </Animated.View>
    );
  }
  
  return <View style={cardStyle}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    marginVertical: SPACING.sm,
  },
});

export default Card;