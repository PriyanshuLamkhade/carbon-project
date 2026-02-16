"use client";

import { useRef, useCallback, useState } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";

const videoConstraints = { width: 540, facingMode: "environment" };

const CameraComponent = () => {
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const router = useRouter();

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    setUrl(imageSrc);

    const base64Data = imageSrc.split(",")[1];
    setImageBase64(base64Data);

    // Save temporarily in localStorage to pass to form page
    localStorage.setItem("capturedImage", base64Data);

    // Optional: download locally
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "profile_photo.jpg";
    link.click();
  }, [webcamRef]);

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={capturePhoto}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Capture Photo
        </button>
        <button
          type="button"
          onClick={() => setUrl(null)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Refresh
        </button>
      </div>
      {url && (
        <div>
          <img src={url} alt="Captured" className="w-48 h-48 object-cover mt-2" />
        </div>
      )}
      {imageBase64 && (
        <button
          onClick={() => router.push("/user/form")}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        >
          Continue to Form
        </button>
      )}
    </div>
  );
};

export default CameraComponent;
