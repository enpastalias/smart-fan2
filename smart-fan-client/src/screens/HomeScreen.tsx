import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, Button, Alert } from 'react-native';
import { useMqtt } from '../hooks/useMqtt';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { ModeSelector } from '../components/ModeSelector';
import { FanSpeedControl } from '../components/FanSpeedControl';
import { ServoAngleControl } from '../components/ServoAngleControl';
import { StatusCard } from '../components/StatusCard';
import { FanMode } from '../types/mqtt';

export const HomeScreen = () => {
    const { isConnected, status, sendRequest } = useMqtt();

    const handleModeChange = (mode: FanMode) => {
        sendRequest({ type: 'set_mode', mode });
    };

    const handleSpeedChange = (speed: number) => {
        sendRequest({ type: 'set_speed', speed });
    };

    const handleAngleChange = (angle: number) => {
        sendRequest({ type: 'set_angle', angle });
    };

    // Default values if status is not available
    const currentMode = status?.mode || 'manual';
    const isActiveManual = currentMode === 'manual';

    const currentServerSpeed = status?.fanSpeed || 0;
    const currentServerAngle = status?.servoAngle || 90;

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Smart Fan Control</Text>
                </View>

                <ConnectionStatus isConnected={isConnected} />

                <ModeSelector
                    currentMode={currentMode}
                    onModeChange={handleModeChange}
                />

                {/* When AUTO, do not show active manual sliders */}
                <FanSpeedControl
                    currentServerSpeed={currentServerSpeed}
                    onSpeedRequested={handleSpeedChange}
                    isActive={isActiveManual}
                />

                <ServoAngleControl
                    currentServerAngle={currentServerAngle}
                    onAngleRequested={handleAngleChange}
                    isActive={isActiveManual}
                />

                <StatusCard status={status} />

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        padding: 16,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        marginTop: 20,
    },
    headerText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        letterSpacing: 1,
    },
});
