import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

interface ApiKey {
    id: number;
    exchange: string;
    api_key: string;
    api_secret: string;
    created_at: string;
}

export default function HomeScreen() {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const router = useRouter();

    useEffect(() => {
        fetchApiKeys();
    }, []);

    const fetchApiKeys = async () => {
        try {
            const response = await axios.get('http://77.91.123.72/api/keys');
            setApiKeys(response.data);
        } catch (error) {
            Alert.alert('Ошибка', 'Не удалось загрузить API ключи');
        }
    };

    const renderItem = ({ item }: { item: ApiKey }) => (
        <TouchableOpacity
            style={styles.keyItem}
            onPress={() => router.push(`/edit/${item.id}`)}
        >
            <Text style={styles.exchangeName}>{item.exchange}</Text>
            <Text style={styles.keyText}>API Key: {item.api_key.substring(0, 8)}...</Text>
            <Text style={styles.keyText}>Secret: {item.api_secret.substring(0, 8)}...</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>API Ключи</Text>
            <FlatList
                data={apiKeys}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                style={styles.list}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push('/add')}
            >
                <Text style={styles.addButtonText}>Добавить ключ</Text>
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
    list: {
        flex: 1,
    },
    keyItem: {
        backgroundColor: '#f5f5f5',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    exchangeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    keyText: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 