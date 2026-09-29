import { Client, Message } from "paho-mqtt";
import { MQTT_CONFIG } from "../config/mqttConfig";
import { MQTT_TOPICS } from "./mqttTopics";
import { AppRequestPayload, FanStatusPayload } from "../types/mqtt";

type StatusCallback = (payload: FanStatusPayload) => void;
type ConnectionCallback = (isConnected: boolean) => void;

class MqttManager {
    private client: Client | null = null;
    private isConnected = false;
    private statusCallbacks: StatusCallback[] = [];
    private connectionCallbacks: ConnectionCallback[] = [];
    private reconnectTimeout = 5000;

    constructor() { }

    public connect() {
        if (this.isConnected || this.client) return;

        this.client = new Client(
            MQTT_CONFIG.MQTT_HOST,
            MQTT_CONFIG.MQTT_PORT,
            "/mqtt",
            MQTT_CONFIG.CLIENT_ID
        );

        this.client.onConnectionLost = this.onConnectionLost.bind(this);
        this.client.onMessageArrived = this.onMessageArrived.bind(this);

        const options: any = {
            timeout: 3,
            onSuccess: this.onConnect.bind(this),
            onFailure: this.onFailure.bind(this),
            useSSL: MQTT_CONFIG.MQTT_PROTOCOL === "wss" || MQTT_CONFIG.MQTT_PROTOCOL === "https",
        };

        if (MQTT_CONFIG.MQTT_USERNAME) {
            options.userName = MQTT_CONFIG.MQTT_USERNAME;
            options.password = MQTT_CONFIG.MQTT_PASSWORD;
        }

        try {
            this.client.connect(options);
        } catch (e) {
            console.error("MQTT Connect Error", e);
            this.scheduleReconnect();
        }
    }

    public disconnect() {
        if (this.isConnected && this.client) {
            this.client.disconnect();
        }
        this.isConnected = false;
        this.client = null;
        this.notifyConnectionState(false);
    }

    public publishRequest(payload: AppRequestPayload) {
        if (!this.isConnected || !this.client) {
            console.warn("MQTT Cannot publish, disconnected.");
            return;
        }
        const msg = new Message(JSON.stringify(payload));
        msg.destinationName = MQTT_TOPICS.APP_TO_PI_REQUEST;
        msg.qos = 0;
        this.client.send(msg);
    }

    public subscribeToStatus(cb: StatusCallback) {
        this.statusCallbacks.push(cb);
        return () => {
            this.statusCallbacks = this.statusCallbacks.filter((c) => c !== cb);
        };
    }

    public subscribeToConnection(cb: ConnectionCallback) {
        this.connectionCallbacks.push(cb);
        cb(this.isConnected);
        return () => {
            this.connectionCallbacks = this.connectionCallbacks.filter(c => c !== cb);
        };
    }

    private onConnect() {
        console.log("MQTT Connected");
        this.isConnected = true;
        this.notifyConnectionState(true);

        // Subscribe to status on connect
        if (this.client) {
            this.client.subscribe(MQTT_TOPICS.PI_TO_APP_STATUS);
        }
    }

    private onFailure(responseObject: any) {
        console.error("MQTT Connection Failed", responseObject.errorMessage);
        this.isConnected = false;
        this.notifyConnectionState(false);
        this.client = null;
        this.scheduleReconnect();
    }

    private onConnectionLost(responseObject: any) {
        if (responseObject.errorCode !== 0) {
            console.error("MQTT Connection Lost:", responseObject.errorMessage);
        }
        this.isConnected = false;
        this.notifyConnectionState(false);
        this.client = null;
        this.scheduleReconnect();
    }

    private onMessageArrived(message: Message) {
        if (message.destinationName === MQTT_TOPICS.PI_TO_APP_STATUS) {
            try {
                const payload = JSON.parse(message.payloadString) as FanStatusPayload;
                this.statusCallbacks.forEach(cb => cb(payload));
            } catch (e) {
                console.error("Failed to parse status payload", e);
            }
        }
    }

    private scheduleReconnect() {
        setTimeout(() => {
            console.log("Attempting to reconnect MQTT...");
            this.connect();
        }, this.reconnectTimeout);
    }

    private notifyConnectionState(state: boolean) {
        this.connectionCallbacks.forEach(cb => cb(state));
    }
}

export const mqttClient = new MqttManager();
