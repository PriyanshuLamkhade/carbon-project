"use client";

import { authService } from "@/app/page";
import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck,
  Coins,
  Leaf,
  ExternalLink,
  Search,
  X,
} from "lucide-react";

interface BlockchainRecord {
  monitoringId: number;
  historyId: number;
  location: string;
  year: number;
  annualCO2: number;
  survivalRate: number;
  plantationHealth: string;
  waterCondition: string;
  soilQuality: string;
  remarks: string;
  tokensIssued: number;
  txHash: string;
  metadataHash: string;
  metadataJson: any;
  mintedAt: string;
}

export default function BlockchainRegistryPage() {

  const [records, setRecords] =
    useState<BlockchainRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [selected, setSelected] =
    useState<BlockchainRecord | null>(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {

    async function fetchData() {

      try {

        const res = await fetch(
          `${authService}/admin/public/blockchain-records`
        );

        const data = await res.json();

        setRecords(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);
      }
    }

    fetchData();

  }, []);

  const filteredRecords = useMemo(() => {

    return records.filter((r) =>
      r.location
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }, [records, search]);

  const totalTokens =
    records.reduce(
      (acc, r) =>
        acc + Number(r.tokensIssued || 0),
      0
    );

  const totalCO2 =
    records.reduce(
      (acc, r) =>
        acc + Number(r.annualCO2 || 0),
      0
    );

  if (loading) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center text-white text-3xl font-bold">

        Loading Registry...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-slate-950 to-slate-900 text-white px-6 py-10">

      {/* HERO */}
      <div className="max-w-7xl mx-auto mb-14">

        <div className="inline-flex items-center gap-3 bg-green-500/10 border border-green-500/20 px-5 py-2 rounded-full mb-6">

          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />

          <span className="text-green-300 font-semibold text-sm tracking-wide">

            ETHEREUM SEPOLIA VERIFIED

          </span>

        </div>

        <h1 className="text-5xl md:text-6xl font-black max-w-5xl leading-tight mb-6">

          Public Carbon Registry

        </h1>

        <p className="text-gray-400 text-lg max-w-3xl leading-relaxed">

          Transparent blockchain-backed carbon monitoring
          records secured on Ethereum Sepolia.

        </p>

      </div>

      {/* STATS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-5">

            <div className="bg-cyan-500/10 p-3 rounded-2xl">
              <ShieldCheck className="text-cyan-400" />
            </div>

          </div>

          <p className="text-gray-400 mb-2">
            Verified Monitoring Records
          </p>

          <h2 className="text-5xl font-black text-cyan-400">

            {records.length}

          </h2>

        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-5">

            <div className="bg-green-500/10 p-3 rounded-2xl">
              <Coins className="text-green-400" />
            </div>

          </div>

          <p className="text-gray-400 mb-2">
            Carbon Tokens Issued
          </p>

          <h2 className="text-5xl font-black text-green-400">

            {totalTokens}

          </h2>

        </div>

        {/* CARD */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7 backdrop-blur-xl">

          <div className="flex items-center justify-between mb-5">

            <div className="bg-purple-500/10 p-3 rounded-2xl">
              <Leaf className="text-purple-400" />
            </div>

          </div>

          <p className="text-gray-400 mb-2">
            Annual CO₂ Offset
          </p>

          <h2 className="text-5xl font-black text-purple-400">

            {totalCO2.toFixed(2)}

          </h2>

        </div>

      </div>

      {/* SEARCH */}
      <div className="max-w-7xl mx-auto mb-10">

        <div className="relative">

          <Search
            className="absolute left-4 top-3.5 text-gray-500"
            size={18}
          />

          <input
            type="text"
            placeholder="Search project location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 outline-none focus:border-cyan-500 text-white"
          />

        </div>

      </div>

      {/* GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {filteredRecords.map((record) => (

          <div
            key={record.monitoringId}
            className="group relative overflow-hidden bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-xl hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1"
          >

            {/* GLOW */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />

            {/* BADGES */}
            <div className="flex flex-wrap gap-2 mb-5">

              <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-bold">

                VERIFIED

              </div>

              <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs font-bold">

                {record.year}

              </div>

            </div>

            {/* TITLE */}
            <h2 className="text-2xl font-black leading-tight mb-2">

              {record.location}

            </h2>

            <p className="text-gray-500 text-sm mb-6">

              Monitoring ID #{record.monitoringId}

            </p>

            {/* METRICS */}
            <div className="space-y-4 mb-8">

              <div className="flex items-center justify-between">

                <p className="text-gray-400">
                  Annual CO₂
                </p>

                <h3 className="text-green-400 font-black text-xl">

                  {record.annualCO2}

                </h3>

              </div>

              <div className="flex items-center justify-between">

                <p className="text-gray-400">
                  Tokens
                </p>

                <h3 className="text-cyan-400 font-black text-xl">

                  {record.tokensIssued}

                </h3>

              </div>

              <div className="flex items-center justify-between">

                <p className="text-gray-400">
                  Survival
                </p>

                <h3 className="text-purple-400 font-black text-xl">

                  {record.survivalRate}%

                </h3>

              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={() => setSelected(record)}
              className="w-full bg-cyan-600 hover:bg-cyan-500 transition-all duration-300 py-3 rounded-2xl font-bold"
            >

              View Blockchain Details

            </button>

          </div>
        ))}

      </div>

      {/* EMPTY */}
      {filteredRecords.length === 0 && (

        <div className="text-center py-24">

          <h2 className="text-5xl font-black mb-5">
            No Records Found
          </h2>

          <p className="text-gray-400 text-xl">
            Try another search.
          </p>

        </div>

      )}

      {/* MODAL */}
      {selected && (

        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 overflow-auto p-6">

          <div className="max-w-5xl mx-auto bg-slate-950 border border-white/10 rounded-[2rem] p-8 relative">

            {/* CLOSE */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-6 right-6 bg-white/5 hover:bg-white/10 p-3 rounded-xl"
            >

              <X size={20} />

            </button>

            {/* HEADER */}
            <div className="mb-10">

              <div className="flex gap-3 mb-5">

                <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 px-4 py-1 rounded-full text-xs font-bold">

                  BLOCKCHAIN VERIFIED

                </div>

                <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-1 rounded-full text-xs font-bold">

                  YEAR {selected.year}

                </div>

              </div>

              <h2 className="text-5xl font-black mb-3">

                {selected.location}

              </h2>

              <p className="text-gray-400">

                Monitoring ID #{selected.monitoringId}

              </p>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">

              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm mb-2">

                  Annual CO₂

                </p>

                <h3 className="text-4xl font-black text-green-400">

                  {selected.annualCO2}

                </h3>

              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm mb-2">

                  Tokens

                </p>

                <h3 className="text-4xl font-black text-cyan-400">

                  {selected.tokensIssued}

                </h3>

              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm mb-2">

                  Survival

                </p>

                <h3 className="text-4xl font-black text-purple-400">

                  {selected.survivalRate}%

                </h3>

              </div>

              <div className="bg-black/30 border border-white/10 rounded-2xl p-5">

                <p className="text-gray-400 text-sm mb-2">

                  Health

                </p>

                <h3 className="text-2xl font-black text-orange-300">

                  {selected.plantationHealth}

                </h3>

              </div>

            </div>

            {/* HASHES */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-10">

              {/* TX */}
              <div className="bg-black/40 border border-cyan-500/10 rounded-2xl p-6">

                <p className="text-gray-400 text-sm mb-3">

                  Sepolia Transaction

                </p>

                <a
                  href={`https://sepolia.etherscan.io/tx/${selected.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-400 break-all text-sm font-mono hover:text-cyan-300 flex items-center gap-2"
                >

                  View on Etherscan

                  <ExternalLink size={16} />

                </a>

              </div>

              {/* HASH */}
              <div className="bg-black/40 border border-green-500/10 rounded-2xl p-6">

                <p className="text-gray-400 text-sm mb-3">

                  Metadata Integrity Hash

                </p>

                <p className="text-green-400 break-all text-sm font-mono">

                  {selected.metadataHash}

                </p>

              </div>

            </div>

            {/* JSON */}
            <div className="bg-black/50 border border-white/10 rounded-3xl overflow-hidden">

              <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">

                <h3 className="text-xl font-bold">

                  Immutable Metadata JSON

                </h3>

                <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-1 rounded-full text-xs font-bold">

                  VERIFIED

                </div>

              </div>

              <pre className="overflow-auto p-6 text-sm text-gray-300 whitespace-pre-wrap">

                {JSON.stringify(
                  selected.metadataJson,
                  null,
                  2
                )}

              </pre>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}