"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/app/page";
import toast from "react-hot-toast";
import MultiMarkerMap from "@/features/map/MultiMarkerMapProps";


const SubmissionPreviewPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`${authService}/users/previewData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId: historyId }),
        credentials: "include",
      });

      const result = await res.json();

      if (res.ok) {
        setData(result);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-6">Loading submission...</div>;
  if (!data) return <div className="p-6 text-red-500">No data found</div>;

  const { submission } = data;

  const markers = [
    {
      lat: submission.latitude,
      lon: submission.longitude,
      label: submission.location,
      status: "PENDING", // or dynamic later
      submissionId: submission.submissionId,
      geoTag: submission.geoTag,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Submission Preview
        </h1>
        <p className="text-gray-500 text-sm">
          Review details before verification
        </p>
      </div>

      {/* 🔹 Map Section */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Project Location</h2>

        <MultiMarkerMap markers={markers} />
      </div>

      {/* 🔹 Basic Info */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Basic Information</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>Location:</strong> {submission.location}</p>
          <p><strong>Latitude:</strong> {submission.latitude}</p>
          <p><strong>Longitude:</strong> {submission.longitude}</p>
          <p><strong>Area Claimed:</strong> {submission.areaclaim}</p>
          <p><strong>Calculated Area:</strong> {submission.area}</p>
          <p><strong>Plantation Date:</strong> {submission.plantationDate}</p>
          <p><strong>MGNREGA Days:</strong> {submission.MGNREGAPersonDays}</p>
          <p>
            <strong>Community Level:</strong>{" "}
            {submission.CommunityInvolvementLevel}
          </p>
        </div>
      </div>

      {/* 🔹 Plantation Details */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">Plantation Details</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <strong>Species 1:</strong>{" "}
            {submission.species1} ({submission.species1_count})
          </p>
          <p>
            <strong>Species 2:</strong>{" "}
            {submission.species2 || "-"} ({submission.species2_count || 0})
          </p>
          <p>
            <strong>Species 3:</strong>{" "}
            {submission.species3 || "-"} ({submission.species3_count || 0})
          </p>
        </div>

        <div className="mt-4">
          <p><strong>Description:</strong></p>
          <p className="text-gray-600 mt-1">
            {submission.description || "No description"}
          </p>
        </div>
      </div>

      {/* 🔹 Geo JSON (optional debug view) */}
      {submission.geoTag && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-semibold mb-4">Geo Boundary Data</h2>
          <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">
            {JSON.stringify(submission.geoTag, null, 2)}
          </pre>
        </div>
      )}

      {/* 🔹 Next Button */}
      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/validator/verify/${id}?historyId=${historyId}`)}
          className="px-6 py-3 bg-green-500 text-white rounded-2xl font-semibold cursor-pointer hover:bg-green-600"
        >
          Proceed to Verification →
        </button>
      </div>
    </div>
  );
};

export default SubmissionPreviewPage;