import { Wallet } from "../wallet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { SignUpForm } from "./handleSignMessage";

const page = () => {
  return (
    <div className=" h-screen w-full items-center">
     <h1 className="font-extrabold text-2xl">First Step:</h1>
      
      <Wallet>
        
        <SignUpForm />
      </Wallet>
      
      
    </div>
  );
};


export default page;
