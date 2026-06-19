"use client";

import { useParams } from "next/navigation";

export default function ProjectPage() {
  const { historyId } = useParams();
  return (
    <div className="p-6 text-white bg-slate-900 min-h-screen">
      <h1 className="text-2xl font-bold">Project Details: {historyId}</h1>
      <p>This page is under construction.</p>
    </div>
  );
}
