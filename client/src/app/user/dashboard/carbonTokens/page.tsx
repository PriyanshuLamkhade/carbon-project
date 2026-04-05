"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import marketAbi from "@/constants/abi/C2Marketplace.json";
import tokenAbi from "@/constants/abi/C2Token.json";

const MARKET_ADDRESS = "0xA652aB3fd76959b17cFBF5c88b56DaeFAfaf7A01";
const TOKEN_ADDRESS = "0xA6Acb30270e8375e68Eb15D96D3760116e579d40";

export default function SellerDashboard() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [listings, setListings] = useState<any[]>([]);

  const getProvider = () =>
    new ethers.BrowserProvider(window.ethereum);

  // 🔌 Connect wallet
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  // 💰 Fetch balance
  const fetchBalance = async () => {
    if (!account) return;

    const provider = getProvider();
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi as any, provider);

    const bal = await token.balanceOf(account);
    setBalance(ethers.formatUnits(bal, 18));
  };

  // 📊 Fetch my listings
  const fetchMyListings = async () => {
    const provider = getProvider();
    const market = new ethers.Contract(MARKET_ADDRESS, marketAbi as any, provider);

    let arr = [];

    for (let i = 1; i <= 20; i++) {
      try {
        const l = await market.listings(i);

        if (l[0].toLowerCase() === account.toLowerCase() && l[3]) {
          arr.push({
            id: i,
            amount: l[1],
            price: l[2],
          });
        }
      } catch {}
    }

    setListings(arr);
  };

  useEffect(() => {
    if (account) {
      fetchBalance();
      fetchMyListings();
    }
  }, [account]);

  // 🏪 List tokens
  const listTokens = async () => {
    if (!amount || !price) {
      alert("Enter values");
      return;
    }

    const provider = getProvider();
    const signer = await provider.getSigner();

    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi as any, signer);
    const market = new ethers.Contract(MARKET_ADDRESS, marketAbi as any, signer);

    const amt = ethers.parseUnits(amount, 18);
    const priceWei = ethers.parseUnits(price, "ether");

    // approve first
    await (await token.approve(MARKET_ADDRESS, amt)).wait();

    // list
    await (await market.listTokens(amt, priceWei)).wait();

    alert("Listed successfully!");

    setAmount("");
    setPrice("");

    fetchBalance();
    fetchMyListings();
  };

  // ❌ Cancel listing
  const cancelListing = async (id: number) => {
    const provider = getProvider();
    const signer = await provider.getSigner();

    const market = new ethers.Contract(MARKET_ADDRESS, marketAbi as any, signer);

    await (await market.cancelListing(id)).wait();

    alert("Listing cancelled");

    fetchMyListings();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white py-5 -m-5">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">🌱 Listing Your Tokens</h1>

          {!account ? (
            <button
              onClick={connectWallet}
              className="bg-blue-600 px-4 py-2 rounded"
            >
              Connect Wallet
            </button>
          ) : (
            <div>
              <p className="text-sm text-gray-400">
                {account.slice(0, 6)}...
              </p>
              <p className="font-bold">{balance} C2</p>
            </div>
          )}
        </div>

        {/* LIST FORM */}
        <div className="bg-gray-900 p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">
            List Carbon Credits
          </h2>

          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full"
            />

            <input
              type="number"
              placeholder="Price (ETH)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="bg-gray-800 p-2 rounded w-full"
            />

            <button
              onClick={listTokens}
              className="bg-green-600 px-6 rounded"
            >
              List
            </button>
          </div>
        </div>

        {/* MY LISTINGS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            My Listings
          </h2>

          {listings.length === 0 && (
            <p className="text-gray-400">No listings yet</p>
          )}

          <div className="space-y-4">
            {listings.map((l) => (
              <div
                key={l.id}
                className="bg-gray-900 p-4 rounded flex justify-between"
              >
                <div>
                  <p>ID: {l.id}</p>
                  <p>
                    {ethers.formatUnits(l.amount, 18)} C2
                  </p>
                  <p>
                    {ethers.formatUnits(l.price, "ether")} ETH
                  </p>
                </div>

                <button
                  onClick={() => cancelListing(l.id)}
                  className="bg-red-600 px-4 rounded"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}