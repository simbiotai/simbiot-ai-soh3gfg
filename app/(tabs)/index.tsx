import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Platform,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '@/store/theme-store';
import { useApiKeyStore } from '@/store/api-key-store';
import { useAuthStore } from '@/store/auth-store';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE } from '@/constants/theme';
import Button from '@/components/Button';
import Input from '@/components/Input';
import ApiKeyCard from '@/components/ApiKeyCard';
import { Plus, HelpCircle, AlertTriangle, Search } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import InstructionPanel from '@/components/InstructionPanel';

export default function ApiKeysScreen() {
  const { theme } = useThemeStore();
  const colors = Colors[theme];
  const { apiKeys, addApiKey, isLoading, error, clearError, fetchApiKeys } = useApiKeyStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();
  
  const [exchangeName, setExchangeName] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [exchangeNameError, setExchangeNameError] = useState('');
  const [apiKeyError, setApiKeyError] = useState('');
  const [apiSecretError, setApiSecretError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  React.useEffect(() => {
    // Fetch API keys
    try {
      fetchApiKeys();
    } catch (error) {
      console.log('Error fetching API keys:', error);
    }
  }, [fetchApiKeys]);
  
  const validateForm = () => {
    let isValid = true;
    
    // Validate exchange name
    if (!exchangeName) {
      setExchangeNameError(t('exchangeName') + ' ' + t('error'));
      isValid = false;
    } else {
      setExchangeNameError('');
    }
    
    // Validate API key
    if (!apiKey) {
      setApiKeyError(t('apiKey') + ' ' + t('error'));
      isValid = false;
    } else {
      setApiKeyError('');
    }
    
    // Validate API secret
    if (!apiSecret) {
      setApiSecretError(t('apiSecret') + ' ' + t('error'));
      isValid = false;
    } else {
      setApiSecretError('');
    }
    
    return isValid;
  };
  
  const handleAddApiKey = async () => {
    clearError();
    
    if (validateForm()) {
      try {
        // Use a try-catch block to handle potential network errors
        try {
          await addApiKey(exchangeName, apiKey, apiSecret);
          
          // Clear form after successful submission
          setExchangeName('');
          setApiKey('');
          setApiSecret('');
          
          // Show success message
          Alert.alert(
            t('success'),
            t('apiKeyConnected'),
            [{ text: 'OK' }]
          );
        } catch (err) {
          // Handle network errors gracefully
          console.warn('Network error when adding API key:', err);
          Alert.alert(
            t('success'),
            Platform.OS === 'web' 
              ? t('apiKeyConnectedOffline') 
              : t('apiKeyConnectedOffline'),
            [{ text: 'OK' }]
          );
          
          // Still add the key in offline mode
          await addApiKey(exchangeName, apiKey, apiSecret, true);
          
          // Clear form
          setExchangeName('');
          setApiKey('');
          setApiSecret('');
        }
      } catch (err) {
        // Error is handled by the store
        console.error('Error adding API key:', err);
      }
    }
  };
  
  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };
  
  // Filter API keys based on search query
  const filteredApiKeys = apiKeys.filter(key => 
    key.exchangeName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Check if user is banned
  if (user?.isBanned) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        
        <View style={styles.bannedContainer}>
          <AlertTriangle size={60} color={colors.error} />
          <Text style={[styles.bannedTitle, { color: colors.error }]}>
            {t('error')}
          </Text>
          <Text style={[styles.bannedMessage, { color: colors.text }]}>
            {t('bannedMessage')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('connectExchange')}
          </Text>
          <TouchableOpacity 
            style={[styles.helpButton, { backgroundColor: colors.primary }]}
            onPress={toggleInstructions}
          >
            <HelpCircle size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Input
            label={t('exchangeName')}
            placeholder={t('enterExchangeName')}
            value={exchangeName}
            onChangeText={(text) => {
              setExchangeName(text);
              setExchangeNameError('');
              clearError();
            }}
            error={exchangeNameError}
          />
          
          <Input
            label={t('apiKey')}
            placeholder={t('enterApiKey')}
            value={apiKey}
            onChangeText={(text) => {
              setApiKey(text);
              setApiKeyError('');
              clearError();
            }}
            error={apiKeyError}
          />
          
          <Input
            label={t('apiSecret')}
            placeholder={t('enterApiSecret')}
            value={apiSecret}
            onChangeText={(text) => {
              setApiSecret(text);
              setApiSecretError('');
              clearError();
            }}
            secureTextEntry
            error={apiSecretError}
          />
          
          {error && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          )}
          
          <Button
            title={t('connect')}
            onPress={handleAddApiKey}
            isLoading={isLoading}
            icon={<Plus size={20} color="#FFFFFF" />}
          />
          
          <TouchableOpacity 
            style={styles.instructionsButton}
            onPress={toggleInstructions}
          >
            <Text style={[styles.instructionsText, { color: colors.primary }]}>
              {t('howToFindApiKeys')}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.listHeader}>
          <View style={styles.listTitleContainer}>
            <Text style={[styles.listTitle, { color: colors.text }]}>
              {t('yourApiKeys')}
            </Text>
            <Text style={[styles.listSubtitle, { color: colors.secondaryText }]}>
              {filteredApiKeys.length} {filteredApiKeys.length === 1 ? t('keyConnected') : t('keysConnected')}
            </Text>
          </View>
          
          <Input
            placeholder={t('searchApiKeys')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
            rightIcon={<Search size={20} color={colors.secondaryText} />}
          />
        </View>
        
        <FlatList
          data={filteredApiKeys}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ApiKeyCard apiKey={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={[styles.emptyContainer, { borderColor: colors.border }]}>
              <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
                {searchQuery 
                  ? t('noSearchResults') 
                  : t('noApiKeysConnected')}
              </Text>
            </View>
          }
        />
      </View>
      
      <InstructionPanel 
        isVisible={showInstructions} 
        onClose={toggleInstructions} 
      />
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
  helpButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  instructionsButton: {
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  instructionsText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '500',
  },
  listHeader: {
    marginBottom: SPACING.sm,
  },
  listTitleContainer: {
    marginBottom: SPACING.sm,
  },
  listTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: 'bold',
  },
  listSubtitle: {
    fontSize: FONT_SIZE.sm,
  },
  searchInput: {
    marginBottom: 0,
  },
  list: {
    paddingBottom: SPACING.xl,
  },
  emptyContainer: {
    padding: SPACING.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },
  bannedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  bannedTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  bannedMessage: {
    fontSize: FONT_SIZE.lg,
    textAlign: 'center',
    lineHeight: 24,
  },
});