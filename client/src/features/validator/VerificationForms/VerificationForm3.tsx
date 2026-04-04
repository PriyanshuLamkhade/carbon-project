"use client";

import { useState } from "react";

export default function VerificationForm3({
  submission,
  verificationData,
  sectionBData,
  onNext,
}: any) {

  const [images, setImages] = useState<File[]>([]);
  const [decision, setDecision] = useState("");

  const formA = verificationData.form;
  const formB = sectionBData.sectionB;

  // 🌳 Tree count
  const treeCount =
    (submission.species1_count || 0) +
    (submission.species2_count || 0) +
    (submission.species3_count || 0);

  const survival = Number(formB.survivalRate || 0) / 100;

  const heightFactor =
    formB.avgHeight === "SMALL" ? 0.5 :
    formB.avgHeight === "MEDIUM" ? 1 :
    formB.avgHeight === "LARGE" ? 1.5 : 1;

  const healthFactor =
    formB.plantationHealth === "GOOD" ? 1 :
    formB.plantationHealth === "AVERAGE" ? 0.7 : 0.4;

  const waterFactor =
    formB.waterCondition === "TIDAL" ? 1.3 :
    formB.waterCondition === "SEASONAL" ? 1 : 0.7;

  const soilFactor =
    formB.soilQuality === "HIGH" ? 1.4 :
    formB.soilQuality === "MEDIUM" ? 1 : 0.6;

  // 🌿 Calculations
  const AGB = treeCount * survival * heightFactor * 0.1;
  const BGB = AGB * 0.3;
  const soilCarbon = (submission.areaclaim || 1) * soilFactor * waterFactor * 50;

  const totalCarbon = AGB + BGB + soilCarbon;
  const annualCO2 = totalCarbon * 0.1;

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    setImages(files as File[]);
  };

  const handleSubmit = () => {
    if (!decision) {
      alert("Please select Accept or Reject");
      return;
    }

    onNext({
      decision,
      images,
      totalCarbon,
      annualCO2,
      AGB,
      BGB,
      soilCarbon,
      verificationData,
      sectionBData,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">

      <h1 className="text-3xl font-bold">Final Verification Review</h1>

      {/* 🟦 FULL PREVIEW */}
      <div className="bg-white p-6 rounded-2xl shadow space-y-6">

        <h2 className="font-semibold text-xl">Submission + Verification Summary</h2>

        {/* SECTION A */}
        <div>
          <u className="font-semibold text-lg mb-2">Section A (Verification)</u>
          <p>Location: {formA.validatorLocation}</p>
          <p>Area: {formA.actualArea} ha</p>
          <p>Boundary Match: {formA.boundaryMatch}</p>
          <p>Density: {formA.mangroveDensity}</p>
          <p>Soil: {formA.soilCondition}</p>
        </div>

        {/* SECTION B */}
        <div>
          <u className="font-semibold text-lg mb-2">Section B (Carbon Inputs)</u>
          <p>Survival Rate: {formB.survivalRate}%</p>
          <p>Height: {formB.avgHeight}</p>
          <p>Health: {formB.plantationHealth}</p>
          <p>Water: {formB.waterCondition}</p>
          <p>Soil Quality: {formB.soilQuality}</p>
        </div>

        {/* SECTION C RESULTS */}
        <div>
          <u className="font-semibold text-lg mb-2">Carbon Report</u>
          <p>AGB: {AGB.toFixed(2)}</p>
          <p>BGB: {BGB.toFixed(2)}</p>
          <p>Soil Carbon: {soilCarbon.toFixed(2)}</p>
          <p>Total Carbon: {totalCarbon.toFixed(2)}</p>
          <p>Annual CO₂: {annualCO2.toFixed(2)}</p>
        </div>

      </div>

      {/* 📸 IMAGE UPLOAD */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-2">Upload Final Images</h3>
        <input type="file" multiple onChange={handleImageUpload} />
      </div>

      {/* ✅ DECISION BUTTONS */}
      <div className="flex gap-4">
        <button
          onClick={() => setDecision("ACCEPTED")}
          className={`px-6 py-3 rounded-xl ${
            decision === "ACCEPTED"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Accept
        </button>

        <button
          onClick={() => setDecision("REJECTED")}
          className={`px-6 py-3 rounded-xl ${
            decision === "REJECTED"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Reject
        </button>
      </div>

      {/* 🚀 SUBMIT */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl cursor-pointer"
        >
          Submit Verification
        </button>
      </div>
    </div>
  );
}