export interface Telemetry {
  deviceId: string;
  temp: number | null;
  lat: number | null;
  lng: number | null;
  battery: number | null;
  timestamp: string;
}

export interface LatestTelemetry extends Telemetry {
  key: string;
}