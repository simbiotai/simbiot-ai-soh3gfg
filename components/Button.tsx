import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  View
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  
  // Determine button styles based on variant and size
  const getButtonStyles = (): ViewStyle => {
    let buttonStyle: ViewStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = {
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
        break;
      case 'secondary':
        buttonStyle = {
          backgroundColor: theme === 'light' ? colors.card : colors.inputBackground,
          borderWidth: 0,
        };
        break;
      case 'outline':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        };
        break;
      case 'text':
        buttonStyle = {
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingHorizontal: 0,
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.xs,
          paddingHorizontal: SPACING.md,
          borderRadius: BORDER_RADIUS.md,
        };
        break;
      case 'medium':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.lg,
          borderRadius: BORDER_RADIUS.md,
        };
        break;
      case 'large':
        buttonStyle = {
          ...buttonStyle,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          borderRadius: BORDER_RADIUS.lg,
        };
        break;
    }
    
    // Disabled state
    if (disabled) {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: variant === 'outline' || variant === 'text' 
          ? 'transparent' 
          : colors.inactive,
        borderColor: variant === 'outline' ? colors.inactive : buttonStyle.borderColor,
        opacity: 0.7,
      };
    }
    
    return buttonStyle;
  };
  
  // Determine text styles based on variant and size
  const getTextStyles = (): TextStyle => {
    let textStyleObj: TextStyle = {
      textAlign: 'center',
      fontWeight: '600',
    };
    
    // Variant styles
    switch (variant) {
      case 'primary':
        textStyleObj = {
          ...textStyleObj,
          color: '#FFFFFF',
        };
        break;
      case 'secondary':
        textStyleObj = {
          ...textStyleObj,
          color: colors.text,
        };
        break;
      case 'outline':
      case 'text':
        textStyleObj = {
          ...textStyleObj,
          color: disabled ? colors.inactive : colors.primary,
        };
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZE.sm,
        };
        break;
      case 'medium':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZE.md,
        };
        break;
      case 'large':
        textStyleObj = {
          ...textStyleObj,
          fontSize: FONT_SIZE.lg,
        };
        break;
    }
    
    return textStyleObj;
  };
  
  return (
    <View>
      <TouchableOpacity
        onPress={onPress}
        disabled={isLoading || disabled}
        style={[
          styles.button,
          getButtonStyles(),
          style,
        ]}
        activeOpacity={0.8}
      >
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : colors.primary} 
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && icon}
            <Text style={[getTextStyles(), textStyle, icon ? styles.textWithIcon : null]}>
              {title}
            </Text>
            {icon && iconPosition === 'right' && icon}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWithIcon: {
    marginHorizontal: SPACING.xs,
  },
});

export default Button;