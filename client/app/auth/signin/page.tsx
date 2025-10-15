'use client';

import dynamic from 'next/dynamic';
import { Wallet } from '../wallet';
import SignInForm from './SignInForm';

// Lazy-load Wallet and SignInForm, client-side only
// const Wallet = dynamic(() => import('../wallet').then(mod => mod.Wallet), {
//   ssr: false,
//   loading: () => <div>Loading Wallet...</div>,
// });

// const SignInForm = dynamic(() => import('./SignInForm'), {
//   ssr: false,
//   loading: () => <div>Loading Form...</div>,
// });

const Page = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col justify-center bg-amber-200">
      <Wallet>
        <SignInForm />
      </Wallet>
    </div>
  );
};

export default Page;
