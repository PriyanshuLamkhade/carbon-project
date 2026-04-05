"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import marketAbi from "@/constants/abi/C2Marketplace.json";
import tokenAbi from "@/constants/abi/C2Token.json";

const MARKET_ADDRESS = "0xA652aB3fd76959b17cFBF5c88b56DaeFAfaf7A01";
const TOKEN_ADDRESS = "0xA6Acb30270e8375e68Eb15D96D3760116e579d40";

export default function MarketplacePage() {
  const [account, setAccount] = useState("");
  const [listings, setListings] = useState<any[]>([]);
  const [balance, setBalance] = useState("0");
  const [buyAmount, setBuyAmount] = useState<{ [key: number]: string }>({});
  const [retireAmount, setRetireAmount] = useState("");
  const [retireReason, setRetireReason] = useState("");

  // 🔌 Connect Wallet
  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  };

  const getProvider = () => new ethers.BrowserProvider(window.ethereum);

  // 📊 Fetch listings
  const fetchListings = async () => {
    const provider = getProvider();
    const market = new ethers.Contract(MARKET_ADDRESS, marketAbi, provider);

    let arr = [];

    for (let i = 1; i <= 20; i++) {
      try {
        const l = await market.listings(i);
        if (l[3] && l[1] > 0n) {
          arr.push({
            id: i,
            seller: l[0],
            amount: l[1],
            pricePerToken: l[2],
            active: l[3],
          });
        }
      } catch {}
    }

    setListings(arr);
  };

  // 💰 Fetch balance
  const fetchBalance = async () => {
    const provider = getProvider();

    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, provider);

    const bal = await token.balanceOf(account);
    setBalance(ethers.formatUnits(bal, 18));
  };

  useEffect(() => {
    if (account) {
      fetchListings();
      fetchBalance();
    }
  }, [account]);

  // 🛒 Buy tokens
  const buyTokens = async (id: number, pricePerToken: bigint) => {
    const amountInput = buyAmount[id] || "0";

    if (!amountInput || Number(amountInput) <= 0) {
      alert("Enter valid amount");
      return;
    }

    const provider = getProvider();
    const signer = await provider.getSigner();
    const market = new ethers.Contract(MARKET_ADDRESS, marketAbi, signer);

    const amt = ethers.parseUnits(amountInput, 18);

    // ✅ correct formula
    const total = (amt * pricePerToken) / BigInt(1e18);

    const tx = await market.buy(id, amt, {
      value: total,
    });

    await tx.wait();
    alert("Purchase successful!");

    fetchListings();
    fetchBalance();
  };

  // 🔥 Retire tokens
  const retireTokens = async () => {
    if (!retireAmount || Number(retireAmount) <= 0) {
      alert("Invalid amount");
      return;
    }

    const provider = getProvider();
    const signer = await provider.getSigner();
    const token = new ethers.Contract(TOKEN_ADDRESS, tokenAbi, signer);

    const amt = ethers.parseUnits(retireAmount, 18);

    const tx = await token.retire(amt, retireReason || "retired");
    await tx.wait();

    alert("Tokens retired!");

    fetchBalance();
  };

 return (
  <div className="min-h-screen bg-gray-950 text-white p-6">
    <div className="max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          🌍 Carbon Marketplace
        </h1>

        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="text-right">
            <p className="text-sm text-gray-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </p>
            <p className="font-semibold">{balance} C2</p>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Total Listings</p>
          <p className="text-xl font-bold">{listings.length}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Your Balance</p>
          <p className="text-xl font-bold">{balance} C2</p>
        </div>

        <div className="bg-gray-900 p-4 rounded-xl">
          <p className="text-gray-400 text-sm">Network</p>
          <p className="text-xl font-bold">Sepolia</p>
        </div>
      </div>

      {/* LISTINGS */}
      <h2 className="text-xl font-semibold mb-4">
        Available Credits
      </h2>

      {listings.length === 0 && (
        <p className="text-gray-400">No listings available</p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {listings.map((l) => {
          const priceEth = ethers.formatUnits(
            l.pricePerToken,
            "ether"
          );

          return (
            <div
              key={l.id}
              className="bg-gray-900 p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              {/* TOP */}
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-400">
                  Listing #{l.id}
                </p>
                <span className="bg-green-600 text-xs px-2 py-1 rounded">
                  Active
                </span>
              </div>

              {/* DETAILS */}
              <div className="space-y-2 mb-4">
                <p>
                  <span className="text-gray-400">Amount:</span>{" "}
                  <b>{ethers.formatUnits(l.amount, 18)} C2</b>
                </p>

                <p>
                  <span className="text-gray-400">Price:</span>{" "}
                  <b>{priceEth} ETH</b>
                </p>
              </div>

              {/* BUY SECTION */}
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount"
                  className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
                  onChange={(e) =>
                    setBuyAmount({
                      ...buyAmount,
                      [l.id]: e.target.value,
                    })
                  }
                />

                <button
                  onClick={() =>
                    buyTokens(l.id, l.pricePerToken)
                  }
                  className="bg-green-600 hover:bg-green-700 px-4 rounded"
                >
                  Buy
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* RETIRE SECTION */}
      <div className="mt-12 bg-gray-900 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">
          🔥 Retire Carbon Credits
        </h2>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="number"
            placeholder="Amount"
            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
            onChange={(e) => setRetireAmount(e.target.value)}
          />

          <input
            type="text"
            placeholder="Reason (optional)"
            className="bg-gray-800 border border-gray-700 p-2 rounded w-full"
            onChange={(e) => setRetireReason(e.target.value)}
          />

          <button
            onClick={retireTokens}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded"
          >
            Retire
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
