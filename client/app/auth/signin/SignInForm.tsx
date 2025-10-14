"use client";

import Button from "@/app/components/ui/Button";
import InputBox from "@/app/components/ui/InputBox";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import bs58 from "bs58";

const SignInForm = () => {
  const [signedMessage, setSignedMessage] = useState<Uint8Array>();
  const [response, setResponse] = useState();
  const [nonce, setNonce] = useState<string>();
  const { publicKey, signMessage } = useWallet();
  const nameRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  return (
    <div className="mt-10 gap-3">
      <Button
        className="mb-5"
        text="Get Nonce"
        variant="secondary"
        size="md"
        onClick={() => {
          getNonce();
        }}
      />
      <label>Name:</label>
      <br />
      <InputBox reference={nameRef} placeholder="Enter Your Name" />
      <br />

      <Button
        size="md"
        variant="primary"
        onClick={async () => {
          const res = await signIn();
          if (res && res.ok) {
            router.push("/dashboard/home");
          } else {
            console.error("Sign-in failed");
            
          }
        }}
        text="Submit"
        className="mt-5 mb-5"
      />
      <h3
        className="text-blue-700 cursor-pointer hover:text-blue-900"
        onClick={() => {
          router.push("/auth/signup");
        }}
      >
        Don't have a account?
      </h3>
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
        credentials: "include",
      });
      const json = await nonceRes.json();
      setNonce(json.nonce);
      const message = `Please sign this message to verify ownership.\nNonce: ${json.nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);
      setSignedMessage(signature);
    }
  }

  async function signIn() {
    try {
      const name = nameRef.current?.value;
      if (!publicKey) return null;

      const signInRes = await fetch("http://localhost:4000/users/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          pubkey: publicKey.toString(),
          signature: signedMessage ? bs58.encode(signedMessage) : null,
          nonce,
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

export default SignInForm;
