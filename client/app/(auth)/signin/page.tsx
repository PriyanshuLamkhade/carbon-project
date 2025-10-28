'use client';

import { Wallet } from '../wallet';
import SignInForm from './SignInForm';


const Page = () => {
  return (
    <div className="h-screen w-full items-center flex flex-col text-white justify-center bg-gray-800">
      <Wallet>
        <SignInForm />
      </Wallet>
    </div>
  );
};

export default Page;
