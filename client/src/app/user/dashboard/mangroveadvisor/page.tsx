"use client";

import { useMemo, useState } from "react";

export default function MangroveAdvisorPage() {
  const [form, setForm] = useState({
    region: "",
    water: "",
    soil: "",
    area: "",
    survival: "",
    biodiversity: "",
    salinity: "",
  });

  const recommendations = useMemo(() => {
    const species: string[] = [];
    const risks: string[] = [];
    const practices: string[] = [];
    const insights: string[] = [];

    // 🌱 Species Recommendation
    if (form.water === "TIDAL") {
      species.push("Rhizophora Mucronata");
      species.push("Avicennia Marina");
    }

    if (form.water === "SEASONAL") {
      species.push("Bruguiera Gymnorrhiza");
      species.push("Sonneratia Alba");
    }

    if (form.soil === "HIGH") {
      species.push("Ceriops Decandra");
    }

    if (form.salinity === "HIGH") {
      species.push("Avicennia Officinalis");
    }

    // ⚠ Risk Detection
    if (form.water === "DRY") {
      risks.push(
        "Low tidal flow may reduce carbon sequestration"
      );
    }

    if (Number(form.survival) < 70) {
      risks.push(
        "Projected survival rate is below optimal threshold"
      );
    }

    if (form.soil === "LOW") {
      risks.push(
        "Poor soil quality may increase mortality risk"
      );
    }

    // 💡 Best Practices
    if (form.water === "TIDAL") {
      practices.push(
        "Maintain natural tidal channels for nutrient exchange"
      );
    }

    if (form.soil === "LOW") {
      practices.push(
        "Use sediment enrichment before plantation"
      );
    }

    if (Number(form.area) > 20) {
      practices.push(
        "Divide site into monitoring zones"
      );
    }

    if (form.biodiversity === "LOW") {
      practices.push(
        "Introduce mixed mangrove species to improve resilience"
      );
    }

    // 📈 Environmental Insights
    insights.push(
      "Mangroves can store up to 4x more carbon than terrestrial forests"
    );

    if (form.water === "TIDAL") {
      insights.push(
        "Tidal ecosystems typically show stronger long-term carbon retention"
      );
    }

    // 🧠 Score Calculation
    let score = 50;

    if (form.water === "TIDAL") score += 20;
    if (form.soil === "HIGH") score += 15;
    if (Number(form.survival) > 80) score += 15;
    if (form.biodiversity === "HIGH") score += 10;

    if (form.water === "DRY") score -= 15;
    if (form.soil === "LOW") score -= 10;

    score = Math.max(0, Math.min(score, 100));

    // 🌍 Carbon Forecast
    const area = Number(form.area || 0);
    const survival =
      Number(form.survival || 0) / 100;

    const estimatedCO2 = Math.floor(
      area * survival * 85
    );

    // 🌳 Impact Equivalents
    const treeEquivalent = estimatedCO2 * 6;
    const carEquivalent = Math.floor(
      estimatedCO2 / 4.6
    );

    return {
      species,
      risks,
      practices,
      insights,
      score,
      estimatedCO2,
      treeEquivalent,
      carEquivalent,
    };
  }, [form]);

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 text-gray-800">

      {/* 🔥 HERO */}
      <div className="mb-10">

        <h1 className="text-3xl font-black">
          🌱 Mangrove Advisor System
        </h1>

        <p className="text-gray-500 mt-3 text-md">
          Smart environmental recommendation engine for blue carbon restoration
        </p>

      </div>

      {/* 🟢 MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🧾 INPUTS */}
        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-5">

          <h2 className="text-2xl font-bold">
            Plantation Conditions
          </h2>

          <select
            className="w-full p-4 rounded-xl border"
            value={form.region}
            onChange={(e) =>
              setForm({
                ...form,
                region: e.target.value,
              })
            }
          >
            <option value="">Select Region</option>
            <option>Maharashtra</option>
            <option>Odisha</option>
            <option>West Bengal</option>
            <option>Tamil Nadu</option>
          </select>

          <select
            className="w-full p-4 rounded-xl border"
            value={form.water}
            onChange={(e) =>
              setForm({
                ...form,
                water: e.target.value,
              })
            }
          >
            <option value="">Water Condition</option>
            <option value="TIDAL">Tidal</option>
            <option value="SEASONAL">Seasonal</option>
            <option value="DRY">Dry</option>
          </select>

          <select
            className="w-full p-4 rounded-xl border"
            value={form.soil}
            onChange={(e) =>
              setForm({
                ...form,
                soil: e.target.value,
              })
            }
          >
            <option value="">Soil Quality</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            className="w-full p-4 rounded-xl border"
            value={form.salinity}
            onChange={(e) =>
              setForm({
                ...form,
                salinity: e.target.value,
              })
            }
          >
            <option value="">Salinity</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            className="w-full p-4 rounded-xl border"
            value={form.biodiversity}
            onChange={(e) =>
              setForm({
                ...form,
                biodiversity: e.target.value,
              })
            }
          >
            <option value="">Biodiversity</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <input
            type="number"
            placeholder="Area (ha)"
            className="w-full p-4 rounded-xl border"
            value={form.area}
            onChange={(e) =>
              setForm({
                ...form,
                area: e.target.value,
              })
            }
          />

          <input
            type="number"
            placeholder="Expected Survival Rate (%)"
            className="w-full p-4 rounded-xl border"
            value={form.survival}
            onChange={(e) =>
              setForm({
                ...form,
                survival: e.target.value,
              })
            }
          />

        </div>

        {/* 📊 OUTPUT */}
        <div className="lg:col-span-2 space-y-6">

          {/* 🟢 SCORE + FORECAST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl p-6 shadow-lg">

              <h2 className="text-xl font-semibold">
                Project Success Score
              </h2>

              <p className="text-7xl font-black mt-6">
                {recommendations.score}%
              </p>

              <p className="mt-3 opacity-80">
                Estimated long-term plantation viability
              </p>

            </div>

            <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-3xl p-6 shadow-lg">

              <h2 className="text-xl font-semibold">
                5-Year Carbon Forecast
              </h2>

              <p className="text-7xl font-black mt-6">
                {recommendations.estimatedCO2}
              </p>

              <p className="mt-3 opacity-80">
                tons of estimated CO₂ removal
              </p>

            </div>

          </div>

          {/* 🌍 IMPACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-3xl p-6 shadow-lg">

              <h2 className="text-xl font-bold">
                🌳 Tree Equivalent
              </h2>

              <p className="text-5xl font-black text-green-600 mt-4">
                {recommendations.treeEquivalent}
              </p>

              <p className="text-gray-500 mt-2">
                trees worth of carbon impact
              </p>

            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">

              <h2 className="text-xl font-bold">
                🚗 Vehicle Offset
              </h2>

              <p className="text-5xl font-black text-blue-600 mt-4">
                {recommendations.carEquivalent}
              </p>

              <p className="text-gray-500 mt-2">
                cars removed yearly
              </p>

            </div>

          </div>

          {/* 🌱 RECOMMENDED SPECIES */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-5">
              Recommended Species
            </h2>

            <div className="flex flex-wrap gap-3">

              {recommendations.species.length > 0 ? (
                recommendations.species.map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold"
                  >
                    {s}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  Enter conditions to generate recommendations
                </p>
              )}

            </div>

          </div>

          {/* ⚠ RISKS */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-5">
              Risk Analysis
            </h2>

            <div className="space-y-3">

              {recommendations.risks.length > 0 ? (
                recommendations.risks.map((r, idx) => (
                  <div
                    key={idx}
                    className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl"
                  >
                    ⚠ {r}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  No major environmental risks detected
                </p>
              )}

            </div>

          </div>

          {/* 💡 BEST PRACTICES */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-5">
              Recommended Practices
            </h2>

            <div className="space-y-3">

              {recommendations.practices.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl"
                >
                  💡 {p}
                </div>
              ))}

            </div>

          </div>

          {/* 🧠 INSIGHTS */}
          <div className="bg-white rounded-3xl p-6 shadow-lg">

            <h2 className="text-2xl font-bold mb-5">
              Environmental Insights
            </h2>

            <div className="space-y-3">

              {recommendations.insights.map((i, idx) => (
                <div
                  key={idx}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl"
                >
                  🌍 {i}
                </div>
              ))}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}