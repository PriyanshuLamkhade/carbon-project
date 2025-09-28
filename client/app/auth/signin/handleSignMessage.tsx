"use client";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import bs58 from "bs58";
import { useState } from "react";

export function HandleSignMessage() {
  const { publicKey, signMessage } = useWallet();
  const [visibleForm,setVisibleForm] = useState<Boolean>(false)

  async function getNonce() {
    
    if (!publicKey) {
      console.log(publicKey)
      return;
    }
    if (!signMessage) {
      console.log(signMessage)
      return;
    }
    const nonceRes = await fetch("http://localhost:4000/users/auth/nonce",{
      method:"POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({wallet:publicKey.toString() })
    });
    const { nonce } = await nonceRes.json();

    const message = `Please sign this message to verify ownership.\nNonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await signMessage(encodedMessage);
    
    console.log(signedMessage)

    const verifyRes = await fetch("http://localhost:4000/users/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: publicKey.toString(),
        signature: bs58.encode(signedMessage),
        nonce,
      }),
      credentials: "include",
    });
    const data = await verifyRes.json();
    if(data.message === "new user"){
      setVisibleForm(true)
    }
  }

  return (
    <div>
      <button className="bg-blue-600 p-2" onClick={getNonce}>
        Sign message
      </button>
      {visibleForm &&  <form action="submit">
        <label >Name:</label>
        <input type="text" placeholder="Enter Name" />
        <label >Email:</label>
        <input type="text" placeholder="Enter Email" />
        <label >Phone No:</label>
        <input type="text" placeholder="Enter number" />
        <label >something:</label>
        <input type="text" placeholder="Enter something" />
      </form>}
    </div>  
  );
}
