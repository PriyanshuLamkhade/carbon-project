'use client'
import TableComponent from "@/app/components/tables/TableComponent";
import Button from "@/app/components/ui/Button";
import Cards from "@/app/components/ui/Cards";
import { useRouter } from "next/navigation";
import React from "react";

const page = () => {
    const data = [
  { submissionId: 1, location: 'New York', areaClaimed: '100 ha', status: 'Approved' },
  { submissionId: 2, location: 'Los Angeles', areaClaimed: '150 ha', status: 'Pending' },
  { submissionId: 3, location: 'Los Angeles', areaClaimed: '150 ha', status: 'In progress' },
];

const cardData = [
  {
    title: (
      <span className="text-xl">
        Total <br /> Area Claimed
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">245</p>,
    body: "hectares",
  },
  {
    title: (
      <span className="text-xl">
        Total <br /> Area Verified
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">180</p>,
    body: "hectares",
  },
  {
    title: (
      <span className="text-xl">
        Carbon <br /> Tokens Earned
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">320</p>,
    body: "tokens",
  },
  {
    title: (
      <span className="text-xl">
        Pending <br /> Verifications
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">8</p>,
    body: "Submissions",
  },
];
const router = useRouter()


  return (
    <div className="space-y-6 text-gray-700">
      <div id="top" className="flex justify-between items-center flex-wrap  py-1 ">
        <div>

        <h1 className="text-3xl font-bold ">Welcome, {"x"}!</h1> 
        <h2 className="text-xl">Keep Making Imapact!</h2>
        </div>
       <Button size="md" variant="primary" text={"New Submission"} onClick={()=>router.push("/user/form")}/>
      </div>
       {/* smplify later */}
      <div id="cards" className="flex flex-wrap justify-evenly py-3 gap-2">
  {cardData.map((card, idx) => (
    <Cards
      key={idx}
      className="h-60 w-72 bg-white text-zinc-800 "
      title={card.title}
      subtext={card.subtext}
      body={card.body}
    />
  ))}
</div>

       <div>
            <h1 className="text-3xl font-bold mb-3 -mt-1 ">Recent Submission</h1> 
            <TableComponent rows={data}/>
        </div>
    </div>
  );
};

export default page;
