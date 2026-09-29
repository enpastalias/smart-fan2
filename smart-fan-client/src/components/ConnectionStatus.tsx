import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ConnectionStatusProps {
    isConnected: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.dot, isConnected ? styles.connected : styles.disconnected]} />
            <Text style={styles.text}>{isConnected ? "Connected" : "Disconnected"}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    connected: {
        backgroundColor: '#4caf50',
    },
    disconnected: {
        backgroundColor: '#f44336',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});
