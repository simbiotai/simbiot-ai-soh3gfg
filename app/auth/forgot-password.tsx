import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useApi } from '../../services/api';
import { useTranslation } from '../../i18n'; // Предполагаем, что это хук для переводов

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const api = useApi();
    const { t } = useTranslation(); // Хук для получения переводов

    const handleResetPassword = async () => {
        try {
            await api.post('/reset-password', { email });
            alert(t('resetPassword.success')); // Переводим сообщение
        } catch (error) {
            alert(t('resetPassword.error') + error.message);
        }
    };

    return (
        <View style= {{ padding: 20 }
}>
    <Text>{ t('resetPassword.title') } </Text>
    < TextInput
placeholder = { t('resetPassword.emailPlaceholder') }
value = { email }
onChangeText = { setEmail }
style = {{ borderWidth: 1, marginVertical: 10, padding: 8 }}
      />
    < Button title = { t('resetPassword.submit') } onPress = { handleResetPassword } />
        </View>
  );
}