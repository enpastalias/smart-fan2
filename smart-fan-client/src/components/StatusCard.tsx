import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FanStatusPayload } from '../types/mqtt';

interface StatusCardProps {
    status: FanStatusPayload | null;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status }) => {
    if (!status) {
        return (
            <View style={styles.card}>
                <Text style={styles.title}>System Status</Text>
                <Text style={styles.infoText}>Waiting for initial payload from Raspberry Pi...</Text>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <Text style={styles.title}>System Status</Text>

            <View style={styles.row}>
                <Text style={styles.label}>ESP32 Connected:</Text>
                <Text style={[styles.val, status.esp32Connected ? styles.ok : styles.error]}>
                    {status.esp32Connected ? "YES" : "NO"}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Target:</Text>
                <Text style={[styles.val, status.targetDetected ? styles.ok : styles.warn]}>
                    {status.targetDetected ? "Detected" : "Not detected"}
                </Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Distance:</Text>
                <Text style={styles.val}>{status.distanceCm !== undefined ? `${status.distanceCm} cm` : "N/A"}</Text>
            </View>

            {status.mode === 'auto' && (
                <>
                    <View style={styles.row}>
                        <Text style={styles.label}>Auto Fan Speed:</Text>
                        <Text style={styles.val}>{status.fanSpeed} / 255</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Auto Direction:</Text>
                        <Text style={styles.val}>{status.servoAngle}°</Text>
                    </View>
                </>
            )}

        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    infoText: {
        color: '#777',
        fontStyle: 'italic',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    label: {
        fontSize: 15,
        color: '#555',
    },
    val: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    ok: {
        color: '#4caf50',
    },
    warn: {
        color: '#ff9800',
    },
    error: {
        color: '#f44336',
    },
});
