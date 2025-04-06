import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput, 
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Easing,
  ActivityIndicator
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import { useTicketStore } from '@/store/ticket-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import TicketStatusBadge from '@/components/TicketStatusBadge';
import MessageBubble from '@/components/MessageBubble';
import { 
  ArrowLeft, 
  Send, 
  Image as ImageIcon, 
  X, 
  CheckCircle, 
  XCircle 
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';

export default function TicketDetailsScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const router = useRouter();
  const { t } = useTranslation();
  
  const { 
    activeTicket, 
    isLoading, 
    sendMessage, 
    updateTicketStatus, 
    clearError 
  } = useTicketStore();
  
  const [replyMessage, setReplyMessage] = useState('');
  const [replyImage, setReplyImage] = useState<string | null>(null);
  const [replyError, setReplyError] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  
  // Ref for scrolling to bottom of messages
  const scrollViewRef = useRef<ScrollView>(null);
  
  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
    
    // Scroll to bottom of messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, [fadeAnim, slideAnim]);
  
  const validateReplyForm = () => {
    let isValid = true;
    
    if (!replyMessage.trim() && !replyImage) {
      setReplyError(t('ticketMessage') + ' ' + t('error'));
      isValid = false;
    } else {
      setReplyError('');
    }
    
    return isValid;
  };
  
  const handleSendReply = async () => {
    clearError();
    
    if (!activeTicket) {
      router.back();
      return;
    }
    
    if (validateReplyForm()) {
      try {
        await sendMessage(activeTicket.id, replyMessage, replyImage || undefined);
        
        // Clear the reply form
        setReplyMessage('');
        setReplyImage(null);
        setReplyError('');
        
        // Scroll to bottom of messages
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      } catch (err) {
        console.error('Failed to send reply:', err);
      }
    }
  };
  
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setReplyImage(uri);
        setReplyError('');
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert(
        t('error'),
        t('imagePickError'),
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleRemoveImage = () => {
    setReplyImage(null);
  };
  
  const handleViewImage = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
  };
  
  const handleCloseFullScreenImage = () => {
    setFullScreenImage(null);
  };
  
  const handleUpdateTicketStatus = async (status: 'active' | 'viewed' | 'closed') => {
    if (!activeTicket) return;
    
    try {
      await updateTicketStatus(activeTicket.id, status);
      
      // Show success message
      Alert.alert(
        t('success'),
        t('ticketStatusUpdated'),
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Failed to update ticket status:', err);
    }
  };
  
  // If no active ticket, go back
  if (!activeTicket) {
    router.back();
    return null;
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('ticketDetails'),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TicketStatusBadge status={activeTicket.status} />
          ),
        }}
      />
      
      <Animated.View 
        style={[
          styles.content,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }
        ]}
      >
        <View style={[styles.ticketSubject, { borderBottomColor: colors.border }]}>
          <Text style={[styles.ticketSubjectText, { color: colors.text }]}>
            {activeTicket.subject}
          </Text>
        </View>
        
        <ScrollView 
          style={styles.messagesContainer}
          ref={scrollViewRef}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
        >
          {activeTicket.messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              message={msg} 
              onImagePress={handleViewImage}
            />
          ))}
        </ScrollView>
        
        <View style={styles.ticketActions}>
          {activeTicket.status !== 'closed' ? (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: colors.error + '20' }]}
              onPress={() => handleUpdateTicketStatus('closed')}
            >
              <XCircle size={16} color={colors.error} />
              <Text style={[styles.statusButtonText, { color: colors.error }]}>
                {t('close')}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.statusButton, { backgroundColor: colors.success + '20' }]}
              onPress={() => handleUpdateTicketStatus('active')}
            >
              <CheckCircle size={16} color={colors.success} />
              <Text style={[styles.statusButtonText, { color: colors.success }]}>
                {t('reopen')}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {activeTicket.status !== 'closed' && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={100}
          >
            <View style={styles.replyContainer}>
              {replyImage && (
                <View style={styles.replyImageContainer}>
                  <Image
                    source={{ uri: replyImage }}
                    style={styles.replyImagePreview}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={[styles.removeReplyImageButton, { backgroundColor: colors.error }]}
                    onPress={handleRemoveImage}
                  >
                    <X size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              )}
              
              <View style={styles.replyInputContainer}>
                <TextInput
                  style={[
                    styles.replyInput,
                    { 
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: replyError ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('replyToTicket')}
                  placeholderTextColor={colors.secondaryText}
                  value={replyMessage}
                  onChangeText={(text) => {
                    setReplyMessage(text);
                    setReplyError('');
                  }}
                  multiline
                />
                
                <TouchableOpacity
                  style={[styles.attachReplyButton, { backgroundColor: colors.primary + '20' }]}
                  onPress={handlePickImage}
                >
                  <ImageIcon size={20} color={colors.primary} />
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.sendReplyButton, { backgroundColor: colors.primary }]}
                  onPress={handleSendReply}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Send size={20} color="#FFFFFF" />
                  )}
                </TouchableOpacity>
              </View>
              
              {replyError && (
                <Text style={[styles.replyErrorText, { color: colors.error }]}>
                  {replyError}
                </Text>
              )}
            </View>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
      
      {/* Full Screen Image Modal */}
      {fullScreenImage && (
        <TouchableOpacity
          style={styles.fullScreenImageContainer}
          activeOpacity={1}
          onPress={handleCloseFullScreenImage}
        >
          <TouchableOpacity
            style={styles.fullScreenCloseButton}
            onPress={handleCloseFullScreenImage}
          >
            <X size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Image
            source={{ uri: fullScreenImage }}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  ticketSubject: {
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  ticketSubjectText: {
    fontSize: FONT_SIZE.md,
    fontWeight: 'bold',
  },
  messagesContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  ticketActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
  },
  statusButtonText: {
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  replyContainer: {
    padding: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  replyImageContainer: {
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
    height: 100,
  },
  replyImagePreview: {
    width: '100%',
    height: '100%',
  },
  removeReplyImageButton: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  attachReplyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  sendReplyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyErrorText: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  fullScreenImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  fullScreenCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
    padding: SPACING.sm,
  },
});