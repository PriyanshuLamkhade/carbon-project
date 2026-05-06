"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DetailedTable from "@/components/tables/DetailedTable";

export default function MonitoringPage() {
  const [rows, setRows] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:4000/admin/monitorings", {
        credentials: "include",
      });

      const data = await res.json();

      const formatted = data.monitorings.map((m: any) => ({
        SubmissionID: m.monitoringId,
        SubmittedBy: m.history?.user?.name || "-",
        AreaClaimed: m.history?.submission?.areaclaim,
        DateSubmitted: m.monitoredAt,
        Location: m.history?.submission?.location,
        Status: m.tokensMinted ? "APPROVED" : "PENDING",
      }));

      setRows(formatted);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Monitoring Records
      </h1>

      <DetailedTable
        rows={rows}
        theme="dark"
        onReview={(row: any) => {
          router.push(`/admin/dashboard/monitoring/${row.SubmissionID}`);
        }}
      />
    </div>
  );
}