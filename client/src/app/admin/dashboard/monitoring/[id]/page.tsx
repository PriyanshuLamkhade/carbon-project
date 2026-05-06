"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MonitoringDetailPage() {
  const { id } = useParams();

  const [data, setData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);

  // 🔹 Fetch monitoring data
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `http://localhost:4000/admin/monitoring/${id}`,
        { credentials: "include" }
      );

      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [id]);

  if (!data) return <p className="text-white p-6">Loading...</p>;

  const monitoring = data.monitoring;
  const submission = data.submission;
  const user = data.user;

  // 🔥 Mint handler
  const handleMint = async () => {
    try {
      setLoadingMint(true);

      const res = await fetch(
        `http://localhost:4000/admin/monitoring/${id}/mint`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Mint failed");
        return;
      }

      alert(`✅ Minted ${result.tokens} tokens`);
      setShowConfirm(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoadingMint(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 space-y-6">

      {/* 🔹 PROJECT INFO */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Project Info</h1>

        <p><span className="text-gray-400">Location:</span> {submission.location}</p>
        <p><span className="text-gray-400">Area:</span> {submission.areaclaim}</p>
        <p><span className="text-gray-400">User:</span> {user?.name}</p>
      </div>

      {/* 🔹 MONITORING INPUTS */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Monitoring Inputs</h1>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>Survival Rate: {monitoring.survivalRate}%</p>
          <p>Avg Height: {monitoring.avgHeight}</p>
          <p>Health: {monitoring.plantationHealth}</p>
          <p>Water: {monitoring.waterCondition}</p>
          <p>Soil: {monitoring.soilQuality}</p>
          <p>Year: {monitoring.year}</p>
          <p>Remarks: {monitoring.remarks || "N/A"}</p>
        </div>
      </div>

      {/* 🔹 CARBON OUTPUT */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Carbon Output</h1>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>AGB: {monitoring.AGB}</p>
          <p>BGB: {monitoring.BGB}</p>
          <p>Soil Carbon: {monitoring.soilCarbon}</p>
          <p>Total Carbon: {monitoring.totalCarbon}</p>
          <p>Annual CO₂: {monitoring.annualCO2}</p>
        </div>
      </div>

      {/* 🔹 IMAGES */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Monitoring Images</h1>

        {monitoring.images && monitoring.images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {monitoring.images.map((img: any, index: number) => (
              <img
                key={index}
                src={img.url}
                onClick={() => setSelectedImage(img.url)}
                className="w-full h-40 object-cover rounded-lg cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No images available</p>
        )}
      </div>

      {/* 🔹 IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            className="max-h-[90%] max-w-[90%] rounded-lg"
          />
        </div>
      )}

      {/* 🔹 MINT SECTION */}
      {monitoring.tokensMinted ? (
        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded">
          Tokens Minted
        </span>
      ) : (
        <>
          <button
            onClick={() => setShowConfirm(true)}
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
          >
            Mint Yearly Tokens
          </button>

          {showConfirm && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-[#1e293b] p-6 rounded-xl w-[350px]">
                <h2 className="text-lg font-semibold mb-3">
                  Confirm Minting
                </h2>

                <p className="text-gray-300 text-sm mb-5">
                  This will mint tokens for this year's monitoring.
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-4 py-1.5 rounded bg-gray-600"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleMint}
                    disabled={loadingMint}
                    className="px-4 py-1.5 rounded bg-purple-600"
                  >
                    {loadingMint ? "Minting..." : "Confirm"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}