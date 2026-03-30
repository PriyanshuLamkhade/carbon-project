"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MultiMarkerMap from "@/features/map/MultiMarkerMapProps";


const VerificationForm = ({ submission }: any) => {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    actualArea: "",
    vegetation: "",
    boundaryMatch: "",
    anomalies: "",
    remarks: "",
    recommendation: "",
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
    if (!form.actualArea || !form.recommendation) {
      alert("Please complete required fields");
      return;
    }

    const payload = {
      submissionId: submission.submissionId,
      ...form,
      images,
    };

    console.log("Submitting:", payload);

    // 🔜 send to backend
    // await fetch("/validator/verify", {...})

    router.push("/validator/dashboard");
  };

  const markers = [
    {
      lat: submission.latitude,
      lon: submission.longitude,
      label: submission.location,
      status: "INPROGRESS",
      submissionId: submission.submissionId,
      geoTag: submission.geoTag,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 🔹 Header */}
      <div>
        <h1 className="text-2xl font-bold">Verification</h1>
        <p className="text-gray-500 text-sm">
          Validate submission with evidence and checks
        </p>
      </div>

      {/* 🔹 Map */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-3">Project Location</h2>
        <MultiMarkerMap markers={markers} />
      </div>

      {/* 🔹 Area Verification */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Area Verification</h2>

        <p className="text-sm text-gray-500">
          Claimed Area: <strong>{submission.areaclaim} ha</strong>
        </p>

        <input
          type="number"
          name="actualArea"
          placeholder="Enter measured area"
          value={form.actualArea}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded-lg"
        />
      </div>

      {/* 🔹 Checklist */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="font-semibold">Verification Checklist</h2>

        {[
          { label: "Vegetation present?", name: "vegetation" },
          { label: "Matches boundary?", name: "boundaryMatch" },
          { label: "Any anomalies?", name: "anomalies" },
        ].map((item) => (
          <div key={item.name}>
            <p className="text-sm mb-1">{item.label}</p>
            <select
              name={item.name}
              value={form[item.name as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg"
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </select>
          </div>
        ))}
      </div>

      {/* 🔹 Image Upload */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Upload Evidence</h2>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
        />

        <p className="text-xs text-gray-500">
          Upload 2–5 images from site (with GPS enabled)
        </p>
      </div>

      {/* 🔹 Remarks */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="font-semibold mb-2">Remarks</h2>

        <textarea
          name="remarks"
          value={form.remarks}
          onChange={handleChange}
          placeholder="Write observations..."
          className="w-full border px-4 py-2 rounded-lg h-24"
        />
      </div>

      {/* 🔹 Final Decision */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3">
        <h2 className="font-semibold">Final Decision</h2>

        <div className="flex gap-4">
          {["APPROVED", "REJECTED"].map((option) => (
            <button
              key={option}
              onClick={() =>
                setForm({ ...form, recommendation: option })
              }
              className={`px-4 py-2 rounded-lg border ${
                form.recommendation === option
                  ? option === "APPROVED"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* 🔹 Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold"
        >
          Submit Verification
        </button>
      </div>
    </div>
  );
};

export default VerificationForm;