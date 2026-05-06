"use client";

import { authService } from "@/app/page";
import DetailedTable from "@/components/tables/DetailedTable";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";
import { useAppData } from "@/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Submission {
  HistoryId: number | null;
  SubmissionID: number | null;
  SubmittedBy: string | null;
  AreaClaimed: number | null;
  DateSubmitted: string | Date | null;
  Location: string | null;
  Status: string;
}

const ValidatorDashboard = () => {
  const { user } = useAppData()
  const [monitoringDue, setMonitoringDue] = useState([]);
  const [recentEntries, setRecentEntries] = useState<Submission[]>([]);
  const [counts, setCounts] = useState({
    PENDING: 0,
    INPROGRESS: 0,
    APPROVED: 0,
    REJECTED: 0,
  });

  const router = useRouter();

  useEffect(() => {
    async function getUserSubmission() {
      const response = await fetch(`${authService}/validator/dashboard/home`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setMonitoringDue(data.monitoringDue || []);
        setRecentEntries(data.recent_entries);
        setCounts(data.counts);
      } else {
        console.error("Failed to fetch user details", response.status);
      }
    }
    getUserSubmission();
  }, []);

  const cardData = [
    {
      title: (
        <span className="text-xl">
          Pending <br /> Areas
        </span>
      ),
      subtext: <p className="text-3xl font-extrabold">{counts.PENDING}</p>,
      body: "requests",
    },
    {
      title: (
        <span className="text-xl">
          In progress <br /> Areas
        </span>
      ),
      subtext: <p className="text-3xl font-extrabold">{counts.INPROGRESS}</p>,
      body: "requests",
    },
    {
      title: (
        <span className="text-xl">
          Accepted <br /> Areas
        </span>
      ),
      subtext: <p className="text-3xl font-extrabold">{counts.APPROVED}</p>,
      body: "requests",
    },
    {
      title: (
        <span className="text-xl">
          Rejected <br /> Areas
        </span>
      ),
      subtext: <p className="text-3xl font-extrabold">{counts.REJECTED}</p>,
      body: "requests",
    },
  ];

  return (
    <div className="space-y-6 text-white/90">
      <div
        id="top"
        className="flex justify-between items-center flex-wrap py-1"
      >
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.name}!</h1>
          <h2 className="text-xl">Keep Making Impact!</h2>
        </div>
        <Button
          size="md"
          variant="primary"
          text={"All Submissions"}
          onClick={() => router.push("/validator/dashboard/allsubmissions")}
        />
      </div>

      <div id="cards" className="flex flex-wrap justify-evenly py-3 gap-2">
        {cardData.map((card, idx) => (
          <Cards
            key={idx}
            className="h-60 w-72 text-white/80 bg-neutral-800"
            title={card.title}
            subtext={card.subtext}
            body={card.body}
          />
        ))}
      </div>

      <div>
        <h1 className="text-3xl font-bold mb-3 -mt-1">Recent Submission</h1>
        <DetailedTable
          rows={recentEntries}
          theme="dark"
          onReview={(row) => {
            if (row.SubmissionID) {
              // manually build the URL
              const url = `/validator/review/${row.SubmissionID}?historyId=${row.HistoryId}`;
              router.push(url);
            }
          }}
        />
      </div>
      {monitoringDue.length > 0 && (

  <div className="mt-8">

    {/* 🔥 HEADER */}
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">

      <div>

        <h2 className="text-4xl font-black text-white flex items-center gap-3">

          <span className="text-red-400">
            ⚠
          </span>

          Monitoring Due

        </h2>

        <p className="text-gray-400 mt-2">
          Annual environmental audits requiring field monitoring
        </p>

      </div>

      {/* COUNT */}
      <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-lg">

        <p className="text-sm opacity-80">
          Pending Monitoring
        </p>

        <h3 className="text-4xl font-black">
          {monitoringDue.length}
        </h3>

      </div>

    </div>

    {/* GRID */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {monitoringDue.map((item: any) => {

        const dueDate = new Date(item.dueDate);

        const daysLate = Math.floor(
          (
            Date.now() -
            dueDate.getTime()
          ) /
            (1000 * 60 * 60 * 24)
        );

        return (

          <div
            key={item.submissionId}
            className="group relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-7 shadow-2xl hover:border-red-500 transition-all duration-300 hover:-translate-y-1"
          >

            {/* GLOW */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 blur-3xl rounded-full" />

            {/* TOP */}
            <div className="relative flex justify-between items-start gap-4 mb-6">

              <div>

                <div className="flex items-center gap-3 mb-3">

                  <div className="bg-red-500/10 p-3 rounded-2xl border border-red-500/20">

                    <span className="text-2xl">
                      🌱
                    </span>

                  </div>

                  <div>

                    <h3 className="text-2xl font-bold text-white">
                      {item.location}
                    </h3>

                    <p className="text-gray-400 text-sm mt-1">
                      Submission #{item.submissionId}
                    </p>

                  </div>

                </div>

              </div>

              {/* STATUS */}
              <div className="bg-red-500/10 text-red-300 border border-red-500/20 px-4 py-2 rounded-xl text-sm font-bold">

                MONITORING DUE

              </div>

            </div>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-5 mb-8">

              {/* DUE DATE */}
              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5">

                <p className="text-sm text-gray-400 mb-2">
                  Due Date
                </p>

                <h4 className="text-xl font-bold text-orange-300">
                  {dueDate.toLocaleDateString()}
                </h4>

              </div>

              {/* OVERDUE */}
              <div className="bg-slate-800/70 border border-slate-700 rounded-2xl p-5">

                <p className="text-sm text-gray-400 mb-2">
                  Delay Status
                </p>

                <h4 className="text-xl font-bold text-red-400">

                  {daysLate > 0
                    ? `${daysLate} days overdue`
                    : "Due today"}

                </h4>

              </div>

            </div>

            {/* LAST VERIFIED */}
            <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5 mb-8">

              <p className="text-sm text-gray-400 mb-2">
                Last Verified
              </p>

              <h4 className="text-lg font-semibold text-cyan-300">

                {item.lastVerified
                  ? new Date(
                      item.lastVerified
                    ).toLocaleDateString()
                  : "-"}

              </h4>

            </div>

            {/* BUTTON */}
            <button
              onClick={() =>
                router.push(
                  `/validator/review/${item.submissionId}?historyId=${item.historyId}&mode=monitor`
                )
              }
              className="relative w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 hover:from-blue-500 hover:to-cyan-400 rounded-2xl py-4 font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >

              📋 Submit Monitoring Report

            </button>

          </div>
        );
      })}

    </div>

  </div>
)}
    </div>
  );
};

export default ValidatorDashboard;
