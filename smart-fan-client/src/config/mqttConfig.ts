export const MQTT_CONFIG = {
  MQTT_HOST: "10.215.191.154", // Current Pi hotspot IP or local IP
  MQTT_PORT: 9001,
  MQTT_PROTOCOL: "ws",
  // If Mosquitto requires auth, add them here
  MQTT_USERNAME: "",
  MQTT_PASSWORD: "",
  CLIENT_ID: "SmartFanClient_" + Math.random().toString(16).substr(2, 8),
};
