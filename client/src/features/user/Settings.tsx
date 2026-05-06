"use client";

import Button from "@/components/ui/Button";
import InputBox from "@/components/ui/InputBox";
import { useEffect, useState } from "react";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { authService } from "@/app/page";
import { useAppData } from "@/context/AppContext";
import toast from "react-hot-toast";

const UserSettings = () => {
  const { user } = useAppData();

  const [files, setFiles] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phonenumber: "",
    organisation: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phonenumber: user.phonenumber || "",
        organisation: user.organisation || "",
      });
    }
  }, [user]);

  // 🟢 SAVE PROFILE
  const handleSave = async () => {
    try {
      const res = await fetch(`${authService}/users/me/update`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Profile updated");
      } else {
        toast.error(data.message);
      }

      // 🔥 Upload image separately
      if (files.length > 0) {
        await uploadProfilePicture();
      }
    } catch (err) {
      console.error(err);

      toast.error("Failed to update");
    }
  };

  // 🖼 PROFILE PICTURE
  const uploadProfilePicture = async () => {
    if (!files.length) return;

    const selected = files[0];

    if (!selected.file) return;

    const formData = new FormData();

    formData.append("file", selected.file);

    const res = await fetch(`${authService}/users/me/profile-picture`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Profile image updated");
    }
  };

  return (
    <div className="space-y-6 text-gray-700">
      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center flex-wrap py-1 mb-10">
        <div>
          <h1 className="text-4xl font-black">Settings</h1>

          <p className="text-gray-500 mt-2">
            Manage your profile and preferences
          </p>
        </div>

        <Button
          size="md"
          variant="primary"
          text={"Save Changes"}
          onClick={handleSave}
        />
      </div>

      {/* 🟢 MAIN */}
      <div className="flex flex-wrap gap-6">
        {/* 🔵 PROFILE */}
        <div className="flex-1 bg-white p-8 rounded-3xl shadow-lg min-w-[60%]">
          <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>

          {/* PROFILE IMAGE */}
          <div className="flex items-center gap-6 mb-8">
            <img
              src={files[0]?.preview || user?.profileImage}
              alt="Profile"
              referrerPolicy="no-referrer"
              className="w-36 h-36 rounded-full object-cover border-4 border-green-500"
            />

            <div>
              <label className="cursor-pointer bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition">
                Upload Image
                <input
                  type="file"
                  className="hidden"
                  onChange={(e: any) => {
                    const file = e.target.files[0];

                    if (!file) return;

                    setFiles([
                      {
                        file,
                        preview: URL.createObjectURL(file),
                      },
                    ]);
                  }}
                />
              </label>
            </div>
          </div>

          {/* FORM */}
          <div className="space-y-5">
            {/* NAME */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Display Name</p>

              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            {/* EMAIL */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Email Address</p>

              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            {/* PHONE */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Phone Number</p>

              <input
                type="text"
                value={form.phonenumber}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phonenumber: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            {/* ORG */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Organisation</p>

              <input
                type="text"
                value={form.organisation}
                onChange={(e) =>
                  setForm({
                    ...form,
                    organisation: e.target.value,
                  })
                }
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* 🟣 NOTIFICATIONS */}
        <div className="bg-white p-8 rounded-3xl shadow-lg min-w-[320px] h-fit">
          <h1 className="text-2xl font-bold mb-8">Notifications</h1>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Email Notifications</h2>

                <p className="text-sm text-gray-500">
                  Receive updates via email
                </p>
              </div>

              <ToggleSwitch />
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Push Notifications</h2>

                <p className="text-sm text-gray-500">Browser notifications</p>
              </div>

              <ToggleSwitch />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
