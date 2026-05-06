"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/app/page";
import toast from "react-hot-toast";

export default function YearlyReportForm({
  submissionId,
  historyId,
}: any) {
  const router = useRouter();

  const [form, setForm] = useState({
    survivalRate: "",
    avgHeight: "MEDIUM",
    plantationHealth: "GOOD",
    waterCondition: "SEASONAL",
    soilQuality: "MEDIUM",
    remarks: "",
  });

  const [images, setImages] = useState<File[]>([]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: any) => {
    const files = Array.from(e.target.files);
    setImages(files as File[]);
  };

  const handleSubmit = async () => {
    try {
      if (!form.survivalRate) {
        return alert("Please enter survival rate");
      }

      const formData = new FormData();

      const payload = {
        historyId,
        form: {
          ...form,
          survivalRate: Number(form.survivalRate),
        },
      };

      formData.append("data", JSON.stringify(payload));

      images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await fetch(
        `${authService}/validator/yearlyReport`,
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      if (res.ok) {
        toast.success("Yearly report submitted");
        router.push("/validator/dashboard");
      } else {
        toast.error("Failed to submit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting report");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-50">
      <div className="w-full max-w-xl bg-white p-6 rounded-2xl shadow space-y-4">
        <h2 className="text-2xl font-bold">
          Yearly Monitoring Report
        </h2>

        {/* Survival Rate */}
        <div>
          <label className="text-sm text-gray-500">
            Survival Rate (%)
          </label>
          <input
            type="number"
            name="survivalRate"
            value={form.survivalRate}
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Height */}
        <div>
          <label className="text-sm text-gray-500">
            Average Height
          </label>
          <select
            name="avgHeight"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="SMALL">Small</option>
            <option value="MEDIUM">Medium</option>
            <option value="LARGE">Large</option>
          </select>
        </div>

        {/* Health */}
        <div>
          <label className="text-sm text-gray-500">
            Plantation Health
          </label>
          <select
            name="plantationHealth"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="GOOD">Good</option>
            <option value="AVERAGE">Average</option>
            <option value="POOR">Poor</option>
          </select>
        </div>

        {/* Water */}
        <div>
          <label className="text-sm text-gray-500">
            Water Condition
          </label>
          <select
            name="waterCondition"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="TIDAL">Tidal</option>
            <option value="SEASONAL">Seasonal</option>
            <option value="DRY">Dry</option>
          </select>
        </div>

        {/* Soil */}
        <div>
          <label className="text-sm text-gray-500">
            Soil Quality
          </label>
          <select
            name="soilQuality"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          >
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm text-gray-500">
            Remarks
          </label>
          <textarea
            name="remarks"
            onChange={handleChange}
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {/* Images */}
        <div>
          <label className="text-sm text-gray-500">
            Upload Images
          </label>
          <input type="file" multiple onChange={handleImageUpload} />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded-lg"
        >
          Submit Yearly Report
        </button>
      </div>
    </div>
  );
}