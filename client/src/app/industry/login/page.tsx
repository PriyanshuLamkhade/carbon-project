"use client";

import { useState } from "react";

export default function IndustryLogin() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:4000/industry/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 🔥 IMPORTANT (cookie)
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      alert("Login successful");

      // redirect to marketplace
      window.location.href = "/marketplace";
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
          🔐 Industry Login
        </h1>

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Password */}
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700"
          onChange={handleChange}
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded font-semibold"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Signup redirect */}
        <p className="text-sm text-gray-400 text-center">
          New company?{" "}
          <a href="/industry/signup" className="text-green-400 underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}