export interface FanStatusPayload {
    mode: "auto" | "manual";
    fanSpeed: number; // 0-255
    servoAngle: number; // 0-180
    targetDetected: boolean;
    distanceCm?: number;
    radarX?: number;
    radarY?: number;
    esp32Connected: boolean;
    timestamp: number;
}

export type FanMode = "auto" | "manual";

export type SetModeRequest = {
    type: "set_mode";
    mode: FanMode;
};

export type SetSpeedRequest = {
    type: "set_speed";
    speed: number;
};

export type SetAngleRequest = {
    type: "set_angle";
    angle: number;
};

export type ManualControlRequest = {
    type: "manual_control";
    speed: number;
    angle: number;
};

export type AppRequestPayload =
    | SetModeRequest
    | SetSpeedRequest
    | SetAngleRequest
    | ManualControlRequest;
