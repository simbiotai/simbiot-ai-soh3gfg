import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Animated,
  Easing,
  Image
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/theme';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const router = useRouter();
  
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [fadeAnim, slideAnim, isAuthenticated, router]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate email
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  const handleLogin = async () => {
    clearError();
    
    if (validateForm()) {
      try {
        await login(email, password);
        // Navigation will happen automatically due to the useEffect above
      } catch (err) {
        // Error is handled by the store
      }
    }
  };
  
  const navigateToSignup = () => {
    router.push('/auth/signup');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <Stack.Screen 
        options={{ 
          headerShown: false,
        }} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              { 
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              }
            ]}
          >
            <View style={styles.logoContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=2832&auto=format&fit=crop' }}
                style={styles.logo}
              />
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>
              Simbiot AI
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
              Simbiot AI system that trades for you based on artificial intelligence
            </Text>
            
            <View style={styles.form}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError('');
                  clearError();
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                error={emailError}
                leftIcon={<Mail size={20} color={colors.secondaryText} />}
              />
              
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError('');
                  clearError();
                }}
                secureTextEntry
                error={passwordError}
                leftIcon={<Lock size={20} color={colors.secondaryText} />}
              />
              
              {error && (
                <Text style={[styles.errorText, { color: colors.error }]}>
                  {error}
                </Text>
              )}
              
              <Button
                title="Log In"
                onPress={handleLogin}
                isLoading={isLoading}
                style={styles.loginButton}
                icon={<ArrowRight size={20} color="#FFFFFF" />}
                iconPosition="right"
              />
              
              <View style={styles.signupContainer}>
                <Text style={[styles.signupText, { color: colors.secondaryText }]}>
                  Don't have an account?
                </Text>
                <TouchableOpacity onPress={navigateToSignup}>
                  <Text style={[styles.signupLink, { color: colors.primary }]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  form: {
    width: '100%',
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  signupText: {
    fontSize: FONT_SIZE.md,
  },
  signupLink: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
    marginLeft: SPACING.xs,
  },
});