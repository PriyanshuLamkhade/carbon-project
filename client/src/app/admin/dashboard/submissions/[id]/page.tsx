"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function SubmissionDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingMint, setLoadingMint] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`http://localhost:4000/admin/submissions/${id}`, {
        credentials: "include",
      });

      const result = await res.json();
      setData(result);
    };

    fetchData();
  }, [id]);

  if (!data) return <p className="text-white p-6">Loading...</p>;

  const verification = data.history?.verification;
  const carbon = data.history?.carbon;
  const assignment = data.assignments?.[0];
  function calculateTokens(totalCarbon: number) {
    return Math.floor(totalCarbon); // simple version
  }
  const handleMint = async () => {
  try {
    setLoadingMint(true);

    const res = await fetch(
      `http://localhost:4000/admin/submissions/${id}/mint`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Mint failed");
      return;
    }

    alert(`✅ Minted ${data.tokens} tokens`);
    
    setShowConfirm(false);

  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  } finally {
    setLoadingMint(false);
  }
};
  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 space-y-6 -m-5">
      {/* 🔹 SUBMISSION INFO */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Submission Info</h1>

        <p>
          <span className="text-gray-400">Location:</span> {data.location}
        </p>
        <p>
          <span className="text-gray-400">Area Claimed:</span> {data.areaclaim}
        </p>
        <p>
          <span className="text-gray-400">Plantation Date:</span>{" "}
          {data.plantationDate}
        </p>

        <p className="mt-3 font-semibold">Species:</p>
        <p>
          {data.species1} ({data.species1_count})
        </p>
        {data.species2 && (
          <p>
            {data.species2} ({data.species2_count})
          </p>
        )}
        {data.species3 && (
          <p>
            {data.species3} ({data.species3_count})
          </p>
        )}
      </div>

      {/* 🔹 VALIDATOR */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Validator Assignment</h1>

        {assignment ? (
          <>
            <p>
              <span className="text-gray-400">Validator:</span>{" "}
              {assignment.validator?.user?.name}
            </p>

            <p>
              <span className="text-gray-400">Status:</span> {assignment.status}
            </p>

            <p>
              <span className="text-gray-400">Deadline:</span>{" "}
              {new Date(assignment.deadline).toLocaleDateString()}
            </p>
          </>
        ) : (
          <p className="text-gray-400">No validator assigned</p>
        )}
      </div>

      {/* 🔹 VERIFICATION */}
      <div className="bg-[#1e293b] p-6 rounded-xl space-y-6">
        <h1 className="text-xl font-bold">Verification Details</h1>

        {verification ? (
          <>
            {/* 🔹 DECISION */}
            <div>
              <span className="text-gray-400">Decision: </span>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  verification.decision === "APPROVED"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {verification.decision}
              </span>
            </div>

            {/* 🔹 SECTION A */}
            <div>
              <h2 className="font-semibold mb-2">Section A - Verification</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p>Location: {verification.location}</p>
                <p>Actual Area: {verification.actualArea}</p>
                <p>Boundary Match: {verification.boundaryMatch}</p>
                <p>Density: {verification.density}</p>
                <p>Soil Condition: {verification.soilCondition}</p>
                <p>Illegal Activity: {verification.illegalActivity}</p>
                <p>Pollution: {verification.pollution}</p>
                <p>Confidence: {verification.confidence}</p>
                <p>Score: {verification.score}</p>
                <p>Remarks: {verification.remarks || "N/A"}</p>
              </div>
            </div>

            {/* 🔹 SECTION B */}
            <div>
              <h2 className="font-semibold mb-2">Section B - Inputs</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p>Survival Rate: {verification.survivalRate}%</p>
                <p>Avg Height: {verification.avgHeight}</p>
                <p>Plantation Health: {verification.plantationHealth}</p>
                <p>Water Condition: {verification.waterCondition}</p>
                <p>Soil Quality: {verification.soilQuality}</p>
                <p>Planting Method: {verification.plantingMethod}</p>
                <p>Mortality Cause: {verification.mortalityCause || "N/A"}</p>
              </div>
            </div>

            {/* 🔹 SECTION C */}
            <div>
              <h2 className="font-semibold mb-2">Section C - Carbon Output</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <p>AGB: {verification.AGB}</p>
                <p>BGB: {verification.BGB}</p>
                <p>Soil Carbon: {verification.soilCarbon}</p>
                <p>Total Carbon: {verification.totalCarbon}</p>
                <p>Annual CO₂: {verification.annualCO2}</p>
              </div>
            </div>

            {/* 🔹 IMAGES */}
            <div>
              <h2 className="font-semibold mb-3">Verification Images</h2>

              {verification.images && verification.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {verification.images.map(
                    (
                      img: { url: string; public_id: string },
                      index: number,
                    ) => (
                      <img
                        key={img.public_id || index}
                        src={img.url}
                        alt="verification"
                        onClick={() => setSelectedImage(img.url)}
                        className="w-full h-40 object-cover rounded-lg border border-gray-600 cursor-pointer hover:scale-105 transition"
                      />
                    ),
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No images available</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-400">Not yet verified</p>
        )}
      </div>

      {/* 🔹 CARBON DATA */}
      <div className="bg-[#1e293b] p-6 rounded-xl">
        <h1 className="text-xl font-bold mb-4">Carbon Output</h1>

        {carbon ? (
          <>
            <p>AGB: {carbon.AGB}</p>
            <p>BGB: {carbon.BGB}</p>
            <p>Soil Carbon: {carbon.soilCarbon}</p>
            <p>Total Carbon: {carbon.totalCarbon}</p>
            <p>Annual CO₂: {carbon.annualCO2}</p>
          </>
        ) : (
          <p className="text-gray-400">No carbon data available</p>
        )}
      </div>
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
      {data.history?.carbon?.tokensIssued ? (
  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded">
    Tokens Minted
  </span>
) : (
  <>
    <button
      onClick={() => setShowConfirm(true)}
      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded mt-4"
    >
      Mint Tokens
    </button>

    {showConfirm && (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-[#1e293b] p-6 rounded-xl w-[350px] shadow-lg">
          <h2 className="text-lg font-semibold mb-3 text-white">
            Confirm Minting
          </h2>

          <p className="text-gray-300 text-sm mb-5">
            This will mint tokens based on verified carbon data. This action
            cannot be undone.
          </p>

          <div className="flex justify-end gap-3">
            {/* Cancel */}
            <button
              onClick={() => setShowConfirm(false)}
              className="px-4 py-1.5 rounded bg-gray-600 hover:bg-gray-700"
            >
              Cancel
            </button>

            {/* Confirm */}
            <button
              onClick={handleMint}
              disabled={loadingMint}
              className="px-4 py-1.5 rounded bg-purple-600 hover:bg-purple-700"
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
