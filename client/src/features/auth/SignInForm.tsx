"use client";


import Button from "@/components/ui/Button";
import InputBox from "@/components/ui/InputBox";
import { useRouter } from "next/navigation";
import { useRef } from "react";

const SignInForm = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
   async function signIn() {
    try {

      const signInRes = await fetch("http://localhost:4000/users/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name :nameRef.current?.value,
          email: emailRef.current?.value,
          password:passwordRef.current?.value,
        }),
        credentials: "include",
      });

      return signInRes;
    } catch (err) {
      console.error("Error during sign-in:", err);
      return null;
    }
  }
  return (
    <div className="mt-10 gap-3">
      <label>Name:</label>
      <br />
      <InputBox ref={nameRef} placeholder="Enter Your Name" />
      <br />
      <label>Email:</label>
      <br />
      <InputBox ref={emailRef} placeholder="Enter Your Name" />
      <br />
      <label>Password:</label>
      <br />
      <InputBox ref={passwordRef} placeholder="Enter Your Name" type="password" />
      <br />

      <Button
        size="md"
        variant="primary"
        onClick={async () => {
          const res = await signIn();
          if (res && res.ok) {
            router.push("/user/dashboard/home");
          } else {
            console.error("Sign-in failed");
          }
        }}
        text="Submit"
        className="mt-5 mb-5"
      />
      <span
        className="text-blue-700 cursor-pointer hover:text-blue-900 mr-3"
        onClick={() => {
          router.push("/sign-up");
        }}
      >
        Don't have a account?
      </span>
      <span
        className="text-blue-700 cursor-pointer hover:text-blue-900"
        onClick={() => {
          router.push("/admin-sign-in");
        }}
      >
        Signin as admin
      </span>
      
    </div>
  );

 
};

export default SignInForm;
