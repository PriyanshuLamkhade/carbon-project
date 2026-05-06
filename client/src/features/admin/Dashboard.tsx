"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cards from "@/components/ui/Cards";

import DetailedTable from "@/components/tables/DetailedTable";
import Button from "@/components/ui/Button";

interface Submission {
  submissionId: number;
  location: string;
  areaclaim: number;
  submissionDate: string;
  status?: string;
}

const AdminDashboard = () => {
  const [recentEntries, setRecentEntries] = useState<Submission[]>([]);
  const [stats, setStats] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:4000/admin/stats", {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setRecentEntries(data.recentSubmissions);
      } else {
        console.error("Failed to fetch stats");
      }
    }

    fetchData();
  }, []);

  if (!stats) return <p className="text-white p-6">Loading...</p>;

  // 🔥 Cards Data (Admin-focused)
  const cardData = [
    {
      title: (
        <span>
          Total <br /> Users
        </span>
      ),
      subtext: <p className="text-3xl font-extrabold">{stats.totalUsers}</p>,
      body: "registered users",
    },
    {
      title: (
        <span>
          Total <br /> Submissions
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold">{stats.totalSubmissions}</p>
      ),
      body: "entries",
    },
    {
      title: (
        <span>
          Approved <br /> Verifications
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold text-green-400">
          {stats.approved}
        </p>
      ),
      body: "successful",
    },
    {
      title: (
        <span>
          Pending <br /> Verifications
        </span>
      ),
      subtext: (
        <p className="text-3xl font-extrabold text-yellow-400">
          {stats.pending}
        </p>
      ),
      body: "awaiting",
    },
  ];
  const formattedRows = recentEntries.map((sub) => ({
    HistoryId: null,
    SubmissionID: sub.submissionId,
    SubmittedBy: "-", // optional for now
    AreaClaimed: sub.areaclaim,
    DateSubmitted: sub.submissionDate,
    Location: sub.location,
    Status: "PENDING", // or derive later
  }));
  return (
    <div className="space-y-6 text-white/90">
      {/* 🔹 TOP */}
      <div className="flex justify-between items-center flex-wrap py-1">
        <div>
          <h1 className="text-3xl font-bold">Welcome Admin 👋</h1>
          <h2 className="text-lg text-gray-400">
            Monitor and manage the platform
          </h2>
        </div>

        <div className="flex gap-3">
          <Button
            size="md"
            variant="secondary"
            text="Users"
            onClick={() => router.push("/admin/dashboard/users")}
          />
          <Button
            size="md"
            variant="secondary"
            text="Submissions"
            onClick={() => router.push("/admin/dashboard/submissions")}
          />
          <Button
            size="md"
            variant="secondary"
            text="Monitoring"
            onClick={() => router.push("/admin/dashboard/monitoring")}
          />
        </div>
      </div>

      {/* 🔹 CARDS */}
      <div className="flex flex-wrap justify-evenly py-3 gap-3">
        {cardData.map((card, idx) => (
          <Cards
            key={idx}
            className="h-60 w-72 text-white/80 bg-neutral-900"
            title={card.title}
            subtext={card.subtext}
            body={card.body}
          />
        ))}
      </div>

      {/* 🔥 EXTRA METRICS (THIS IS WHAT MAKES ADMIN DIFFERENT) */}
      <div className="flex gap-4 flex-wrap">
        <Cards
          className="h-48 min-w-80 bg-neutral-900"
          title="Carbon Cleaned"
          subtext={
            <p className="text-2xl font-bold text-green-400">
              {Math.round(stats.totalCarbon)} tCO₂
            </p>
          }
          body="verified impact"
        />

        <Cards
          className="h-48 min-w-80 bg-neutral-900"
          title="Tokens Minted"
          subtext={
            <p className="text-2xl font-bold text-purple-400">
              {stats.totalTokens}
            </p>
          }
          body="on blockchain"
        />

        <Cards
          className="h-48 min-w-80 bg-neutral-900"
          title="Validators"
          subtext={<p className="text-2xl font-bold">{stats.validators}</p>}
          body="active"
        />
      </div>

      {/* 🔹 TABLE */}
      <div>
        <h1 className="text-2xl font-bold mb-3">Recent Submissions</h1>

        <DetailedTable
          rows={formattedRows}
          theme="dark"
          onReview={(row: any) => {
            router.push(`/admin/dashboard/submissions/${row.SubmissionID}`);
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
