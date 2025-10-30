"use client"
import MultiMarkerMap from "@/app/components/maps/MultiMarkerMapProps";
import { useState } from "react";



export default function DemoMapPage() {
 const [markers] = useState([
    {
      lat: 28.6139,
      lon: 77.209,
      label: "Delhi",
      status: "approved",
      submissionId: "SUB-101",
    },
    {
      lat: 19.076,
      lon: 72.8777,
      label: "Mumbai",
      status: "pending",
      submissionId: "SUB-102",
    },
    {
      lat: 13.0827,
      lon: 80.2707,
      label: "Chennai",
      status: "rejected",
      submissionId: "SUB-103",
    },
    {
      lat: 26.9124,
      lon: 75.7873,
      label: "Jaipur",
      status: "in progress",
      submissionId: "SUB-104",
    },
  ]); 
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <h2 className="text-3xl font-bold mb-10">Click Markers For Details</h2>
      <MultiMarkerMap markers={markers} />
    </div>
  );
}
