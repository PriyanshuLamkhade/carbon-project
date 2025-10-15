'use client';

// import { Wallet } from "../wallet";
// import { SignUpForm } from "./handleSignMessage";

import dynamic from 'next/dynamic';

//Lazy-load Wallet (client-only)
const Wallet = dynamic(() => import('../wallet').then(mod => mod.Wallet), {
  ssr: false,
  loading: () => <div>Loading Wallet...</div>,
});

//Lazy-load SignUpForm (client-only, if it uses browser APIs or is heavy)
const SignUpForm = dynamic(() => import('./handleSignMessage').then(mod => mod.SignUpForm), {
  ssr: false,
  loading: () => <div>Loading Sign Up Form...</div>,
});



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
 