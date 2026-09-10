"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface DeviceMapProps {
  lat: number;
  lng: number;
}

function MapUpdater({ lat, lng }: DeviceMapProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);

  return null;
}

const deviceIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DeviceMap({ lat, lng }: DeviceMapProps) {
  return (
    <div className="h-[350px] w-full overflow-hidden rounded-xl">
      <MapContainer
        center={[lat, lng]}
        zoom={17}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[lat, lng]} icon={deviceIcon}>
          <Popup>
            <div>
              <strong>TANIGA Device</strong>
              <br />
              Latitude: {lat.toFixed(6)}
              <br />
              Longitude: {lng.toFixed(6)}
            </div>
          </Popup>
        </Marker>

        <MapUpdater lat={lat} lng={lng} />
      </MapContainer>
    </div>
  );
}