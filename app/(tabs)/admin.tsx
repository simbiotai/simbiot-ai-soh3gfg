import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuthStore } from '../../store/auth-store';
import { useApiKeyStore } from '../../store/api-key-store';
import { useTicketStore } from '../../store/ticket-store';
import { useTranslation } from '../../i18n';

export default function AdminPanel() {
  const { user } = useAuthStore();
  const { apiKeys, banApiKey } = useApiKeyStore();
  const { tickets, replyToTicket, closeTicket } = useTicketStore();
  const { t } = useTranslation();

  if (!user?.isAdmin) {
    return <Text>{t('admin.accessDenied')}</Text>;
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>{t('admin.users')}</Text>
      {apiKeys.map((key) => (
        <View key={key.id}>
          <Text>{key.email} - {key.key}</Text>
          <Button title={t('admin.ban')} onPress={() => banApiKey(key.id)} />
        </View>
      ))}
      <Text>{t('admin.tickets')}</Text>
      {tickets.map((ticket) => (
        <View key={ticket.id}>
          <Text>{ticket.title} {ticket.unread && `(${t('admin.unread')})`}</Text>
          <Button title={t('admin.reply')} onPress={() => replyToTicket(ticket.id, t('admin.replyText'))} />
          <Button title={t('admin.close')} onPress={() => closeTicket(ticket.id)} />
        </View>
      ))}
    </View>
  );
}