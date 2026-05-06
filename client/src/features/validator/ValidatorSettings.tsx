"use client";

import { authService } from "@/app/page";
import Button from "@/components/ui/Button";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ValidatorSettingsPage() {

  const [data, setData] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    organisation: "",
  });

  const [files, setFiles] = useState<any[]>([]);

  // 🔥 FETCH
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch(
        `${authService}/validator/me/profile`,
        {
          credentials: "include",
        }
      );

      const result = await res.json();

      setData(result);

      setForm({
        name: result.validator.user.name || "",
        email: result.validator.user.email || "",
        phonenumber:
          result.validator.user.phonenumber || "",
        organisation:
          result.validator.user.organisation || "",
      });
    };

    fetchProfile();
  }, []);

  // 🔥 SAVE
  const handleSave = async () => {
    try {
      const res = await fetch(
        `${authService}/users/me/update`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        toast.success("Profile updated");
      } else {
        toast.error("Failed");
      }

      // 🖼 IMAGE
      if (files.length > 0) {
        const formData = new FormData();

        formData.append(
          "file",
          files[0].file
        );

        await fetch(
          `${authService}/users/me/profile-picture`,
          {
            method: "POST",
            body: formData,
            credentials: "include",
          }
        );
      }

    } catch (err) {
      console.error(err);

      toast.error("Something went wrong");
    }
  };

  if (!data) {
    return (
      <div className="p-10 text-white">
        Loading...
      </div>
    );
  }

  const { validator, stats } = data;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6 space-y-8">

      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-3xl p-8 shadow-xl">

        <div className="flex justify-between flex-wrap gap-6">

          <div>

            <h1 className="text-5xl font-black">
              Validator Settings
            </h1>

            <p className="mt-4 text-lg text-white/80">
              Manage your validator profile and monitoring preferences
            </p>

          </div>

          <Button
            size="md"
            variant="primary"
            text={"Save Changes"}
            onClick={handleSave}
          />

        </div>

      </div>

      {/* 🟣 STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">

          <p className="text-sm text-gray-400">
            Verified Projects
          </p>

          <h2 className="text-5xl font-black mt-4 text-green-400">
            {stats.completed}
          </h2>

        </div>

        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">

          <p className="text-sm text-gray-400">
            Pending Assignments
          </p>

          <h2 className="text-5xl font-black mt-4 text-yellow-400">
            {stats.pending}
          </h2>

        </div>

        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">

          <p className="text-sm text-gray-400">
            In Progress
          </p>

          <h2 className="text-5xl font-black mt-4 text-blue-400">
            {stats.inprogress}
          </h2>

        </div>

        <div className="bg-slate-900 rounded-3xl p-6 shadow-lg border border-slate-800">

          <p className="text-sm text-gray-400">
            Total Area Reviewed
          </p>

          <h2 className="text-5xl font-black mt-4 text-purple-400">
            {stats.totalArea}
          </h2>

        </div>

      </div>

      {/* 🟢 MAIN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 🔵 PROFILE */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-800">

          <h2 className="text-3xl font-bold mb-8">
            Profile Settings
          </h2>

          {/* 🖼 PROFILE */}
          <div className="flex items-center gap-6 mb-10">

            <img
              src={
                files[0]?.preview ||
                validator.user.profileImage
              }
              className="w-36 h-36 rounded-full object-cover border-4 border-purple-500"
            />

            <div>

              <label className="bg-purple-600 hover:bg-purple-700 px-5 py-3 rounded-xl cursor-pointer font-semibold">

                Upload Image

                <input
                  type="file"
                  className="hidden"

                  onChange={(e: any) => {
                    const file =
                      e.target.files[0];

                    if (!file) return;

                    setFiles([
                      {
                        file,
                        preview:
                          URL.createObjectURL(
                            file
                          ),
                      },
                    ]);
                  }}
                />

              </label>

            </div>

          </div>

          {/* FORM */}
          <div className="space-y-6">

            {/* NAME */}
            <div>

              <p className="text-gray-400 mb-2">
                Full Name
              </p>

              <input
                value={form.name}

                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }

                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
              />

            </div>

            {/* EMAIL */}
            <div>

              <p className="text-gray-400 mb-2">
                Email
              </p>

              <input
                value={form.email}

                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }

                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
              />

            </div>

            {/* PHONE */}
            <div>

              <p className="text-gray-400 mb-2">
                Phone Number
              </p>

              <input
                value={form.phonenumber}

                onChange={(e) =>
                  setForm({
                    ...form,
                    phonenumber:
                      e.target.value,
                  })
                }

                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
              />

            </div>

            {/* ORG */}
            <div>

              <p className="text-gray-400 mb-2">
                Organisation
              </p>

              <input
                value={form.organisation}

                onChange={(e) =>
                  setForm({
                    ...form,
                    organisation:
                      e.target.value,
                  })
                }

                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-5 py-4 outline-none focus:border-purple-500"
              />

            </div>

          </div>

        </div>

        {/* 🟣 SIDE PANEL */}
        <div className="space-y-6">

          {/* 🔔 NOTIFICATION */}
          <div className="bg-slate-900 rounded-3xl p-8 shadow-lg border border-slate-800">

            <h2 className="text-2xl font-bold mb-8">
              Notifications
            </h2>

            <div className="space-y-6">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-semibold">
                    Email Notifications
                  </h3>

                  <p className="text-sm text-gray-400">
                    Assignment updates
                  </p>

                </div>

                <ToggleSwitch />

              </div>

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-semibold">
                    Monitoring Alerts
                  </h3>

                  <p className="text-sm text-gray-400">
                    Yearly monitoring reminders
                  </p>

                </div>

                <ToggleSwitch />

              </div>

            </div>

          </div>

          {/* 🟢 VALIDATOR BADGE */}
          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 rounded-3xl p-8 shadow-lg">

            <p className="text-sm opacity-80">
              Validator Reputation
            </p>

            <h2 className="text-6xl font-black mt-4">
              92%
            </h2>

            <p className="mt-4 opacity-80">
              High trust environmental validator
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}