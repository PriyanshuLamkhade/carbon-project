'use client';

import { Wallet } from "../wallet";
import { SignUpForm } from "./handleSignMessage";

import dynamic from 'next/dynamic';


const Page = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col justify-center bg-amber-200">
      <Wallet>
        <SignUpForm />
      </Wallet>
    </div>
  );
};

export default Page;
 