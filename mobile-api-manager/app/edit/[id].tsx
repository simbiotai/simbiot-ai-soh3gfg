import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function EditKeyScreen() {
    const { id } = useLocalSearchParams();
    const [exchange, setExchange] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchKey();
    }, []);

    const fetchKey = async () => {
        try {
            const response = await axios.get(`http://77.91.123.72/api/keys/${id}`);
            const key = response.data;
            setExchange(key.exchange);
            setApiKey(key.api_key);
            setApiSecret(key.api_secret);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить данные ключа');
            router.back();
        }
    };

    const handleSubmit = async () => {
        if (!exchange || !apiKey || !apiSecret) {
            Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
            return;
        }

        try {
            await axios.put(`http://77.91.123.72/api/keys/${id}`, {
                exchange,
                api_key: apiKey,
                api_secret: apiSecret,
            });
            Alert.alert('Успех', 'API ключ успешно обновлен');
            router.back();
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось обновить API ключ');
        }
    };

    const handleDelete = async () => {
        Alert.alert(
            'Подтверждение',
            'Вы уверены, что хотите удалить этот ключ?',
            [
                { text: 'Отмена', style: 'cancel' },
                {
                    text: 'Удалить',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`http://77.91.123.72/api/keys/${id}`);
                            Alert.alert('Успех', 'API ключ успешно удален');
                            router.back();
                        } catch (error) {
                            Alert.alert('Ошибка', 'Не удалось удалить API ключ');
                        }
                    },
                },
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Редактировать API ключ</Text>

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

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={handleDelete}>
                <Text style={styles.buttonText}>Удалить</Text>
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
    deleteButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 