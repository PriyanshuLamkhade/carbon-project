"use client";

import { useEffect, useState } from "react";
import MultiMarkerMap from "../map/MultiMarkerMapProps";
import { authService } from "@/app/page";
type GeoTag = {
  type: "Polygon";
  coordinates: number[][][];
};
// Matches the backend data structure
interface MapData {
  latitude: number;
  longitude: number;
  label?: string;
  status: "PENDING" | "INPROGRESS" | "APPROVED" | "REJECTED";
  submissionId: number;
  geoTag?: GeoTag;
}

export default function ValidatorMap() {
  const [markerData, setMarkerData] = useState<any[]>([]);

  useEffect(() => {
    async function getUserSubmission() {
      const response = await fetch(`${authService}/validator/mapData`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data: MapData[] = await response.json();

        // ✅ Convert backend fields to match what MultiMarkerMap expects
        const markers = data.map((m) => ({
          lat: m.latitude,
          lon: m.longitude,
          label: m.label,
          status: m.status,
          submissionId: m.submissionId,
          geoTag: m.geoTag,
        }));

        setMarkerData(markers);
      } else {
        console.error("Failed to fetch user details", response.status);
      }
    }

    getUserSubmission();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10">Click Markers For Details</h2>
      <MultiMarkerMap markers={markerData} />
    </div>
  );
}
