"use client";

import React, { useEffect, useRef, useState } from "react";

// Delay loading of Leaflet until useEffect (client-side only)
let L: typeof import("leaflet");

interface MapPickerProps {
  mode?: "point" | "boundary"; // New prop to switch modes
  setLocation?: (data: { lat: number; lon: number; address: string }) => void;
  setBoundary?: (data: {
    type: string;
    coordinates: number[][];
    area: number;
    centerLat: number;
    centerLng: number;
    address: string;
  }) => void;
  initialBoundary?: any; // For editing existing boundary
}

const MapPicker: React.FC<MapPickerProps> = ({
  mode = "point",
  setLocation,
  setBoundary,
  initialBoundary,
}) => {
  const drawnItemsRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const polygonRef = useRef<any>(null);
  const drawControlRef = useRef<any>(null);
  const [isReady, setIsReady] = useState(false);
  const [area, setArea] = useState<number>(0);
  const [drawingMode, setDrawingMode] = useState<"view" | "draw" | "edit">("view");

  useEffect(() => {
    const init = async () => {
      const leaflet = await import("leaflet");
      //@ts-ignore
      await import("leaflet/dist/leaflet.css");
      
      // Import Leaflet Draw for boundary mode
      if (mode === "boundary") {
        await import("leaflet-draw");
        //@ts-ignore
        await import("leaflet-draw/dist/leaflet.draw.css");
      }

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
        mapRef.current = L.map(mapContainerRef.current).setView(
          [22.9734, 78.6569],
          4
        );
        
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(mapRef.current);

        if (mode === "point") {
          // Point selection mode (your original)
          mapRef.current.on("click", async (e: any) => {
            const lat = e.latlng.lat;
            const lon = e.latlng.lng;

            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lon]);
            } else {
              markerRef.current = L.marker([lat, lon]).addTo(mapRef.current!);
            }

            try {
              const response = await fetch(
                `/api/reverse-geocode?lat=${lat}&lon=${lon}`
              );
              const data = await response.json();
              const address = data.display_name || "Address not found";
              setLocation?.({ lat, lon, address });
            } catch (err) {
              console.error("Reverse geocoding error:", err);
              setLocation?.({ lat, lon, address: "Error retrieving address" });
            }
          });
        } else {
          // Boundary drawing mode
          if (!drawnItemsRef.current) {
  drawnItemsRef.current = new L.FeatureGroup();
  mapRef.current.addLayer(drawnItemsRef.current);
}
          // Add draw control
          const drawControl = new (L.Control as any).Draw({
            draw: {
              polygon: {
                allowIntersection: false,
                shapeOptions: {
                  color: "#22c55e",
                  fillColor: "#22c55e",
                  fillOpacity: 0.3,
                },
              },
              polyline: false,
              rectangle: false,
              circle: false,
              marker: false,
              circlemarker: false,
            },
            edit: {
              featureGroup: drawnItemsRef.current,
              edit: true,
              remove: true,
            },
          });

          mapRef.current.addControl(drawControl);
          drawControlRef.current = drawControl;

          // Handle polygon creation
          mapRef.current.on("draw:created", async (e: any) => {
            const layer = e.layer;
            drawnItemsRef.current.clearLayers();
drawnItemsRef.current.addLayer(layer);
            polygonRef.current = layer;

            await processBoundary(layer);
          });

          // Handle polygon edit
          mapRef.current.on("draw:edited", async (e: any) => {
            const layers = e.layers;
            layers.eachLayer(async (layer: any) => {
              await processBoundary(layer);
            });
          });

          // Load initial boundary if provided
          if (initialBoundary) {
            const coords = initialBoundary.coordinates.map((coord: number[]) => [
              coord[1],
              coord[0],
            ]);
            const polygon = L.polygon(coords, {
              color: "#22c55e",
              fillColor: "#22c55e",
              fillOpacity: 0.3,
            });
            drawnItemsRef.current.addLayer(polygon);
            polygonRef.current = polygon;
            mapRef.current.fitBounds(polygon.getBounds());
          }
        }

        setIsReady(true);
      }
    };

    const processBoundary = async (layer: any) => {
      const latlngs = layer.getLatLngs()[0];
      
      // Convert to [lng, lat] format for GeoJSON
      const coordinates = latlngs.map((latlng: any) => [
        latlng.lng,
        latlng.lat,
      ]);
      
      // Close the polygon
      coordinates.push(coordinates[0]);

      // Calculate area using Turf.js
      const turf = await import("@turf/turf");
      const polygon = turf.polygon([coordinates]);
      const areaInMeters = turf.area(polygon);
      const areaInHectares = (areaInMeters / 10000).toFixed(2);
      
      // Get center point
      const center = turf.centroid(polygon);
      const [centerLng, centerLat] = center.geometry.coordinates;

      setArea(parseFloat(areaInHectares));

      // Get address for center point
      try {
        const response = await fetch(
          `/api/reverse-geocode?lat=${centerLat}&lon=${centerLng}`
        );
        const data = await response.json();
        const address = data.display_name || "Address not found";

        setBoundary?.({
          type: "Polygon",
          coordinates: [coordinates],
          area: parseFloat(areaInHectares),
          centerLat,
          centerLng,
          address,
        });
      } catch (err) {
        console.error("Reverse geocoding error:", err);
        setBoundary?.({
          type: "Polygon",
          coordinates: [coordinates],
          area: parseFloat(areaInHectares),
          centerLat,
          centerLng,
          address: "Error retrieving address",
        });
      }
    };

    init();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [mode, setLocation, setBoundary, initialBoundary]);

  return (
    <div className="space-y-4">
      
      
      {mode === "boundary" && isReady && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold mb-2">📍 Draw Land Boundary</h3>
          <ol className="text-sm space-y-1 mb-3">
            <li>1. Click the polygon tool (⬡) on the map</li>
            <li>2. Click points around your land boundary</li>
            <li>3. Double-click to complete the polygon</li>
            <li>4. Use edit tool (✏️) to adjust if needed</li>
          </ol>
          {area > 0 && (
            <div className="bg-green-100 p-3 rounded">
              <p className="font-bold text-green-800">✅ Boundary Drawn!</p>
              <p className="text-sm text-green-700">Area: {area} hectares</p>
            </div>
          )}
        </div>
      )}

      {mode === "point" && isReady && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm">📍 Click anywhere on the map to select location</p>
        </div>
      )}
      
      <div
        ref={mapContainerRef}
        style={{ height: "400px", width: "100%" }}
        className="rounded-lg shadow-md border-2 border-gray-200"
      />
    </div>
  );
};

export default MapPicker;