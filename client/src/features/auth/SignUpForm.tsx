"use client";


import Button from "@/components/ui/Button";
import InputBox from "@/components/ui/InputBox";
import { useRouter } from "next/navigation";
import {  useRef, useState } from "react";

export function SignUpForm() {

  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const organisationRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-10 mt-5">

      <div className="flex flex-col gap-2">
        <label>Name:</label>
        <InputBox ref={nameRef} placeholder="Enter Your Name" />

        <label>Surname:</label>
        <InputBox ref={surnameRef} placeholder="Enter Your Surname" />

        <label>PhoneNumber:</label>
        <InputBox ref={phoneNumberRef} placeholder="Enter Phone Number" />
        <label>Organisation:</label>
        <InputBox
          ref={organisationRef}
          placeholder="Enter Organisation Name"/>
        <label>Email:</label>
        <InputBox ref={emailRef} placeholder="Enter Email" />

        <label>Password:</label>
        <InputBox ref={passwordRef} placeholder="Enter Password" type="password"/>

        <span className="relative">
          <Button
            className={"mt-4"}
            text="Submit"
            variant="primary"
            size="md"
            onClick={async () => {
              const res = await submitForm();
              if (res && res.ok) {
                router.push("/user/dashboard/home");
              } else {
                console.error("Signup failed");
              
              }
            }}
          />
          <br />
        </span>
          <span
            className="text-blue-500 cursor-pointer hover:text-blue-900"
            onClick={() => {
              router.push("/sign-in");
            }}
          >
            Already have a account?
          </span>
          <span
        className="text-blue-500 cursor-pointer hover:text-blue-900 mt-2"
        onClick={() => router.push("/admin-sign-in")}
      >
        Sign in as admin
      </span>
      </div>
    </div>
  );
  
  async function submitForm() {
  try {
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value;
    const phonenumber = phoneNumberRef.current?.value;
    const organisation = organisationRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;



    const response = await fetch("http://localhost:4000/users/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        surname,
        phonenumber,
        organisation,
        email,
        password,
      }),
      credentials: "include",
    });
    console.log("Signup response:", response);
    return response;
  } catch (error) {
    console.error("Error during signup:", error);
    return null;
  }
}

}
