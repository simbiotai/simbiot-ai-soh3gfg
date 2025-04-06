import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

export default function AddKeyScreen() {
    const [exchange, setExchange] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const router = useRouter();

    const handleSubmit = async () => {
        if (!exchange || !apiKey || !apiSecret) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        try {
            await axios.post('http://77.91.123.72/api/keys', {
                exchange,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            Alert.alert('Успех', 'API ключ успешно добавлен');
            router.back();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось добавить API ключ');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Добавить API ключ</Text>

            <TextInput
                style={styles.input}
                placeholder="Название биржи"
                value={exchange}
                onChangeText={setExchange}
            />

            <TextInput
                style={styles.input}
                placeholder="API Key"
                value={apiKey}
                onChangeText={setApiKey}
                secureTextEntry
            />

            <TextInput
                style={styles.input}
                placeholder="API Secret"
                value={apiSecret}
                onChangeText={setApiSecret}
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Сохранить</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 15,
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 