"use client";
import YearlyReportForm from "@/features/validator/YearlyReportForm";
import { useParams, useSearchParams } from "next/navigation";


export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const historyId = searchParams.get("historyId");

  return (
    <YearlyReportForm
      submissionId={id}
      historyId={historyId}
    />
  );
}