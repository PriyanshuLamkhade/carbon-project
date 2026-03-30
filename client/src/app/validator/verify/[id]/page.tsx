"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VerificationForm from "@/features/validator/VerificationForm";
import { authService } from "@/app/page";

export default function Page() {
  const { id } = useParams();
  const [submission, setSubmission] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${authService}/users/previewData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId: Number(id) }),
        credentials: "include",
      });

      const data = await res.json();
      setSubmission(data.submission);
    };

    if (id) fetchData();
  }, [id]);

  // 🔥 IMPORTANT
  if (!submission) {
    return <div className="p-6">Loading...</div>;
  }

  return <VerificationForm submission={submission} />;
}