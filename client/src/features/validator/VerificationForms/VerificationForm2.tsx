"use client";

import { useState } from "react";

export default function VerificationForm2({
  submission,
  verificationData,
  onNext,
}: any) {
  const [form, setForm] = useState({
    survivalRate: "",
    avgHeight: "",
    plantationHealth: "",
    waterCondition: "",
    soilQuality: "",
    plantingMethod: "",
    mortalityCause: "", // ✅ NEW
  });

  const [carbon, setCarbon] = useState(0);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🌿 CARBON CALCULATION ENGINE
  const calculateCarbon = () => {
    const treeCount =
      (submission.species1_count || 0) +
      (submission.species2_count || 0) +
      (submission.species3_count || 0);

    const survival = Number(form.survivalRate || 0) / 100;

    // 🌳 Growth factor
    const heightFactor =
      form.avgHeight === "SMALL"
        ? 0.5
        : form.avgHeight === "MEDIUM"
          ? 1
          : form.avgHeight === "LARGE"
            ? 1.5
            : 1;

    // 🌱 Health factor
    const healthFactor =
      form.plantationHealth === "GOOD"
        ? 1
        : form.plantationHealth === "AVERAGE"
          ? 0.7
          : form.plantationHealth === "POOR"
            ? 0.4
            : 1;

    // 🌊 Water factor (blue carbon boost)
    const waterFactor =
      form.waterCondition === "TIDAL"
        ? 1.3
        : form.waterCondition === "SEASONAL"
          ? 1
          : 0.7;

    // 🌍 Soil factor
    const soilFactor =
      form.soilQuality === "HIGH"
        ? 1.4
        : form.soilQuality === "MEDIUM"
          ? 1
          : 0.6;

    // 🌿 Planting method factor
    const plantingFactor =
      form.plantingMethod === "NURSERY"
        ? 1.1
        : form.plantingMethod === "DIRECT"
          ? 0.9
          : 1;

    // 🧮 FINAL CARBON (simple model)
    const result =
      treeCount *
      survival *
      heightFactor *
      healthFactor *
      waterFactor *
      soilFactor *
      plantingFactor *
      0.02; // base constant

    setCarbon(result);
  };

  const handleNext = () => {
    calculateCarbon();

    onNext({
      sectionB: form,
      carbon,
      verificationData,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* HEADER */}
      <h1 className="text-2xl font-bold">Section B: Carbon Estimation</h1>

      {/* 📊 REFERENCE */}
      <div className="bg-gray-50 p-4 rounded-xl text-sm">
        <p>
          <b>Total Trees:</b>{" "}
          {(submission.species1_count || 0) +
            (submission.species2_count || 0) +
            (submission.species3_count || 0)}
        </p>
      </div>

      {/* 🌱 FORM */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          maxLength={2}
          name="survivalRate"
          placeholder="Survival Rate (%)"
          onChange={handleChange}
          className="input"
        />
        <select name="mortalityCause" onChange={handleChange} className="input">
          <option value="">Mortality Cause (if any)</option>
          <option value="NATURAL">Natural</option>
          <option value="FLOODING">Flooding</option>
          <option value="HUMAN">Human Activity</option>
          <option value="DISEASE">Disease</option>
          <option value="UNKNOWN">Unknown</option>
        </select>

        <select name="avgHeight" onChange={handleChange} className="input">
          <option value="">Average Height</option>
          <option value="SMALL">Small (&lt;1m)</option>
          <option value="MEDIUM">Medium (1–3m)</option>
          <option value="LARGE">Large (3m+)</option>
        </select>

        <select
          name="plantationHealth"
          onChange={handleChange}
          className="input"
        >
          <option value="">Plantation Health</option>
          <option value="GOOD">Good</option>
          <option value="AVERAGE">Average</option>
          <option value="POOR">Poor</option>
        </select>

        <select name="waterCondition" onChange={handleChange} className="input">
          <option value="">Water / Tidal Condition</option>
          <option value="TIDAL">Regular Tidal</option>
          <option value="SEASONAL">Seasonal</option>
          <option value="DRY">Dry</option>
        </select>

        <select name="soilQuality" onChange={handleChange} className="input">
          <option value="">Soil Quality</option>
          <option value="HIGH">High Organic</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>

        <select name="plantingMethod" onChange={handleChange} className="input">
          <option value="">Planting Method</option>
          <option value="DIRECT">Direct Planting</option>
          <option value="NURSERY">Nursery Transplant</option>
          <option value="MIXED">Mixed</option>
        </select>
      </div>

      {/* 🌿 CARBON RESULT */}
      <div className="bg-black text-white p-6 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-sm opacity-70">Estimated Carbon (tons CO₂)</p>
          <h2 className="text-3xl font-bold">{carbon.toFixed(2)}</h2>
        </div>

        <button
          onClick={calculateCarbon}
          className="bg-white text-black px-4 py-2 rounded-lg"
        >
          Calculate
        </button>
      </div>

      {/* ➡️ NEXT */}
      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700"
        >
          Continue →
        </button>
      </div>

      {/* STYLE */}
      <style jsx>{`
        .input {
          border: 1px solid #e5e7eb;
          padding: 10px;
          border-radius: 10px;
          width: 100%;
          outline: none;
        }
        .input:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 1px #3b82f6;
        }
      `}</style>
    </div>
  );
}
