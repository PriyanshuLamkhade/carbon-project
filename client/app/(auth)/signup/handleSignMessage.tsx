"use client";
import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useRouter } from "next/navigation";
import {  useRef, useState } from "react";

export function SignUpForm() {
  const [signedMessage, setSignedMessage] = useState<Uint8Array>();
  const [nonce, setNonce] = useState<string>();
  const { publicKey, signMessage } = useWallet();
  const router = useRouter();
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const organisationRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-10 mt-5">
      <Button
        text="Verify Wallet"
        variant="secondary"
        size="md"
        onClick={() => {
          getNonce();
        }}
      />
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
          placeholder="Enter Organisation Name"
        />
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
          <span
            className="text-blue-700 cursor-pointer hover:text-blue-900"
            onClick={() => {
              router.push("/signin");
            }}
          >
            Already have a account?
          </span>
        </span>
      </div>
    </div>
  );
  async function getNonce() {
    if (publicKey) {
      if (!signMessage) {
        console.log(signMessage);
        return;
      }
      const nonceRes = await fetch("http://localhost:4000/users/auth/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pubkey: publicKey.toString() }),
      });
      const json = await nonceRes.json();
      setNonce(json.nonce);
      const message = `Please sign this message to verify ownership.\nNonce: ${json.nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      setSignedMessage(signature);
    }
  }
  async function submitForm() {
  try {
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value;
    const phonenumber = phoneNumberRef.current?.value;
    const organisation = organisationRef.current?.value;

    if (!publicKey) return null;

    const response = await fetch("http://localhost:4000/users/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        surname,
        phonenumber,
        organisation,
        pubkey: publicKey.toString(),
        signature: signedMessage ? bs58.encode(signedMessage) : null,
        nonce,
      }),
    });

    return response;
  } catch (error) {
    console.error("Error during signup:", error);
    return null;
  }
}

}
