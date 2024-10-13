import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Example metro stations data with coordinates
const metroStations = [
  { name: "Dwarka Sector 21", coordinates: [28.5623, 77.0622] },
  { name: "Rajiv Chowk", coordinates: [28.6329, 77.2176] },
  { name: "Karol Bagh", coordinates: [28.6506, 77.1925] },
  { name: "Shadipur", coordinates: [28.6537, 77.1594] },
  // More stations can be added here
];

export const MapComponent:React.FC = () => {
  // Define the polyline that connects the stations
  const polylineCoordinates = metroStations.map(station => station.coordinates);

  return (
    <MapContainer center={[28.6139, 77.209]} zoom={12} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      
      {/* Place markers for each metro station */}
      {metroStations.map((station, idx) => (
        <Marker key={idx} position={station.coordinates}>
          <Popup>{station.name}</Popup>
        </Marker>
      ))}

      {/* Polyline to connect the metro stations */}
      <Polyline positions={polylineCoordinates} color="red" />
    </MapContainer>
  );
};
