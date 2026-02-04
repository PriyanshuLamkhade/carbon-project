// import { ImageDrop } from '@/app/components/ImageDrop'
"use client";
import ImageDrop from "@/app/components/ImageDrop";
import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";
import ToggleSwitch from "@/app/components/ui/ToggleSwitch";
import { useEffect, useState } from "react";

const page = () => {
  const [files, setFiles] = useState<any[]>([]);

  useEffect(() => {
  const loadProfilePic = async () => {
    const res = await fetch("http://localhost:4000/users/userDetails", {
      credentials: "include",
    });

    if (!res.ok) return;

    const data = await res.json();

    if (data.userDetails?.profileImage) {
      setFiles([
        {
          id: "existing",
          preview: `http://localhost:4000/files/${data.userDetails.profileImage}?${Date.now()}`,
        },
      ]);
    }
  };

  loadProfilePic();
}, []);
const uploadProfilePicture = async () => {
  if (!files.length) return;

  const selected = files[0];

  if (!selected.file) return; // existing image

  const formData = new FormData();
  formData.append("file", selected.file);

  await fetch("http://localhost:4000/users/me/profile-picture", {
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
        <Button size="md" variant="primary" text={"Save Changes"} onClick={uploadProfilePicture}/>
      </div>
      <div id="main" className="flex flex-wrap gap-5">
        <div className="flex flex-col gap-2 bg-white p-7 rounded-lg">
          <h1 className="text-xl font-bold ">Profile Settings</h1>
          {files.map((file) => (
            <img
              key={file.id}
              src={file.preview}
              className="w-32 h-32 rounded-full object-cover"
            />
          ))}
          <label htmlFor="" className="text-md text-gray-500">
            Display Name
          </label>
          <InputBox placeholder="User" />
          <label htmlFor="" className="text-md text-gray-500">
            Email
          </label>
          <InputBox placeholder="user@example.com" />
          <label htmlFor="" className="text-md text-gray-500">
            Phone Number
          </label>
          <InputBox placeholder="1234567890" />
        </div>

        <div className="flex flex-col gap-2 bg-white p-7 rounded-lg">
          <h1 className="text-xl font-bold ">Profile Picture</h1>

          <ImageDrop setFiles={setFiles} />
          <pre className=" text-gray-500 mt-5 leading-tight align">
            Upload a clear photo of your face <br />
            Min: 200×200 px • Max: 800×800 px <br />
            JPG / PNG • Max size: 300 KB <br />
          </pre>
        </div>

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

export default page;
