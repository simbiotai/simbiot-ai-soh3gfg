import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, BORDER_RADIUS } from '@/constants/theme';
import Button from '@/components/Button';
import { Plus, X, Image as ImageIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import { useTicketStore } from '@/store/ticket-store';
import TicketCard from '@/components/TicketCard';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function SupportScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { t } = useTranslation();
  const router = useRouter();
  
  const { 
    tickets, 
    createTicket, 
    fetchTickets, 
    setActiveTicket, 
    isLoading, 
    error, 
    clearError 
  } = useTicketStore();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [subjectError, setSubjectError] = useState('');
  const [messageError, setMessageError] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!subject.trim()) {
      setSubjectError(t('ticketSubject') + ' ' + t('error'));
      isValid = false;
    } else {
      setSubjectError('');
    }
    
    if (!message.trim()) {
      setMessageError(t('ticketMessage') + ' ' + t('error'));
      isValid = false;
    } else {
      setMessageError('');
    }
    
    return isValid;
  };
  
  const handleCreateTicket = async () => {
    clearError();
    
    if (validateForm()) {
      try {
        await createTicket(subject, message, selectedImage || undefined);
        
        // Clear form and close modal
        setSubject('');
        setMessage('');
        setSelectedImage(null);
        setModalVisible(false);
        
        // Show success message
        Alert.alert(
          t('success'),
          t('ticketCreated'),
          [{ text: 'OK' }]
        );
      } catch (err) {
        console.error('Failed to create ticket:', err);
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
        setSelectedImage(uri);
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
    setSelectedImage(null);
  };
  
  const handleTicketPress = (ticket) => {
    setActiveTicket(ticket);
    router.push('/support/ticket-details');
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('supportCenter')}
          </Text>
        </View>
        
        {tickets.length > 0 ? (
          <FlatList
            data={tickets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TicketCard ticket={item} onPress={handleTicketPress} />
            )}
            contentContainerStyle={styles.list}
          />
        ) : (
          <View style={[styles.emptyContainer, { borderColor: colors.border }]}>
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              {t('noTickets')}
            </Text>
            <Button
              title={t('createTicket')}
              onPress={() => setModalVisible(true)}
              icon={<Plus size={20} color="#FFFFFF" />}
              style={styles.emptyButton}
            />
          </View>
        )}
        
        {tickets.length > 0 && (
          <View style={styles.createButtonContainer}>
            <Button
              title={t('createTicket')}
              onPress={() => setModalVisible(true)}
              icon={<Plus size={20} color="#FFFFFF" />}
            />
          </View>
        )}
      </View>
      
      {/* Create Ticket Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {t('createTicket')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('ticketSubject')}
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { 
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: subjectError ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('enterTicketSubject')}
                  placeholderTextColor={colors.secondaryText}
                  value={subject}
                  onChangeText={(text) => {
                    setSubject(text);
                    setSubjectError('');
                  }}
                />
                {subjectError && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {subjectError}
                  </Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  {t('ticketMessage')}
                </Text>
                <TextInput
                  style={[
                    styles.textArea,
                    { 
                      backgroundColor: colors.inputBackground,
                      color: colors.text,
                      borderColor: messageError ? colors.error : colors.border,
                    },
                  ]}
                  placeholder={t('enterTicketMessage')}
                  placeholderTextColor={colors.secondaryText}
                  value={message}
                  onChangeText={(text) => {
                    setMessage(text);
                    setMessageError('');
                  }}
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
                {messageError && (
                  <Text style={[styles.errorText, { color: colors.error }]}>
                    {messageError}
                  </Text>
                )}
              </View>
              
              <View style={styles.formGroup}>
                <View style={styles.imagePickerContainer}>
                  {selectedImage ? (
                    <View style={styles.selectedImageContainer}>
                      <TouchableOpacity
                        style={[styles.removeImageButton, { backgroundColor: colors.error }]}
                        onPress={handleRemoveImage}
                      >
                        <X size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.imagePickerButton,
                        { 
                          backgroundColor: colors.inputBackground,
                          borderColor: colors.border,
                        },
                      ]}
                      onPress={handlePickImage}
                    >
                      <ImageIcon size={24} color={colors.primary} />
                      <Text style={[styles.imagePickerText, { color: colors.text }]}>
                        {t('attachImage')}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              
              {error && (
                <Text style={[styles.errorText, { color: colors.error, textAlign: 'center' }]}>
                  {error}
                </Text>
              )}
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <Button
                title={t('cancel')}
                onPress={() => setModalVisible(false)}
                variant="outline"
                style={{ marginRight: SPACING.md }}
              />
              <Button
                title={t('createTicket')}
                onPress={handleCreateTicket}
                isLoading={isLoading}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    padding: SPACING.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  emptyButton: {
    minWidth: 150,
  },
  createButtonContainer: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    left: SPACING.xl,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    paddingTop: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.md,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: 'bold',
  },
  modalBody: {
    marginBottom: SPACING.md,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.md,
    minHeight: 100,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  imagePickerContainer: {
    marginTop: SPACING.xs,
  },
  imagePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.md,
  },
  selectedImageContainer: {
    height: 100,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
  },
});