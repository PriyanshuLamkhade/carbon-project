"use client";

import { authService } from "@/app/page";
import MultiMarkerMap from "@/features/map/MultiMarkerMapProps";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SubmissionDetailsPage() {
  const { historyId } = useParams();

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`${authService}/users/submission/${historyId}`, {
        credentials: "include",
      });

      const result = await res.json();

      setData(result);
    };

    fetchDetails();
  }, []);

  if (!data) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading project details...
      </div>
    );
  }

  const { submission, verification, monitorings, carbon, status } = data;

  const markers = [
    {
      lat: submission?.latitude,
      lon: submission?.longitude,
      label: submission?.location,
      status,
      submissionId: submission?.submissionId,
      geoTag: submission?.geoTag,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 space-y-8 text-gray-800">
      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex justify-between flex-wrap gap-6">
          <div>
            <h1 className="text-5xl font-black">🌱 Project Lifecycle</h1>

            <p className="mt-4 text-lg opacity-90 max-w-2xl">
              Complete transparency and monitoring history of your blue carbon
              restoration project
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-6 min-w-[250px]">
            <p className="text-sm uppercase opacity-70">Current Status</p>

            <h2 className="text-4xl font-black mt-2">{status}</h2>

            <p className="mt-4 text-sm opacity-80">
              Submission ID #{submission?.submissionId}
            </p>
          </div>
        </div>
      </div>

      {/* 🗺 MAP */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-5">Project Location & Boundary</h2>

        <MultiMarkerMap markers={markers} />
      </div>

      {/* 🟢 USER SUBMISSION */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8">User Submission Data</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <p>
              <strong>Location:</strong> {submission?.location}
            </p>

            <p>
              <strong>Latitude:</strong> {submission?.latitude}
            </p>

            <p>
              <strong>Longitude:</strong> {submission?.longitude}
            </p>

            <p>
              <strong>Area Claimed:</strong> {submission?.areaclaim} ha
            </p>

            <p>
              <strong>Calculated Area:</strong> {submission?.area} ha
            </p>

            <p>
              <strong>Plantation Date:</strong> {submission?.plantationDate}
            </p>

            <p>
              <strong>Community Involvement:</strong>{" "}
              {submission?.CommunityInvolvementLevel}
            </p>

            <p>
              <strong>MGNREGA Person Days:</strong>{" "}
              {submission?.MGNREGAPersonDays}
            </p>

            <p>
              <strong>Trained:</strong> {submission?.trained}
            </p>
          </div>

          <div className="space-y-4">
            <p>
              <strong>Species 1:</strong> {submission?.species1} (
              {submission?.species1_count})
            </p>

            <p>
              <strong>Species 2:</strong> {submission?.species2 || "-"} (
              {submission?.species2_count || 0})
            </p>

            <p>
              <strong>Species 3:</strong> {submission?.species3 || "-"} (
              {submission?.species3_count || 0})
            </p>

            <div>
              <p className="font-semibold mb-2">Description</p>

              <div className="bg-gray-100 p-4 rounded-xl">
                {submission?.description || "No description"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔵 VERIFICATION */}
      {verification && (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-8">
            Validator Verification Report
          </h2>

          {/* 🟦 SECTION A */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-5 text-green-700">
              Section A — Field Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <p>
                <strong>Decision:</strong> {verification.decision}
              </p>

              <p>
                <strong>Location:</strong> {verification.location}
              </p>

              <p>
                <strong>Actual Area:</strong> {verification.actualArea} ha
              </p>

              <p>
                <strong>Boundary Match:</strong> {verification.boundaryMatch}
              </p>

              <p>
                <strong>Mangrove Density:</strong> {verification.density}
              </p>

              <p>
                <strong>Soil Condition:</strong> {verification.soilCondition}
              </p>

              <p>
                <strong>Illegal Activity:</strong>{" "}
                {verification.illegalActivity}
              </p>

              <p>
                <strong>Pollution:</strong> {verification.pollution}
              </p>

              <p>
                <strong>Confidence:</strong> {verification.confidence}
              </p>

              <p>
                <strong>Score:</strong> {verification.score}
              </p>

              <p>
                <strong>Verification Date:</strong>{" "}
                {new Date(verification.verificationDate).toLocaleDateString()}
              </p>

              <p>
                <strong>Validator:</strong> {verification.validator?.user?.name}
              </p>
            </div>

            <div className="mt-6">
              <p className="font-semibold mb-2">Validator Remarks</p>

              <div className="bg-gray-100 rounded-xl p-4">
                {verification.remarks || "No remarks"}
              </div>
            </div>
          </div>

          {/* 🟩 SECTION B */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-5 text-blue-700">
              Section B — Carbon Inputs
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <p>
                <strong>Survival Rate:</strong> {verification.survivalRate}%
              </p>

              <p>
                <strong>Average Height:</strong> {verification.avgHeight}
              </p>

              <p>
                <strong>Plantation Health:</strong>{" "}
                {verification.plantationHealth}
              </p>

              <p>
                <strong>Water Condition:</strong> {verification.waterCondition}
              </p>

              <p>
                <strong>Soil Quality:</strong> {verification.soilQuality}
              </p>

              <p>
                <strong>Planting Method:</strong> {verification.plantingMethod}
              </p>

              <p>
                <strong>Mortality Cause:</strong>{" "}
                {verification.mortalityCause || "-"}
              </p>
            </div>
          </div>

          {/* 🟨 SECTION C */}
          <div>
            <h3 className="text-2xl font-bold mb-5 text-purple-700">
              Section C — Carbon Output
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <p>
                <strong>AGB:</strong> {verification.AGB}
              </p>

              <p>
                <strong>BGB:</strong> {verification.BGB}
              </p>

              <p>
                <strong>Soil Carbon:</strong> {verification.soilCarbon}
              </p>

              <p>
                <strong>Total Carbon:</strong> {verification.totalCarbon}
              </p>

              <p>
                <strong>Annual CO₂:</strong> {verification.annualCO2}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 📸 VALIDATOR IMAGES */}
      {verification?.images?.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Validator Evidence Images</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {verification.images.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt="verification"
                className="rounded-2xl h-72 w-full object-cover shadow"
              />
            ))}
          </div>
        </div>
      )}

      {/* 🟣 MONITORING */}
      <div className="bg-white rounded-3xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-8">Yearly Monitoring Reports</h2>

        <div className="space-y-6">
          {monitorings.length > 0 ? (
            monitorings.map((m: any) => (
              <div
                key={m.monitoringId}
                className="border border-gray-200 rounded-2xl p-6 bg-gray-50"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-2xl font-bold">
                      Monitoring Year {m.year}
                    </h3>

                    <p className="text-gray-500">
                      {new Date(m.monitoredAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-black text-green-600">
                      {m.annualCO2}
                    </p>

                    <p className="text-sm text-gray-500">Annual CO₂</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <p>
                    <strong>Survival Rate:</strong> {m.survivalRate}%
                  </p>

                  <p>
                    <strong>Average Height:</strong> {m.avgHeight}
                  </p>

                  <p>
                    <strong>Plantation Health:</strong> {m.plantationHealth}
                  </p>

                  <p>
                    <strong>Water Condition:</strong> {m.waterCondition}
                  </p>

                  <p>
                    <strong>Soil Quality:</strong> {m.soilQuality}
                  </p>

                  <p>
                    <strong>AGB:</strong> {m.AGB}
                  </p>

                  <p>
                    <strong>BGB:</strong> {m.BGB}
                  </p>

                  <p>
                    <strong>Soil Carbon:</strong> {m.soilCarbon}
                  </p>

                  <p>
                    <strong>Total Carbon:</strong> {m.totalCarbon}
                  </p>
                </div>

                {/* 🪙 Monitoring Mint Info */}
                {m.tokensIssued && (
                  <div className="mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl p-5">
                    <div className="flex justify-between flex-wrap gap-6">
                      <div>
                        <p className="text-sm opacity-80">
                          Monitoring Tokens Issued
                        </p>

                        <h3 className="text-4xl font-black mt-2">
                          {m.tokensIssued}
                        </h3>
                      </div>

                      <div>
                        <p className="text-sm opacity-80">Minted At</p>

                        <h3 className="text-lg font-semibold mt-2">
                          {m.mintedAt
                            ? new Date(m.mintedAt).toLocaleDateString()
                            : "-"}
                        </h3>
                      </div>
                    </div>

                    {/* 🔗 TX HASH */}
                    <div className="mt-5">
                      <p className="text-sm opacity-80 mb-2">
                        Blockchain Transaction
                      </p>

                      <div className="bg-black/20 rounded-xl p-3 break-all text-sm">
                        {m.txHash || "Not minted"}
                      </div>

                      {m.txHash && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${m.txHash}`}
                          target="_blank"
                          className="inline-block mt-4 bg-white text-purple-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-100"
                        >
                          View on Sepolia ↗
                        </a>
                      )}
                    </div>

                    {/* ✅ VERIFIED BADGE */}
                    <div className="mt-5 flex items-center gap-2">
                      <div className="h-3 w-3 bg-green-400 rounded-full" />

                      <p className="font-semibold">
                        Blockchain Verified Monitoring
                      </p>
                    </div>
                  </div>
                )}
                {m.remarks && (
                  <div className="mt-6">
                    <p className="font-semibold mb-2">Monitoring Remarks</p>

                    <div className="bg-white p-4 rounded-xl">{m.remarks}</div>
                  </div>
                )}

                {/* 📸 Monitoring Images */}
                {m.images?.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold mb-4">
                      Monitoring Images
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {m.images.map((img: string, idx: number) => (
                        <img
                          key={idx}
                          src={img}
                          alt="monitoring"
                          className="rounded-2xl h-64 w-full object-cover"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400">No monitoring reports available yet</p>
          )}
        </div>
      </div>

      {/* 🪙 BLOCKCHAIN */}
      {carbon && (
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Blockchain Minting Data</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <p>
              <strong>Carbon Cleaned:</strong> {carbon.carbonCleaned}
            </p>

            <p>
              <strong>Tokens Issued:</strong> {carbon.tokensIssued}
            </p>

            <p className="break-all md:col-span-2">
              <strong>Transaction Hash:</strong>{" "}
              {carbon.txHash || "Not minted yet"}
            </p>

            <p>
              <strong>Minted At:</strong>{" "}
              {carbon.createdAt
                ? new Date(carbon.createdAt).toLocaleString()
                : "-"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
