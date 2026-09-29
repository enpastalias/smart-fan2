import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface FanSpeedControlProps {
    currentServerSpeed: number;
    onSpeedRequested: (speed: number) => void;
    isActive: boolean;
}

export const FanSpeedControl: React.FC<FanSpeedControlProps> = ({ currentServerSpeed, onSpeedRequested, isActive }) => {
    const [localSpeed, setLocalSpeed] = useState(currentServerSpeed);

    useEffect(() => {
        // When the server speed changes, update our local slider ONLY if we aren't currently dragging it
        // For simplicity, we just sync it here since the user requested Pi as the source of truth.
        setLocalSpeed(currentServerSpeed);
    }, [currentServerSpeed]);

    return (
        <View style={[styles.card, !isActive && styles.cardDisabled]}>
            <Text style={styles.title}>Fan Speed (MANUAL)</Text>

            <View style={styles.valueRow}>
                <Text style={styles.valueLabel}>Current: {currentServerSpeed} / 255</Text>
                <Text style={styles.valueLabel}>Set: {Math.round(localSpeed)}</Text>
            </View>

            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={255}
                step={1}
                value={localSpeed}
                onValueChange={setLocalSpeed}
                onSlidingComplete={onSpeedRequested}
                disabled={!isActive}
                minimumTrackTintColor="#2196f3"
                maximumTrackTintColor="#d3d3d3"
                thumbTintColor={isActive ? "#2196f3" : "#aaa"}
            />
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
    cardDisabled: {
        opacity: 0.5,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    valueRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    valueLabel: {
        fontSize: 14,
        color: '#666',
    },
    slider: {
        width: '100%',
        height: 40,
    },
});
