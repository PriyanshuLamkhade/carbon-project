import { authService } from "@/app/page";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ValidatorDetails = ({ validatorData }: any) => {
  const router = useRouter();
  const [form, setForm] = useState({
    address: "",
    latitude: "",
    longitude: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (!form.address || !form.latitude || !form.longitude) {
        alert("All fields are required");
        return;
      }

      const finalData = {
        ...validatorData,
        validatorDetails: {
          address: form.address,
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
        },
      };
      const result = await axios.post(
        `${authService}/validator/registerValidator`,
        finalData,
        { withCredentials: true },
      );

      toast.success(result.data.message);
      router.push("/validator/dashboard")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Validator Details
        </h2>

        {/* Address */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your location"
            className="w-full mt-1 px-4 py-2 border rounded-lg border-black text-black"
          />
        </div>

        {/* Latitude */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Latitude</label>
          <input
            type="number"
            name="latitude"
            value={form.latitude}
            onChange={handleChange}
            placeholder="e.g. 18.5204"
            className="w-full mt-1 px-4 py-2 border rounded-lg border-black text-black"
          />
        </div>

        {/* Longitude */}
        <div className="mb-4">
          <label className="text-sm text-gray-500">Longitude</label>
          <input
            type="number"
            name="longitude"
            value={form.longitude}
            onChange={handleChange}
            placeholder="e.g. 73.8567"
            className="w-full mt-1 px-4 py-2 border rounded-lg border-black text-black"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600"
        >
          Complete Registration
        </button>
      </div>
    </div>
  );
};

export default ValidatorDetails;
