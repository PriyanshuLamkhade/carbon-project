"use client";

import { authService } from "@/app/page";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  MapPin,
  Trees,
  ShieldCheck,
  ArrowRight,
  Clock3,
  CheckCircle2,
  Activity,
} from "lucide-react";

export default function ActiveSubmissions() {
  const [data, setData] = useState<any[]>([]);

  const router = useRouter();

  const fetchData = async () => {
    const res = await fetch(`${authService}/validator/assignments/active`, {
      credentials: "include",
    });

    const d = await res.json();

    setData(d);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6 -m-5">
      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 rounded-3xl p-8 shadow-2xl mb-8">
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Activity className="text-cyan-300" size={36} />

              <h1 className="text-5xl font-black">Active Verifications</h1>
            </div>

            <p className="text-white/80 text-lg max-w-2xl">
              Continue field verification and environmental assessment for
              assigned projects
            </p>
          </div>

          {/* STATS */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-5 border border-white/10">
            <p className="text-sm text-white/70">Active Projects</p>

            <h2 className="text-5xl font-black mt-2">{data.length}</h2>
          </div>
        </div>
      </div>

      {/* EMPTY */}
      {data.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">
          <div className="flex justify-center mb-5">
            <Clock3 size={70} className="text-slate-500" />
          </div>

          <h2 className="text-3xl font-bold mb-3">No Active Verifications</h2>

          <p className="text-gray-400">Accepted assignments will appear here</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {data.map((a) => (
          <div
            key={a.assignmentId}
            className="group bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-7 shadow-xl hover:border-cyan-500 transition-all duration-300 hover:-translate-y-1"
          >
            {/* TOP */}
            <div className="flex justify-between items-start gap-5 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-500/10 p-3 rounded-2xl">
                    <MapPin className="text-cyan-400" size={24} />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {a.submission.location}
                    </h2>

                    <p className="text-gray-400 text-sm mt-1">
                      Submission #{a.SubmissionID}
                    </p>
                  </div>
                </div>
              </div>

              {/* STATUS */}
              <div className="bg-green-500/10 text-green-300 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                IN PROGRESS
              </div>
            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-5 mb-8">
              {/* AREA */}
              <div className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <Trees className="text-green-400" size={22} />

                  <p className="text-sm text-gray-400">Area</p>
                </div>

                <h3 className="text-3xl font-black text-green-400">
                  {a.submission.area || 0}
                </h3>

                <p className="text-sm text-gray-500 mt-1">hectares</p>
              </div>

              {/* STATUS CARD */}
              <div className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                  <ShieldCheck className="text-purple-400" size={22} />

                  <p className="text-sm text-gray-400">Verification</p>
                </div>

                <h3 className="text-xl font-bold text-purple-300">
                  Field Review
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Pending final validation
                </p>
              </div>
            </div>

            {/* FOOTER */}
            <button
              onClick={() =>
                router.push(
                  a.isMonitoring
                    ? `/validator/review/${a.SubmissionID}?historyId=${a.HistoryId}&mode=monitor`
                    : `/validator/review/${a.SubmissionID}?historyId=${a.HistoryId}`,
                )
              }
              className="w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl py-4 font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >
              <ShieldCheck size={22} />
              Continue Verification
              <ArrowRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
