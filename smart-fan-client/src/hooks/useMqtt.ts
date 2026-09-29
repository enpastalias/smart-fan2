import { useEffect, useState } from "react";
import { mqttClient } from "../mqtt/mqttClient";
import { FanStatusPayload, AppRequestPayload } from "../types/mqtt";

export function useMqtt() {
    const [isConnected, setIsConnected] = useState(false);
    const [status, setStatus] = useState<FanStatusPayload | null>(null);

    useEffect(() => {
        mqttClient.connect();

        const unsubConnection = mqttClient.subscribeToConnection((state) => {
            setIsConnected(state);
        });

        const unsubStatus = mqttClient.subscribeToStatus((data) => {
            setStatus(data);
        });

        return () => {
            unsubConnection();
            unsubStatus();
            // Keep it connected globally or disconnect, usually mobile apps disconnect on background,
            // but keeping it simple we can let it survive component unmount for now, 
            // or rely on the single entry point.
        };
    }, []);

    const sendRequest = (payload: AppRequestPayload) => {
        mqttClient.publishRequest(payload);
    };

    return { isConnected, status, sendRequest };
}
