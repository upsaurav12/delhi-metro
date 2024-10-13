import React, { useEffect, useState } from "react";
//import { MapComponent } from "../component/Map";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { stations } from "./stations";

interface StationData {
    latitude: string, 
    longitude: string,
    map_direction: string,
    station_name: string,
}[]

interface Location {
  lat: number;
  lon: number;
}

const changeColor = (key : string) => {
  const color = stations.find((i) => i.station === key)
  return color?.line
}
export const Delhi: React.FC = () => {
    //const polylineCoordinates = [[28.564011999999998 ,77.234245 ] , [28.555387399999997, 77.2419541] , [28.5705572, 77.2364498] , [28.568610999999997,77.220265]  ];
    const [stationData , setStationData] = useState<StationData[] | null>(null);
    const poly = stationData?.slice(5).map((i) => [parseFloat(i.latitude) , parseFloat(i.longitude)])
    console.log(poly)
    const [location , setLocation] = useState<Location| null>(null)
    const [error , setError] = useState<string | null>(null)
    const [loading , setLoading] = useState<boolean>(false);
    const defaultLocation: Location = { lat: 28.6139, lon: 77.209 };

    function roundCoordinate(coord: number, precision: number = 2): number {
      return parseFloat(coord.toFixed(precision));
  }

    const getUserLocation = async () => {
      try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(resolve, reject);
              } else {
                  reject(new Error("Geolocation is not supported by this browser."));
              }
          });
          const { latitude, longitude } = position.coords;
          setLocation({ lat: roundCoordinate(latitude), lon: roundCoordinate(longitude) }); // Save location in state
      } catch (error) {
          console.error("Error getting location:", error);
          setError("Unable to retrieve location.");
      }
  };
    const getNearestDelhi = async () => {

       if(!location) return ;

        let {lat , lon} = location

        lat = roundCoordinate(lat);
        lon = roundCoordinate(lon)
        const url = `https://nearest-delhi-metro-station.p.rapidapi.com/nearestmetro?lat=${lat}&long=${lon}`;
        const options = {
              method: 'GET',
              headers: {
                'x-rapidapi-key': '179b467eeamshed3de0f070afc29p1fc244jsn4f19ad1a4484',
                'x-rapidapi-host': 'nearest-delhi-metro-station.p.rapidapi.com'
              }
            };
            setLoading(true);
          try {
            const response = await fetch(url, options);
            const result = await response.json();
              setStationData(result.data)
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false)
          }
    }

    useEffect(() => {
      getUserLocation()
  },[])

    useEffect(() => {
      if(location){
        getNearestDelhi();
      }
    }, [location])


    if(loading) return <div>Loading.....</div>

    if(error) return <div>{error}</div>
    return (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
          {/* Station Data List */}
          <ul style={{ width: "40%", padding: "0 20px" }}>
              {stationData?.map((station, idx) => (
                  <li key={idx} style={{ marginBottom: "10px", listStyle: "none" }}>
                      <p>Latitude: {station.latitude}</p>
                      <p>Longitude: {station.longitude}</p>
                      <p>Direction: {station.map_direction}</p>
                      <p style={{ color: changeColor(station.station_name) }}>{station.station_name}</p>
                  </li>
              ))}
          </ul>

          {/* MapContainer */}
          <MapContainer
              center={location ? [location.lat, location.lon] : [defaultLocation.lat, defaultLocation.lon]}
              zoom={12}
              style={{ height: "600px", width: "50%" }}
          >
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
              />

              {/* User Location Marker */}
              {location && (
                  <Marker position={[location.lat, location.lon]}>
                      <Popup>Your Location</Popup>
                  </Marker>
              )}

              {/* Station Markers */}
              {stationData?.slice(5).map((station, idx) => {
                  const lat = parseFloat(station.latitude);
                  const lon = parseFloat(station.longitude);
                  return (
                      <Marker key={idx} position={[lat, lon]}>
                          <Popup>{station.station_name}</Popup>
                      </Marker>
                  );
              })}

              {/* Polyline for metro stations */}
              {poly && <Polyline positions={poly} color="red" />}
          </MapContainer>
      </div>
  );
}