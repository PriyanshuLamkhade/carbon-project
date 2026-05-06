"use client";

import { authService } from "@/app/page";
import { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Trees,
  Clock3,
  CheckCircle2,
  XCircle,
  ShieldCheck,
} from "lucide-react";

interface Assignment {
  assignmentId: number;
  status: string;
  deadline: string;

  submission: {
    submissionId: number;
    location: string;
    area: number;
  };
}

export default function AvailableSubmissions() {

  const [assignments, setAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = async () => {
    const res = await fetch(
      `${authService}/validator/assignments/available`,
      {
        credentials: "include",
      }
    );

    const data = await res.json();

    setAssignments(data);
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAccept = async (id: number) => {
    await fetch(
      `${authService}/validator/assignment/${id}/accept`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    fetchAssignments();
  };

  const handleReject = async (id: number) => {
    await fetch(
      `${authService}/validator/assignment/${id}/reject`,
      {
        method: "POST",
        credentials: "include",
      }
    );

    fetchAssignments();
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-white p-6 -m-5">

      {/* 🔥 HERO */}
      <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 rounded-3xl p-8 shadow-2xl mb-8">

        <div className="flex justify-between items-center flex-wrap gap-6">

          <div>

            <div className="flex items-center gap-3 mb-3">

              <ShieldCheck className="text-green-300" size={36} />

              <h1 className="text-5xl font-black">
                Validator Assignments
              </h1>

            </div>

            <p className="text-white/80 text-lg max-w-2xl">
              Review and manage environmental verification requests assigned to you
            </p>

          </div>

          <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-6 py-5 border border-white/10">

            <p className="text-sm text-white/70">
              Available Requests
            </p>

            <h2 className="text-5xl font-black mt-2">
              {assignments.length}
            </h2>

          </div>

        </div>

      </div>

      {/* EMPTY */}
      {assignments.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-16 text-center">

          <div className="flex justify-center mb-5">

            <Clock3 size={70} className="text-slate-500" />

          </div>

          <h2 className="text-3xl font-bold mb-3">
            No Assignments Available
          </h2>

          <p className="text-gray-400">
            New verification requests will appear here
          </p>

        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {assignments.map((a) => {

          const daysLeft = Math.ceil(
            (
              new Date(a.deadline).getTime() -
              Date.now()
            ) /
              (1000 * 60 * 60 * 24)
          );

          return (
            <div
              key={a.assignmentId}
              className="group bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-7 shadow-xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-1"
            >

              {/* TOP */}
              <div className="flex justify-between items-start gap-5 mb-6">

                <div>

                  <div className="flex items-center gap-3">

                    <div className="bg-purple-600/20 p-3 rounded-2xl">

                      <MapPin className="text-purple-400" size={24} />

                    </div>

                    <div>

                      <h2 className="text-2xl font-bold">
                        {a.submission.location}
                      </h2>

                      <p className="text-gray-400 text-sm mt-1">
                        Submission #{a.submission.submissionId}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="bg-blue-500/10 text-blue-300 border border-blue-500/20 px-4 py-2 rounded-xl text-sm font-semibold">

                  {a.status}

                </div>

              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-5 mb-8">

                {/* AREA */}
                <div className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700">

                  <div className="flex items-center gap-3 mb-3">

                    <Trees className="text-green-400" size={22} />

                    <p className="text-sm text-gray-400">
                      Area
                    </p>

                  </div>

                  <h3 className="text-3xl font-black text-green-400">
                    {a.submission.area || 0}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    hectares
                  </p>

                </div>

                {/* DEADLINE */}
                <div className="bg-slate-800/70 rounded-2xl p-5 border border-slate-700">

                  <div className="flex items-center gap-3 mb-3">

                    <Calendar className="text-orange-400" size={22} />

                    <p className="text-sm text-gray-400">
                      Deadline
                    </p>

                  </div>

                  <h3 className="text-xl font-bold text-orange-300">
                    {new Date(
                      a.deadline
                    ).toLocaleDateString()}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {daysLeft} days remaining
                  </p>

                </div>

              </div>

              {/* FOOTER */}
              <div className="flex gap-4">

                {/* ACCEPT */}
                <button
                  onClick={() =>
                    handleAccept(a.assignmentId)
                  }
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400 rounded-2xl py-4 font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-green-500/20"
                >

                  <CheckCircle2 size={22} />

                  Accept Assignment

                </button>

                {/* REJECT */}
                <button
                  onClick={() =>
                    handleReject(a.assignmentId)
                  }
                  className="flex-1 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 rounded-2xl py-4 font-bold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-red-500/20"
                >

                  <XCircle size={22} />

                  Reject

                </button>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}