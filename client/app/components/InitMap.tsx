"use client";

import React, { useEffect, useRef, useState } from "react";

// Delay loading of Leaflet until useEffect (client-side only)
let L: typeof import("leaflet");

interface MapPickerProps {
  setLocation: (data: { lat: number; lon: number; address: string }) => void;
}

const MapPicker: React.FC<MapPickerProps> = ({ setLocation }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      const leaflet = await import("leaflet");
      //@ts-ignore
      await import("leaflet/dist/leaflet.css");

      // Fix marker icon path
      const markerIcon2x = await import("leaflet/dist/images/marker-icon-2x.png");
      const markerIcon = await import("leaflet/dist/images/marker-icon.png");
      const markerShadow = await import("leaflet/dist/images/marker-shadow.png");

      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x.default,
        iconUrl: markerIcon.default,
        shadowUrl: markerShadow.default,
      });

      L = leaflet;

      // Create the map
      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([22.9734, 78.6569], 4);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current);

        mapRef.current.on("click", async (e: any) => {
          const lat = e.latlng.lat;
          const lon = e.latlng.lng;

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lon]);
          } else {
            markerRef.current = L.marker([lat, lon]).addTo(mapRef.current!);
          }

          try {
            const response = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
            const data = await response.json();
            const address = data.display_name || "Address not found";
            setLocation({ lat, lon, address });
          } catch (err) {
            console.error("Reverse geocoding error:", err);
            setLocation({ lat, lon, address: "Error retrieving address" });
          }
        });

        setIsReady(true);
      }
    };

    init();

    return () => {
      mapRef.current?.remove();
    };
  }, [setLocation]);

  return (
    <div>
      {!isReady && <p>Loading map...</p>}
      <div ref={mapContainerRef} style={{ height: "300px", width: "100%" }} />
    </div>
  );
};

export default MapPicker;
