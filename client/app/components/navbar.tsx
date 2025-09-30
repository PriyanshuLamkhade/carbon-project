import React from "react";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";


export const Navbar = () => {
  const router = useRouter();


  return (
    <div
      className="transition-all hidden fix sm:flex justify-between items-baseline py-6 text-sm md:text px-4 md:px-8 border
       border-[#c0bebe] backdrop-filter backdrop-blur-lg rounded-full translate-y-4 md:w-[90vw] mx-auto"

    >
      <h1 className="text-2xl font-extrabold">LayerZero</h1>

      <div className="flex gap-10 text-xl font-bold ">
        {["Home", "About", "Features", "FAQ"].map((item) => (
          <h4
            key={item}
            className="cursor-pointer"
          >
            {item}
          </h4>
        ))}
      </div>

      <div className="flex gap-5">
        
          <Button
            text="Login"
            varient="primary"
            size="sm"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        

        <div >
          <Button
            text="DashBoard"
            varient="secondary"
            size="sm"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        </div>
      </div>
    </div>
  );
};
