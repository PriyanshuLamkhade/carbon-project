'use client';

import { Wallet } from "../wallet";
import { SignUpForm } from "./handleSignMessage";

import dynamic from 'next/dynamic';


const Page = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col justify-center text-white bg-gray-800">
      <Wallet>
        <SignUpForm />
      </Wallet>
    </div>
  );
};

export default Page;
 