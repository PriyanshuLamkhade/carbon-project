"use client";

import { authService } from "@/app/page";
import DetailedTable from "@/components/tables/DetailedTable";
import Button from "@/components/ui/Button";
import Cards from "@/components/ui/Cards";
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
          <h1 className="text-3xl font-bold">Welcome, {"x"}!</h1>
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
  <div className="bg-slate-800 p-6 rounded-xl shadow mt-6">
    <h2 className="text-xl font-bold mb-4 text-red-600">
      ⚠️ Monitoring Due
    </h2>

    {monitoringDue.map((item: any) => (
      <div
        key={item.submissionId}
        className="flex justify-between items-center border-b py-3"
      >
        <div>
          <p className="font-semibold">{item.location}</p>
          <p className="text-sm text-gray-500">
            Due: {new Date(item.dueDate).toDateString()}
          </p>
        </div>

        <button
          onClick={() =>
            router.push(
              `/validator/review/${item.submissionId}?historyId=${item.historyId}&mode=monitor`
            )
          }
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit Report
        </button>
      </div>
    ))}
  </div>
)}
    </div>
  );
};

export default ValidatorDashboard;
