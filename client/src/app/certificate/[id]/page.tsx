"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function CertificatePage() {
  const params = useParams(); // ✅ correct way
  const id = params?.id as string;

  const [cert, setCert] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:4000/certificate/${id}`)
      .then((res) => res.json())
      .then(setCert)
      .catch(() => console.error("Failed to fetch certificate"));
  }, [id]);

  if (!cert) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Certificate #{cert.certificateId}
      </h1>

      <p><b>Company:</b> {cert.industry.companyName}</p>
      <p><b>Tokens:</b> {cert.tokensRetired}</p>
      <p><b>CO₂:</b> {cert.carbonOffset}</p>

      <button
        onClick={() =>
          window.open(
            `http://localhost:4000/certificate/${id}/download`
          )
        }
        className="mt-4 bg-green-600 px-4 py-2 rounded"
      >
        Download PDF
      </button>
    </div>
  );
}