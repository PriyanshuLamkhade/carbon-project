"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { authService } from "@/app/page";
import VerificationForm1 from "@/features/validator/VerificationForms/VerificationForm1";
import VerificationForm2 from "@/features/validator/VerificationForms/VerificationForm2";
import VerificationForm3 from "@/features/validator/VerificationForms/VerificationForm3";
import toast from "react-hot-toast";
export default function Page() {
  const router = useRouter()
  const { id } = useParams();
  const [submission, setSubmission] = useState<any>(null);
  const searchParams = useSearchParams();
    const historyId = searchParams.get("historyId");

  const [step, setStep] = useState(1);
  const [verificationData, setVerificationData] = useState<any>(null);
  const [sectionBData, setSectionBData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${authService}/users/reviewData`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ historyId: Number(historyId) }),
        credentials: "include",
      });

      const data = await res.json();
      setSubmission(data.submission);
    };

    if (id) fetchData();
  }, [id]);
  const handleFinalSubmit = async (data: any) => {
    const formData = new FormData();
    const round = (num: number) => Number(num.toFixed(2));
    // 🧠 CLEAN STRUCTURE
    const cleanedData = {
      historyId: Number(historyId),
      decision: data.decision,

      verification: {
        location: data.verificationData.form.validatorLocation,
        area: Number(data.verificationData.form.actualArea.trim()),
        boundaryMatch: data.verificationData.form.boundaryMatch,
        density: data.verificationData.form.mangroveDensity,
        soilCondition: data.verificationData.form.soilCondition,
        illegalActivity: data.verificationData.form.illegalActivity,
        pollution: data.verificationData.form.pollution,
        confidence: data.verificationData.form.confidence,
        remarks: data.verificationData.form.remarks,
        score: data.verificationData.score,
        boundaryPoints: data.verificationData.boundaryPoints,
      },

      carbonInput: {
        ...data.sectionBData.sectionB,
        survivalRate: Number(data.sectionBData.sectionB.survivalRate),
      },

      carbonOutput: {
        AGB: round(data.AGB),
        BGB: round(data.BGB),
        soilCarbon: round(data.soilCarbon),
        totalCarbon: round(data.totalCarbon),
        annualCO2: round(data.annualCO2),
         
      },
    };

    // ✅ Append JSON
    formData.append("data", JSON.stringify(cleanedData));

    // ✅ Append images ONLY here
    data.images.forEach((file: File) => {
      formData.append("images", file);
    });

    // 🔍 Debug properly
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    
   const res = await fetch(`${authService}/validator/submitVerification`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    if(res.ok){
      toast.success("Verification Completed")
      router.push("/validator/dashboard")
    }
    else{
      toast.error("Failed")
    }
  };
  if (!submission) {
    return <div className="p-6">Loading...</div>;
  }
  if (step === 3) {
    return (
      <VerificationForm3
        submission={submission}
        verificationData={verificationData}
        sectionBData={sectionBData}
        onNext={(data: any) => {
          handleFinalSubmit(data);
        }}
      />
    );
  }
  // 🟢 SECTION B
  if (step === 2) {
    return (
      <VerificationForm2
        submission={submission}
        verificationData={verificationData}
        onNext={(data: any) => {
          setSectionBData(data);
          setStep(3);
        }}
      />
    );
  }

  // 🟢 SECTION A
  return (
    <VerificationForm1
      submission={submission}
      onNext={(data: any) => {
        setVerificationData(data);
        setStep(2);
      }}
    />
  );
}
