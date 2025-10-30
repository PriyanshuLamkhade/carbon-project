"use client"

import PreviewPopup from '@/app/components/PreviewPopup';
import DetailedTable from '@/app/components/tables/DetailedTable';
import InputBox from '@/app/components/ui/InputBox';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'

interface Submission {
  historyId: number;
  submission: {location: string};
  status: string;
}
const page = () => {
  const sampleData = [
  {
    id: "SUB-001",
    siteName: "Green Valley Restoration",
    user: "0xA12b...89F3",
    area: 150.5,
    dateSubmitted: "2025-10-20",
    location: "Lagos, Nigeria",
    status: "Pending",
  },
  {
    id: "SUB-002",
    siteName: "Blue River Project",
    user: "john.doe.eth",
    area: 200,
    dateSubmitted: "2025-10-22",
    location: "Nairobi, Kenya",
    status: "Approved",
  },
  {
    id: "SUB-003",
    siteName: "Coastal Mangrove Revival",
    user: "0x9B8e...72CD",
    area: 95.3,
    dateSubmitted: "2025-10-25",
    location: "Dar es Salaam, Tanzania",
    status: "Rejected",
  },
  {
    id: "SUB-004",
    siteName: "Rainforest Carbon Initiative",
    user: "climatehero.eth",
    area: 500,
    dateSubmitted: "2025-10-28",
    location: "Manaus, Brazil",
    status: "Pending",
  },
];

//  let [data, setData] = useState<Submission[]>([]);
const [previewData, setPreviewData] = useState(null);
  const [visible, setVisible] = useState(false);
// useEffect(()=>{
//   async function getUserSubmission(){
//   const response =  await fetch("http://localhost:4000/users/allhistory", {
//         method: "get",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//       });
      
//       if (response.ok) {
//         const data = await response.json();
//         setData(data.histories);
//         console.log(data.histories)
//       } else {
//         console.error("Failed to fetch user details", response.status);
//       }
// }
// getUserSubmission()
// },[])

const [statusFilter, setStatusFilter] = useState('all');
const router = useRouter()
  return (
    <div className='space-y-6 '>
      <div id="top" className="flex justify-between items-center flex-wrap  py-1 mb-10">
        <div>

        <h1 className="text-3xl font-bold ">Submissions</h1> 
        
        </div>
       
      </div>
      <div id='filter' className='flex flex-wrap my-4 gap-2'>
        <InputBox placeholder='Search by id...'/>
      <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="bg-white border text-black border-black rounded-lg p-2 cursor-pointer"
>
  <option value="all">All Status</option>
  <option value="pending">Pending</option>
  <option value="inprogress">In Progress</option>
  <option value="approved">Approved</option>
  <option value="rejected">Rejected</option>
</select>

      </div>
      <div id='main' className=''>
          <DetailedTable
  rows={sampleData}
  onReview={(row) => {
    console.log("Review clicked:", row);
  }}
  theme="dark"
/>
          <PreviewPopup
        visible={visible}
        onClose={() => setVisible(false)}
        data={previewData}
      />
      </div>
    </div>
  )
}

export default page