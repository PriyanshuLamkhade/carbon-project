"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

export function HandleSignMessage() {
  const { publicKey, signMessage } = useWallet();
  

  async function getNonce() {
    
    if (!publicKey) {
      console.log(publicKey)
      return;
    }
    if (!signMessage) {
      console.log(signMessage)
      return;
    }
    const nonceRes = await fetch("http://localhost:4000/users/auth/nonce");
    const { nonce } = await nonceRes.json();

    const message = `Please sign this message to verify ownership.\nNonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await signMessage(encodedMessage);
    
    console.log(signedMessage)

    // const verifyRes = await fetch("http://localhost:4000/api/auth/verify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     wallet: publicKey.toString(),
    //     signature: bs58.encode(signedMessage),
    //     nonce,
    //   }),
    //   credentials: "include",
    // });
    // const data = await verifyRes.json();
    // if (data.success) {
    //   console.log("✅ Authenticated!");
    // } else {
    //   console.error("❌ Verification failed");
    // }
  }

  return (
    <div>
      <button className="bg-blue-600 p-2" onClick={getNonce}>
        Sign message
      </button>
    </div>  
  );
}
