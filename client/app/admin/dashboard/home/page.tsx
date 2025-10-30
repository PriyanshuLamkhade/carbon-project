'use client'
import DetailedTable from "@/app/components/tables/DetailedTable";
import TableComponent from "@/app/components/tables/TableComponent";
import TableWithActions from "@/app/components/tables/TableWithActionsProps";
import Button from "@/app/components/ui/Button";
import Cards from "@/app/components/ui/Cards";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
interface Submission {
  historyId: number;
  submission: {location: string};
  status: string;
}
const page = () => {
  let [data, setData] = useState<Submission[]>([]);
  const [previewData, setPreviewData] = useState(null);
    const [visible, setVisible] = useState(false);

const cardData = [
  {
    title: (
      <span className="text-xl">
        Pending <br /> Areas
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">245</p>,
    body: "requests",
  },
  {
    title: (
      <span className="text-xl">
        In progress <br /> Areas
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">180</p>,
    body: "requests",
  },
  {
    title: (
      <span className="text-xl">
        Accepted <br /> Areas
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">320</p>,
    body: "requests",
  },
  {
    title: (
      <span className="text-xl">
        Rejected <br /> Areas
      </span>
    ),
    subtext: <p className="text-3xl font-extrabold">8</p>,
    body: "requests",
  },
];
const router = useRouter()


  return (
    <div className="space-y-6 text-white/90">
      <div id="top" className="flex justify-between items-center flex-wrap  py-1 ">
        <div>

        <h1 className="text-3xl font-bold ">Welcome, {"x"}!</h1> 
        <h2 className="text-xl">Keep Making Imapact!</h2>
        </div>
       <Button size="md" variant="primary" text={"All Submissions"} onClick={()=>router.push("/admin/dashboard/allsubmissions")}/>
      </div>
       {/* smplify later */}
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
            <h1 className="text-3xl font-bold mb-3 -mt-1 ">Recent Submission</h1> 
            <DetailedTable rows={[]} theme="dark"/>
        </div>
    </div>
  );
};

export default page;
