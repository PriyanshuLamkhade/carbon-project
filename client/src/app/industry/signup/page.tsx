"use client";

import { useState } from "react";

export default function IndustrySignup() {
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.companyName || !form.email || !form.password) {
      alert("Please fill required fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/industry/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Request submitted! Wait for admin approval.");

      // redirect to login
      window.location.href = "/industry/login";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg space-y-5">

        <h1 className="text-2xl font-bold text-center">
          🏭 Industry Registration
        </h1>

        {/* Company Name */}
        <input
          name="companyName"
          placeholder="Company Name *"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email *"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password *"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Phone */}
        <input
          name="phone"
          placeholder="Phone"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Company Address"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 py-3 rounded font-semibold"
        >
          {loading ? "Submitting..." : "Register"}
        </button>

        {/* Login Redirect */}
        <p className="text-sm text-gray-400 text-center">
          Already registered?{" "}
          <a href="/industry/login" className="text-blue-400 underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}