// src/LocationMarker.js
import React, { useState, useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Re-using the globally set DefaultIcon to render the marker
// We don't explicitly need L.Icon definition if App.js has the fix.

export function LocationMarker() {
  const [position, setPosition] = useState(null);
  const map = useMap(); // Accesses the Leaflet map instance

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Geolocation is not supported by your browser.");
      return;
    }

    // Use map.locate() to find the user's location
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng); 
      
      // *** CHANGE FOR MAGNIFICATION ***
      // map.flyTo moves the map view. Zoom level 18 is very close up/magnified.
      map.flyTo(e.latlng, 18); // <-- MAGNIFIED ZOOM LEVEL 
      
      console.log("Location found and map centered.");
    }).on("locationerror", function (e) {
      // Handles case where user denies permission
      alert(`Location access denied or unavailable. Please check your browser settings. Error: ${e.message}`);
      console.error(`Location access error: ${e.message}`);
    });
  }, [map]); 

  // Render the marker at the found position
  // It uses the DefaultIcon set in App.js
  return position === null ? null : (
    <Marker position={position}> 
      <Popup>Your Current, Exact Location</Popup>
    </Marker>
  );
}