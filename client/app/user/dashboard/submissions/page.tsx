"use client"
import PreviewPopup from '@/app/components/PreviewPopup';
import TableWithActions from '@/app/components/tables/TableWithActionsProps';

import Button from '@/app/components/ui/Button'
import InputBox from '@/app/components/ui/InputBox';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
interface Submission {
  historyId: number;
  submission: {location: string};
  status: string;
}
const page = () => {
 let [data, setData] = useState<Submission[]>([]);
const [previewData, setPreviewData] = useState(null);
  const [visible, setVisible] = useState(false);
useEffect(()=>{
  async function getUserSubmission(){
  const response =  await fetch("http://localhost:4000/users/allhistory", {
        method: "get",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setData(data.histories);
        console.log(data.histories)
      } else {
        console.error("Failed to fetch user details", response.status);
      }
}
getUserSubmission()
},[])

const [statusFilter, setStatusFilter] = useState('all');
const router = useRouter()
  return (
    <div className='space-y-6 text-gray-700'>
      <div id="top" className="flex justify-between items-center flex-wrap  py-1 mb-10">
        <div>

        <h1 className="text-3xl font-bold ">Submissions</h1> 
        
        </div>
       <Button size="md" variant="primary" text={"New Submission"} onClick={()=>router.push("/user/form")}/>
      </div>
      <div id='filter' className='flex flex-wrap my-4 gap-2'>
        <InputBox placeholder='Search UserId...'/>
      <select
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className="bg-white border border-black rounded-lg p-2 cursor-pointer"
>
  <option value="all">All Status</option>
  <option value="pending">Pending</option>
  <option value="inprogress">In Progress</option>
  <option value="approved">Approved</option>
  <option value="rejected">Rejected</option>
</select>

      </div>
      <div id='main' className=''>
          <TableWithActions rows={data} setPreviewData={setPreviewData} setVisible={setVisible} />
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