"use client";
import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useEffect, useRef, useState } from "react";

export function SignUpForm() {
  const [signedMessage, setSignedMessage] = useState<Uint8Array >();
  const [nonce, setNonce] = useState<string >();

  const { publicKey, signMessage } = useWallet();
  const nameRef = useRef<HTMLInputElement>(null);
  const surnameRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const organisationRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-10 mt-5">
      <Button
        text="Get Nonce"
        variant="secondary"
        size="md"
        onClick={() => {
          getNonce();
        }}
      />
      <div className="flex flex-col gap-2">
       
     
        <label>Name:</label>
        <InputBox reference={nameRef} placeholder="Enter Your Name" />

        <label>Surname:</label>
        <InputBox reference={surnameRef} placeholder="Enter Your Surname" />

        <label>PhoneNumber:</label>
        <InputBox reference={phoneNumberRef} placeholder="Enter Phone Number" />
        <label>Organisation:</label>
        <InputBox
          reference={organisationRef}
          placeholder="Enter Organisation Name"
        />
        <span className="relative">

        <Button className={"mt-4"}
          text="Submit"
          variant="primary"
          size="md"
          onClick={() => {
            submitForm();
          }}
        />
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
      setNonce(json.nonce)
      const message = `Please sign this message to verify ownership.\nNonce: ${json.nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      setSignedMessage(signature)
    }
  }
  async function submitForm() {
    let signupRes;
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value;
    const phonenumber = phoneNumberRef.current?.value;
    const organisation = organisationRef.current?.value;
    if (publicKey) {
      signupRes = await fetch("http://localhost:4000/users/auth/signup", {
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
    }
    return signupRes;
  }
}
  