import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle,
  Animated,
  Easing,
  TouchableOpacity,
  Platform
} from 'react-native';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { BORDER_RADIUS, FONT_SIZE, SPACING } from '@/constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  disabled?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'number-pad';
  multiline?: boolean;
  numberOfLines?: number;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  onBlur?: () => void;
  onFocus?: () => void;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  autoCorrect?: boolean;
  maxLength?: number;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  error,
  disabled = false,
  autoCapitalize = 'none',
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  onBlur,
  onFocus,
  rightIcon,
  leftIcon,
  autoCorrect = false,
  maxLength,
}) => {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Animation for focus effect
  const borderAnim = React.useRef(new Animated.Value(0)).current;
  
  React.useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [isFocused, borderAnim]);
  
  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, colors.primary]
  });
  
  const handleFocus = () => {
    setIsFocused(true);
    if (onFocus) onFocus();
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  // Determine if we should show the password toggle
  const shouldShowPasswordToggle = secureTextEntry && !disabled;
  
  // Determine the actual secure text entry state
  const actualSecureTextEntry = secureTextEntry && !showPassword;
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[
          styles.label, 
          { color: colors.text }, 
          labelStyle
        ]}>
          {label}
        </Text>
      )}
      
      <Animated.View style={[
        styles.inputContainer,
        {
          backgroundColor: colors.inputBackground,
          borderColor: error ? colors.error : borderColor,
          opacity: disabled ? 0.7 : 1,
        },
      ]}>
        {leftIcon && (
          <View style={styles.leftIconContainer}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              height: multiline ? numberOfLines * 20 : undefined,
            },
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || shouldShowPasswordToggle) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.secondaryText}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={actualSecureTextEntry}
          editable={!disabled}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
        />
        
        {shouldShowPasswordToggle && (
          <TouchableOpacity 
            style={styles.rightIconContainer}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            {showPassword ? (
              <EyeOff size={20} color={colors.secondaryText} />
            ) : (
              <Eye size={20} color={colors.secondaryText} />
            )}
          </TouchableOpacity>
        )}
        
        {rightIcon && !shouldShowPasswordToggle && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}
      </Animated.View>
      
      {error && (
        <Text style={[
          styles.error, 
          { color: colors.error }, 
          errorStyle
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm : SPACING.xs,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.md,
  },
  inputWithLeftIcon: {
    paddingLeft: SPACING.xs,
  },
  inputWithRightIcon: {
    paddingRight: SPACING.xs,
  },
  leftIconContainer: {
    paddingLeft: SPACING.md,
  },
  rightIconContainer: {
    paddingRight: SPACING.md,
  },
  error: {
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});

export default Input;