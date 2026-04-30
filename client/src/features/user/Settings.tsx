// import { ImageDrop } from '@/app/components/ImageDrop'
"use client";

import Button from "@/components/ui/Button";
import InputBox from "@/components/ui/InputBox";
import { useEffect, useState } from "react";
import ImageDrop from "../upload/ImageDrop";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { authService } from "@/app/page";
import { useAppData } from "@/context/AppContext";

const UserSettings = () => {
  const { user } = useAppData();
  console.log(user);
  const [files, setFiles] = useState<any[]>([]);

  const uploadProfilePicture = async () => {
    if (!files.length) return;

    const selected = files[0];

    if (!selected.file) return; // existing image

    const formData = new FormData();
    formData.append("file", selected.file);

    await fetch(`${authService}/users/me/profile-picture`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  };

  return (
    <div className="space-y-6 text-gray-700">
      <div
        id="top"
        className="flex justify-between items-center flex-wrap  py-1 mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold ">Settings</h1>
        </div>
        <Button
          size="md"
          variant="primary"
          text={"Save Changes"}
          onClick={uploadProfilePicture}
        />
      </div>
      <div id="main" className="flex flex-wrap gap-5">
        <div className="flex flex-col gap-3 bg-white p-5 rounded-lg borde min-w-[60%]">
          <h1 className="text-xl font-bold ">Profile Settings:</h1>
          <img
  src={user?.profileImage}
  alt="Profile"
  referrerPolicy="no-referrer"
  className="w-32 h-32 rounded-full object-cover"
/>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-[150px] text-md text-gray-500">
                Display Name:
              </span>
              <InputBox className="flex-1" placeholder="User" />
              <Button size="sm" text="Edit" variant="primary" />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-[150px] text-md text-gray-500">Email:</span>
              <InputBox className="flex-1" placeholder="user@example.com" />
              <Button size="sm" text="Edit" variant="primary" />
            </div>

            <div className="flex items-center gap-2">
              <span className="w-[150px] text-md text-gray-500">
                Phone Number:
              </span>
              <InputBox className="flex-1" placeholder="1234567890" />
              <Button size="sm" text="Edit" variant="primary" />
            </div>
          </div>
        </div>
        {/* ProfileImage */}

        <div className=" flex flex-col gap-5 bg-white p-7 rounded-lg ">
          <h1 className="text-xl font-bold ">Notification</h1>
          <div className="flex flex-wrap gap-5 text-gray-500">
            <span>
              <h1 className="text-md ">Email Notifications</h1>
              <h4 className="text-sm ">Recive updates via emails</h4>
            </span>
            <ToggleSwitch />
          </div>
          <div className="flex flex-wrap gap-5 text-gray-500">
            <span>
              <h1 className="text-md ">Push Notifications</h1>
              <h4 className="text-sm ">Recive updates in browser</h4>
            </span>
            <ToggleSwitch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
