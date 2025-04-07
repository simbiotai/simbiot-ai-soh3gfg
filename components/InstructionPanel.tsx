import React from 'react';
import { View, Text, Button } from 'react-native';
import { useTranslation } from '../i18n';

export default function InstructionPanel({ onClose }) {
  const { t } = useTranslation();
  return (
    <View style={{ padding: 20, backgroundColor: '#fff' }}>
      <Text>{t('instructions.title')}</Text>
      <Text>{t('instructions.content')}</Text>
      <Button title={t('instructions.close')} onPress={onClose} />
    </View>
  );
}