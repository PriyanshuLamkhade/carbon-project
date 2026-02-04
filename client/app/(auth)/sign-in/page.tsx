'use client';

import { useRouter } from "next/navigation";
import SignInForm from "./SignInForm";



const Page = () => {
  const router = useRouter();
  return (
    <div className="h-screen w-full items-center flex flex-col text-white justify-center bg-gray-800">
      <SignInForm/>  
    </div>
  );
};

export default Page;
