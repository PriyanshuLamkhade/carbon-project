'use client';


import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SignUpForm } from "./handleSignMessage";

export default function Page() {
  const router = useRouter();

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-gray-800 text-white">
      <SignUpForm/>

      
    </div>
  );
}
