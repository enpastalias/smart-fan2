# Smart Fan - React Native Client

This is a centralized Smart Fan IoT system companion app built with React Native (Expo) and TS.

## Architecture & Requirements
- **Role:** The app acts purely as a remote control and status viewer.
- **Protocol:** It communicates using **MQTT over WebSockets**.
- **No Local Logic:** All fan algorithms, speed logic and target tracking are handled strictly by the Raspberry Pi backend.

## 1. Setup & Installation

Install dependencies:
```bash
cd smart-fan-client
npm install
```

## 2. Configuration & IP Setup

The Raspberry Pi IP address may change as it is connected to a hotspot.
You must update the IP address inside the configuration file before running the application:

1. Open `src/config/mqttConfig.ts`
2. Change the `MQTT_HOST` value to your Raspberry Pi's current IP.
   ```typescript
   export const MQTT_CONFIG = {
     MQTT_HOST: "192.168.43.50", // <-- Change to your Pi IP
     MQTT_PORT: 9001,
     MQTT_PROTOCOL: "ws",
     // ...
   };
   ```

## 3. Running the App

Start the Expo development server:
```bash
npm start
```
From there, scan the QR code with the **Expo Go** application on your physical iOS or Android device. Both devices must be on the same WiFi/hotspot network.

## 4. Raspberry Pi (Mosquitto) Configuration

The Pi must expose an MQTT WebSocket listener. Standard MQTT TCP (port 1883) won't work in a React Native / Web environment directly without bridging.

Modify your Mosquitto configuration file (commonly `/etc/mosquitto/mosquitto.conf` or `/etc/mosquitto/conf.d/default.conf`):

```conf
# Standard MQTT Listener for ESP32 and Node-RED
listener 1883
protocol mqtt
allow_anonymous true

# WebSocket Listener for React Native App
listener 9001
protocol websockets
allow_anonymous true
```

Restart Mosquitto on the Pi:
```bash
sudo systemctl restart mosquitto
```

## 5. MQTT Topics

The application communicates exclusively via these two topics:

* `fan/app/request` (App to Pi)
* `fan/app/status` (Pi to App)

## 6. Example MQTT Messages / Testing

You can use a tool like MQTT Explorer or Mosquitto CLI on your computer to test the connection and mock the Pi's server output.

### Mock Server Status (Send this from your computer to the APP)

**Topic:** `fan/app/status`
**Payload:**
```json
{
  "mode": "auto",
  "fanSpeed": 180,
  "servoAngle": 105,
  "targetDetected": true,
  "distanceCm": 180.5,
  "radarX": -250,
  "radarY": 1750,
  "esp32Connected": true,
  "timestamp": 1750000000
}
```
The app UI should immediately update to reflect this.

### Expected App Requests (App sends these to Pi)

When modifying manual mode, the app publishes:
**Topic:** `fan/app/request`

**Set Fan Speed to 128:**
```json
{
  "type": "set_speed",
  "speed": 128
}
```

**Set Mode to Manual:**
```json
{
  "type": "set_mode",
  "mode": "manual"
}
```

## Assumptions Made
1. `paho-mqtt` is used as standard React Native WebSocket supports pure WS easily with Paho. 
2. Security context (Usernames, Passwords, SSL/TLS) is disabled by default for simplicity, consistent with a college/university IoT setup. If authentication is needed, provide them in `mqttConfig.ts`.
