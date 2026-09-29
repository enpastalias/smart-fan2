import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FanMode } from '../types/mqtt';

interface ModeSelectorProps {
    currentMode: FanMode;
    onModeChange: (mode: FanMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ currentMode, onModeChange }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Operating Mode</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, currentMode === 'auto' && styles.buttonActive]}
                    onPress={() => onModeChange('auto')}
                >
                    <Text style={[styles.buttonText, currentMode === 'auto' && styles.buttonTextActive]}>AUTO</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, currentMode === 'manual' && styles.buttonActive]}
                    onPress={() => onModeChange('manual')}
                >
                    <Text style={[styles.buttonText, currentMode === 'manual' && styles.buttonTextActive]}>MANUAL</Text>
                </TouchableOpacity>
            </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderRadius: 6,
        backgroundColor: '#e0e0e0',
        alignItems: 'center',
    },
    buttonActive: {
        backgroundColor: '#2196f3',
    },
    buttonText: {
        fontWeight: 'bold',
        color: '#666',
    },
    buttonTextActive: {
        color: '#fff',
    },
});
