import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';

const API_URL = 'http://77.91.123.72';

const App = () => {
  const [exchange, setExchange] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!exchange || !apiKey || !apiSecret) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/keys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 48de6d2a-0368-4aa9-a02b-36ec5291af58'
        },
        body: JSON.stringify({
          exchange,
          api_key: apiKey,
          api_secret: apiSecret
        })
      });

      const data = await response.json();

      if (data.status === 'success') {
        Alert.alert('Успех', 'API ключи успешно сохранены');
        // Очищаем поля после успешной отправки
        setExchange('');
        setApiKey('');
        setApiSecret('');
      } else {
        Alert.alert('Ошибка', data.message || 'Произошла ошибка при сохранении ключей');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось подключиться к серверу');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.title}>Добавление API ключей</Text>

          <Text style={styles.label}>Биржа</Text>
          <TextInput
            style={styles.input}
            value={exchange}
            onChangeText={setExchange}
            placeholder="Например: Binance"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>API Key</Text>
          <TextInput
            style={styles.input}
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="Введите API Key"
            placeholderTextColor="#666"
            secureTextEntry
          />

          <Text style={styles.label}>API Secret</Text>
          <TextInput
            style={styles.input}
            value={apiSecret}
            onChangeText={setApiSecret}
            placeholder="Введите API Secret"
            placeholderTextColor="#666"
            secureTextEntry
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Отправка...' : 'Сохранить'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#000',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default App; 