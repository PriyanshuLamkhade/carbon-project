'use client';

import { Wallet } from '../wallet';
import SignInForm from './SignInForm';


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
