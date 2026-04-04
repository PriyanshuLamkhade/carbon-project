"use client";

import { useState } from "react";

export default function VerificationForm1({ submission, onNext }: any) {
  // 📍 Haversine
  const getDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 🧠 STATE
  const [form, setForm] = useState({
    validatorLocation: "",
    actualArea: "",
    boundaryMatch: "",
    mangroveDensity: "",
    soilCondition: "",
    illegalActivity: "",
    pollution: "",
    confidence: "",
    remarks: "",
  });

  const [boundaryPoints, setBoundaryPoints] = useState([{ lat: "", lng: "" }]);
  const [score, setScore] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // 📍 Boundary center
  const getBoundaryCenter = () => {
    if (!boundaryPoints.length) return null;

    let latSum = 0;
    let lngSum = 0;

    boundaryPoints.forEach((p) => {
      latSum += parseFloat(p.lat || "0");
      lngSum += parseFloat(p.lng || "0");
    });

    return {
      lat: latSum / boundaryPoints.length,
      lng: lngSum / boundaryPoints.length,
    };
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPoint = () => {
    setBoundaryPoints([...boundaryPoints, { lat: "", lng: "" }]);
  };

  const updatePoint = (index: number, field: string, value: string) => {
    const updated: any = [...boundaryPoints];
    updated[index][field] = value;
    setBoundaryPoints(updated);
  };

  // ⚡ Auto-fill boundary
  const handleAutoFillBoundary = () => {
    if (submission.geoTag?.coordinates?.[0]) {
      const coords = submission.geoTag.coordinates[0];

      const formatted = coords.map((c: any) => ({
        lat: c[1].toString(),
        lng: c[0].toString(),
      }));

      setBoundaryPoints(formatted);
    }
  };

  // 🧮 Score
  const calculateScore = () => {
    let total = 0;
    console.log("FORM:", form);
    // Existing fields
    if (form.boundaryMatch?.trim() === "YES") total += 15;
    if (form.mangroveDensity === "DENSE") total += 20;
    if (form.soilCondition === "STABLE") total += 10;
    if (form.illegalActivity === "NO") total += 10;
    if (form.pollution === "NO") total += 10;
    if (form.confidence?.toUpperCase() === "HIGH") total += 10;

    // 📍 Location check
    const center = getBoundaryCenter();

    if (center && submission.latitude && submission.longitude) {
      const dist = getDistance(
        submission.latitude,
        submission.longitude,
        center.lat,
        center.lng,
      );

      if (dist < 0.1) total += 15;
      else if (dist < 0.5) total += 10;
      else if (dist < 1) total += 5;
      else total -= 10;
    }

    // 📏 Area check
    if (form.actualArea && submission.areaclaim) {
      const claimed = submission.areaclaim;
      const actual = parseFloat(form.actualArea);

      const diff = Math.abs(claimed - actual) / claimed;

      if (diff < 0.1) total += 15;
      else if (diff < 0.25) total += 10;
      else if (diff < 0.5) total += 5;
      else total -= 10;
    }

    setScore(total);
  };

  const getScoreColor = () => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const handleNext = () => {
    calculateScore();
    onNext({ form, boundaryPoints, score });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mangrove Verification</h1>

        <div>
          <span className="px-3 py-2 bg-blue-200 text-blue-700 rounded-full text-sm mx-2">
            In Progress
          </span>

          <button
            onClick={() => setShowPreview(true)}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm cursor-pointer hover:bg-gray-700"
          >
            View Submission
          </button>
        </div>
      </div>

      {/* 🟦 SUBMISSION CARD */}
      <div className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-2xl shadow-sm border">
        <h2 className="font-semibold text-lg mb-3">Submitted Data</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <p>
            <span className="text-gray-500">Location:</span>{" "}
            {submission.location}
          </p>
          <p>
            <span className="text-gray-500">Area:</span> {submission.areaclaim}{" "}
            ha
          </p>
          <p>
            <span className="text-gray-500">Species:</span>{" "}
            {submission.species1}
          </p>
          <p>
            <span className="text-gray-500">Plantation:</span>{" "}
            {submission.plantationDate}
          </p>
        </div>

        {submission.profileImage && (
          <img
            src={submission.profileImage}
            className="mt-4 rounded-xl h-48 w-full object-cover"
          />
        )}
      </div>

      {/* VERIFICATION */}
      <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
        <h2 className="font-semibold">Ground Verification</h2>

        <input
          name="validatorLocation"
          placeholder="Verified location"
          value={form.validatorLocation}
          onChange={handleChange}
          className="input w-full"
        />

        <input
          name="actualArea"
          placeholder="Actual Area (ha)"
          onChange={handleChange}
          className="input w-full"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            name="boundaryMatch"
            onChange={handleChange}
            className="input"
          >
            <option value="">Boundary Match</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          <select
            name="mangroveDensity"
            onChange={handleChange}
            className="input"
          >
            <option value="">Mangrove Density</option>
            <option value="DENSE">Dense</option>
            <option value="SPARSE">Sparse</option>
            <option value="NONE">None</option>
          </select>

          <select
            name="soilCondition"
            onChange={handleChange}
            className="input"
          >
            <option value="">Soil Condition</option>
            <option value="STABLE">Stable</option>
            <option value="ERODED">Eroded</option>
          </select>

          <select
            name="illegalActivity"
            onChange={handleChange}
            className="input"
          >
            <option value="">Illegal Activity</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          <select name="pollution" onChange={handleChange} className="input">
            <option value="">Pollution</option>
            <option value="YES">Yes</option>
            <option value="NO">No</option>
          </select>

          <select name="confidence" onChange={handleChange} className="input">
            <option value="">Confidence</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <textarea
          name="remarks"
          placeholder="Remarks"
          onChange={handleChange}
          className="input w-full h-24"
        />
      </div>

      {/* BOUNDARY */}
      <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
        <h2 className="font-semibold">Boundary Points</h2>

        {boundaryPoints.map((point, i) => (
          <div key={i} className="flex gap-2">
            <input
              placeholder={`Lat ${i + 1}`}
              value={point.lat}
              onChange={(e) => updatePoint(i, "lat", e.target.value)}
              className="input"
            />
            <input
              placeholder={`Lng ${i + 1}`}
              value={point.lng}
              onChange={(e) => updatePoint(i, "lng", e.target.value)}
              className="input"
            />
          </div>
        ))}
        <span className="flex justify-between">
          <button onClick={addPoint} className="text-blue-600 text-sm cursor-pointer">
            + Add point
          </button>

          <button
            onClick={handleAutoFillBoundary}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm cursor-pointer"
          >
            ⚡ Auto-fill Boundary
          </button>
        </span>
      </div>

      {/* SCORE */}
      <div className="bg-black text-white p-6 rounded-xl flex justify-between">
        <div>
          <p>Validation Score</p>
          <h2 className={`text-3xl ${getScoreColor()}`}>{score}%</h2>
        </div>

        <button
          onClick={calculateScore}
          className="bg-white text-black px-4 py-2 rounded hover:bg-gray-100 cursor-pointer"
        >
          Calculate
        </button>
      </div>

      {/* NEXT */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-green-600 text-white rounded-xl cursor-pointer hover:bg-green-700"
        >
          Proceed →
        </button>
      </div>

      <style jsx>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 10px;
          border-radius: 10px;
          width: 100%;
        }
      `}</style>

      {/* PREVIEW */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6 relative">
            {/* ❌ Close */}
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 text-gray-500 text-lg"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4">Submission Details</h2>

            {/* 📍 LOCATION */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">Location</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="text-gray-500">Address:</span>{" "}
                  {submission.location}
                </p>
                <p>
                  <span className="text-gray-500">Latitude:</span>{" "}
                  {submission.latitude}
                </p>
                <p>
                  <span className="text-gray-500">Longitude:</span>{" "}
                  {submission.longitude}
                </p>
                <p>
                  <span className="text-gray-500">Area (geo):</span>{" "}
                  {submission.area}
                </p>
              </div>
            </div>

            {/* 🌍 GEO JSON */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">
                Boundary (GeoJSON)
              </h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {JSON.stringify(submission.geoTag, null, 2)}
              </pre>
            </div>

            {/* 📏 AREA CLAIM */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">Area Claim</h3>
              <p className="text-sm">
                <span className="text-gray-500">Claimed Area:</span>{" "}
                {submission.areaclaim} ha
              </p>
            </div>

            {/* 🌱 SPECIES */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">
                Species Details
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  {submission.species1} ({submission.species1_count})
                </p>
                <p>
                  {submission.species2 || "—"} ({submission.species2_count || 0}
                  )
                </p>
                <p>
                  {submission.species3 || "—"} ({submission.species3_count || 0}
                  )
                </p>
              </div>
            </div>

            {/* 📅 PROJECT INFO */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">Project Info</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <p>
                  <span className="text-gray-500">Plantation Date:</span>{" "}
                  {submission.plantationDate}
                </p>
                <p>
                  <span className="text-gray-500">MGNREGA Days:</span>{" "}
                  {submission.MGNREGAPersonDays}
                </p>
                <p>
                  <span className="text-gray-500">Community Level:</span>{" "}
                  {submission.CommunityInvolvementLevel}
                </p>
                <p>
                  <span className="text-gray-500">Training:</span>{" "}
                  {submission.trained}
                </p>
              </div>
            </div>

            {/* 📝 DESCRIPTION */}
            <div className="mb-5">
              <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-sm text-gray-700">{submission.description}</p>
            </div>

            {/* 🖼 IMAGE */}
            {submission.profileImage && (
              <div className="mb-5">
                <h3 className="font-semibold text-gray-700 mb-2">Site Image</h3>
                <img
                  src={submission.profileImage}
                  className="w-full h-56 object-cover rounded-xl"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
