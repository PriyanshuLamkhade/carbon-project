"use client";

import React, { useEffect, useRef, useState } from "react";

// Delay Leaflet load until client
let L: typeof import("leaflet");

interface MarkerData {
  lat: number;
  lon: number;
  label?: string;
  status: "APPROVED" | "PENDING" | "REJECTED" | "INPROGRESS" | string;
  submissionId?: number;
}

interface MultiMarkerMapProps {
  markers: MarkerData[];
}

const MultiMarkerMap: React.FC<MultiMarkerMapProps> = ({ markers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRefs = useRef<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Color mapping for statuses (using colored marker icons)
  const getMarkerIcon = (status?: string) => {
    const color = (() => {
      switch (status?.toLowerCase()) {
        case "approved":
          return "green";
        case "pending":
          return "orange";
        case "rejected":
          return "red";
        case "inprogress":
          return "blue";
        default:
          return "gray";
      }
    })();

    return L.icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

  useEffect(() => {
    const init = async () => {
      const leaflet = await import("leaflet");
      //@ts-ignore
      await import("leaflet/dist/leaflet.css");

      L = leaflet;

      if (mapContainerRef.current && !mapRef.current) {
        mapRef.current = L.map(mapContainerRef.current).setView([20.5937, 78.9629], 4);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current);
      }

      setIsReady(true);
    };

    init();

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !mapRef.current) return;

    // Clear previous markers
    markerRefs.current.forEach((marker) => mapRef.current.removeLayer(marker));
    markerRefs.current = [];

    if (markers.length === 0) return;

    const bounds = L.latLngBounds([]);

    markers.forEach((m) => {
      const icon = getMarkerIcon(m.status);

      const marker = L.marker([m.lat, m.lon], { icon })
        .addTo(mapRef.current)
        .bindPopup(
          `
            <div style="font-size:14px; line-height:1.4;">
              <b>${m.label || "Location"}</b><br/>
              <small><b>Submission ID:</b> ${m.submissionId || "N/A"}</small><br/>
              <span style="color:${icon.options.iconUrl.includes("green") ? "green" :
                icon.options.iconUrl.includes("orange") ? "orange" :
                icon.options.iconUrl.includes("red") ? "red" :
                icon.options.iconUrl.includes("blue") ? "blue" : "gray"
              }; font-weight:600; text-transform:capitalize;">
                ${m.status || "unknown"}
              </span><br/>
              <small>Lat: ${m.lat.toFixed(4)}, Lon: ${m.lon.toFixed(4)}</small>
            </div>
          `
        );

      markerRefs.current.push(marker);
      bounds.extend([m.lat, m.lon]);
    });

    // Fit to all markers
    if (markers.length > 1) {
      mapRef.current.fitBounds(bounds, { padding: [30, 30] });
    } else {
      mapRef.current.setView([markers[0].lat, markers[0].lon], 10);
    }
  }, [markers, isReady]);

  return (
    <div>
      {!isReady && <p>Loading map...</p>}
      <div ref={mapContainerRef} style={{ height: "600px", width: "100%" }} />
    </div>
  );
};

export default MultiMarkerMap;
