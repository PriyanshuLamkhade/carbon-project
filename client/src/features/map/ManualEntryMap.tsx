"use client";

import Button from "@/components/ui/Button";
import { Plus, Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

let L: typeof import("leaflet");

interface ManualPolygonMapProps {
  setBoundary?: (data: {
    type: string;
    coordinates: number[][][];
    area: number;
    centerLat: number;
    centerLng: number;
  }) => void;
}

const ManualPolygonMap: React.FC<ManualPolygonMapProps> = ({ setBoundary }) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const polygonRef = useRef<any>(null);

  const [points, setPoints] = useState<{ lat: string; lng: string }[]>([
    { lat: "", lng: "" },
  ]);

  const [area, setArea] = useState<number>(0);

  // ✅ INIT MAP (only once)
  useEffect(() => {
    const init = async () => {
      if (mapRef.current) return;

      const leaflet = await import("leaflet");
      await import("leaflet/dist/leaflet.css");

      if (mapContainerRef.current) {
        (mapContainerRef.current as any)._leaflet_id = null; // ✅ FIX
      }

      const markerIcon2x =
        await import("leaflet/dist/images/marker-icon-2x.png");
      const markerIcon = await import("leaflet/dist/images/marker-icon.png");
      const markerShadow =
        await import("leaflet/dist/images/marker-shadow.png");

      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x.default,
        iconUrl: markerIcon.default,
        shadowUrl: markerShadow.default,
      });

      L = leaflet;

      mapRef.current = L.map(mapContainerRef.current!).setView(
        [22.9734, 78.6569],
        4,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ✅ DRAW POLYGON ON BUTTON CLICK
  const handleDrawPolygon = async () => {
    if (!mapRef.current) return;

    const latlngs: [number, number][] = points
      .map((p) => [parseFloat(p.lat), parseFloat(p.lng)] as [number, number])
      .filter(
        ([lat, lng]) =>
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180,
      );

    if (latlngs.length < 3) {
      alert("Please enter at least 3 valid points");
      return;
    }

    // Remove old polygon
    if (polygonRef.current) {
      mapRef.current.removeLayer(polygonRef.current);
    }

    const polygon = L.polygon(latlngs, {
      color: "#22c55e",
      fillColor: "#22c55e",
      fillOpacity: 0.3,
    }).addTo(mapRef.current);

    polygonRef.current = polygon;

    mapRef.current.fitBounds(polygon.getBounds());

    // 🔹 PROCESS BOUNDARY
    const coordinates: [number, number][] = latlngs.map(([lat, lng]) => [
      lng,
      lat,
    ]);
    coordinates.push(coordinates[0]);

    const turf = await import("@turf/turf");

    const turfPolygon = turf.polygon([coordinates]);
    const areaMeters = turf.area(turfPolygon);
    const areaHectares = areaMeters / 10000;

    const center = turf.centroid(turfPolygon);
    const [centerLng, centerLat] = center.geometry.coordinates;

    const finalArea = parseFloat(areaHectares.toFixed(2));
    setArea(finalArea);

    setBoundary?.({
      type: "Polygon",
      coordinates: [coordinates],
      area: finalArea,
      centerLat,
      centerLng,
    });
  };

  // ✅ HANDLERS
  const updatePoint = (index: number, field: "lat" | "lng", value: string) => {
    const updated = [...points];
    updated[index][field] = value;
    setPoints(updated);
  };

  const addPoint = () => {
    setPoints([...points, { lat: "", lng: "" }]);
  };

  const removePoint = (index: number) => {
    const updated = points.filter((_, i) => i !== index);
    setPoints(updated);
  };

  return (
    <div className="space-y-4">
      {/* INPUTS */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2">📍 Enter Coordinates</h3>

        {points.map((point, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              placeholder="Latitude"
              value={point.lat}
              onChange={(e) => updatePoint(index, "lat", e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={point.lng}
              onChange={(e) => updatePoint(index, "lng", e.target.value)}
              className="border p-2 rounded w-full"
            />

            {points.length > 1 && (
              <button
                onClick={() => removePoint(index)}
                className="bg-red-400 text-white px-2 rounded cursor-pointer hover:bg-red-600"
              >
                <Trash2/>
              </button>
            )}
          </div>
        ))}

        <Button
          size="md"
          variant="secondary"
          text= "Add Point"
          onClick={addPoint}
          className="bg-green-500 text-white  "
        />
  
        {/* ✅ DRAW Button */}
        <Button
          size="md"
          variant="secondary"
          text="Draw Polygon"
          onClick={handleDrawPolygon}
          className="bg-blue-600 text-white   mt-3"
        />

        {area > 0 && (
          <div className="bg-green-100 p-3 rounded mt-3">
            <p className="font-bold text-green-800">✅ Polygon Created</p>
            <p className="text-sm text-green-700">Area: {area} hectares</p>
          </div>
        )}
      </div>

      {/* MAP */}
      <div
        ref={mapContainerRef}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-md border-2 border-gray-200"
      />
    </div>
  );
};

export default ManualPolygonMap;
