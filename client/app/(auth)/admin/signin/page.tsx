"use client"
import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const page = () => {

      const nameRef = useRef<HTMLInputElement>(null);
      const surnameRef = useRef<HTMLInputElement>(null);
      const emailRef = useRef<HTMLInputElement>(null);
      const phonenumberRef = useRef<HTMLInputElement>(null);
      const passwordRef = useRef<HTMLInputElement>(null);
      const router = useRouter();
  return (
    <div className="h-screen w-full items-center flex flex-col text-white justify-center bg-gray-800">
      <div className=" flex flex-col mt-10 gap-3 ">
        <label>Name:<InputBox ref={nameRef} placeholder="Enter Your Name" /></label>
        <label>Surname:<InputBox ref={surnameRef} placeholder="Enter Your Surname" /></label>
        <label>Email:<InputBox ref={emailRef} placeholder="Enter Your Email" /></label>
        <label>PhoneNumber:<InputBox ref={phonenumberRef} placeholder="Enter Your PhoneNumber" /></label>
        <label>Password:<InputBox ref={passwordRef} placeholder="Enter Your Password" type="password"/></label>

      </div>
       <Button
          size="md"
          variant="primary"
          onClick={async () => {
            const res = await signIn();
            if (res && res.ok) {
              router.push("/admin/dashboard/home");
            } else {
              console.error("Sign-in failed");
            }
          }}
          text="Submit"
          className="mt-5 mb-5"
        />
      <span
          className="text-blue-700 cursor-pointer hover:text-blue-900"
          onClick={() => {
            router.push("/signin");
          }}
        >
          Not a Admin?
        </span>
    </div>
  );
  async function signIn() {
    try {
      const name = nameRef.current?.value;

      const signInRes = await fetch("http://localhost:4000/admin/auth/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:nameRef.current?.value, 
          surname:surnameRef.current?.value, 
          phonenumber:phonenumberRef.current?.value, 
          email:emailRef.current?.value, 
          password:passwordRef.current?.value
        }),
        credentials: "include",
      });

      return signInRes;
    } catch (err) {
      console.error("Error during sign-in:", err);
      return null;
    }
  }
};

export default page;
