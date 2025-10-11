"use client";
import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";
import { useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useEffect, useRef, useState } from "react";

export function SignUpForm() {
  const { publicKey, signMessage } = useWallet();
  const nameRef = useRef<HTMLInputElement>(null)
  const surnameRef = useRef<HTMLInputElement>(null)
  const phoneNumberRef = useRef<HTMLInputElement>(null)
  const organisationRef = useRef<HTMLInputElement>(null)
  // let hasSentRequest = useRef(false);
  // useEffect(()=>{
  //   if(publicKey){
  //     hasSentRequest.current = true;
  //   }
  // },[publicKey])

  return (
    //pubkey, signature, nonce, name, surname, phonenumber, organisation
    <div className="flex flex-col gap-10 mt-5">
      <Button
        text="Get Nonce"
        varient="secondary"
        size="md"
        onClick={() => {
          getNonce();
        }}
      />
      <div className="flex flex-col">
        <h1 className="font-extrabold text-2xl">Second Step:</h1>
        <br />
        <label>Name:</label>
        <InputBox reference={nameRef} placeholder="Enter Your Name" />

        <label>Surname:</label>
        <InputBox reference={surnameRef} placeholder="Enter Your Name" />

        <label>PhoneNumber:</label>
        <InputBox reference={phoneNumberRef} placeholder="Enter Phone Number" />
        <label>Organisation:</label>
        <InputBox reference={organisationRef} placeholder="Enter Organisation Name" />
        <Button
        text="Submit"
        varient="primary"
        size="md"
        onClick={() => {
          submitForm()
        }}
      />
      </div>
    </div>
  );
  async function getNonce() {
    if(!publicKey){
      console.log("Connect the wallet first")
    }
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
      const { nonce } = await nonceRes.json();

      const message = `Please sign this message to verify ownership.\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await signMessage(encodedMessage);

      console.log(signedMessage);
    }
  }
  async function submitForm(){
    const name = nameRef.current?.value;
    const surname = surnameRef.current?.value
    const phonenumber = phoneNumberRef.current?.value
    const organisation = organisationRef.current?.value

    console.log(organisation +" "+ surname +" "+ name+" "+ phonenumber)
  }
}
