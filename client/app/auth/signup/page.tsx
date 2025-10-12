import { Wallet } from "../wallet";
import { SignUpForm } from "./handleSignMessage";

const page = () => {
  return (
    <div className=" h-screen w-full items-center flex flex-col justify-center bg-amber-200">
     
      <Wallet>
        
        <SignUpForm />
      </Wallet>
      
      
    </div>
  );
};


export default page;
