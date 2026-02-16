'use client';


import { useRouter } from "next/navigation";
import CameraComponent from "../camera/camera";

const CameraCapture = () => {
  const router = useRouter();

  const proceedToForm = () => {
    router.push("/user/form");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-green-200 to-green-300 p-6">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-green-900 mb-4 text-center">
        Capture Your Photo
      </h1>

      {/* Instructions */}
      <p className="text-green-800 text-center mb-6 max-w-md">
        Please take a clear photo of yourself. Make sure your face is visible and well-lit.
      </p>

      {/* Camera Component */}
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-4 mb-6">
        <CameraComponent />
      </div>

      
    </div>
  );
};

export default CameraCapture;
