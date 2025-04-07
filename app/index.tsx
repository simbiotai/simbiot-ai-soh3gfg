import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useApi } from '../services/api';
import Input from '../components/Input';
import StatusIndicator from '../components/StatusIndicator';
import InstructionPanel from '../components/InstructionPanel';
import { useTranslation } from '../i18n';

export default function MainScreen() {
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('Disconnected');
  const [showInstructions, setShowInstructions] = useState(false);
  const api = useApi();
  const { t } = useTranslation();

  const submitApiKey = async () => {
    setStatus('Connecting');
    try {
      await api.post('/api-keys', { key: apiKey });
      setStatus('Connected');
    } catch (error) {
      setStatus('Disconnected');
      alert(t('main.error') + error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Input
        value={apiKey}
        onChangeText={setApiKey}
        placeholder={t('main.apiKeyPlaceholder')}
      />
      <Button title={t('main.submit')} onPress={submitApiKey} />
      <StatusIndicator status={status} />
      <Button
        title={t('main.howToFindApiKeys')}
        onPress={() => setShowInstructions(true)}
      />
      {showInstructions && <InstructionPanel onClose={() => setShowInstructions(false)} />}
    </View>
  );
}
