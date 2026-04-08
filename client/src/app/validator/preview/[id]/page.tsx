"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { authService } from "@/app/page";

export default function PreviewPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`${authService}/validator/submission/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return (
    <div className="text-white p-6 space-y-6 bg-gray-600">
      <h1 className="text-3xl font-bold">Submission Details</h1>

      {/* 📍 LOCATION */}
      <div className="bg-[#1e293b] p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">📍 Location</h2>
        <p>{data.location}</p>
        <p className="text-gray-400">
          Lat: {data.latitude} | Lng: {data.longitude}
        </p>
      </div>

      {/* 🌳 PLANTATION */}
      <div className="bg-[#1e293b] p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">🌳 Plantation Details</h2>

        <p>Area Claimed: {data.areaclaim} ha</p>
        <p>Area (map): {data.area || "N/A"} ha</p>

        <div className="mt-2 space-y-1">
          <p>🌱 {data.species1} — {data.species1_count}</p>
          {data.species2 && <p>🌱 {data.species2} — {data.species2_count}</p>}
          {data.species3 && <p>🌱 {data.species3} — {data.species3_count}</p>}
        </div>
      </div>

      {/* 📅 INFO */}
      <div className="bg-[#1e293b] p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">📅 Information</h2>

        <p>Plantation Date: {data.plantationDate}</p>
        <p>MGNREGA Days: {data.MGNREGAPersonDays}</p>
        <p>Community Level: {data.CommunityInvolvementLevel}</p>
        <p>Trained: {data.trained}</p>
      </div>

      {/* 📊 STATUS */}
      <div className="bg-[#1e293b] p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-2">📊 Status</h2>
        <p>Status: {data.history?.status}</p>
      </div>

      {/* 📸 IMAGES (if later added) */}
      {data.images && (
        <div className="bg-[#1e293b] p-5 rounded-xl">
          <h2 className="text-xl font-semibold mb-2">📸 Images</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.images.map((img: any, i: number) => (
              <img key={i} src={img.url} className="rounded-lg" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}