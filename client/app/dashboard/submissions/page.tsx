"use client"
import TableWithActions from '@/app/components/TableWithActionsProps';

import Button from '@/app/components/ui/Button'
import InputBox from '@/app/components/ui/InputBox';
import React, { useState } from 'react'

const page = () => {
  const data = [
  { userId: 101, location: 'New York', status: 'Active' },
  { userId: 102, location: 'Berlin', status: 'Pending' },
  { userId: 103, location: 'Tokyo', status: 'Inactive' },
  { userId: 104, location: 'London', status: 'Rejected' },
];
const [statusFilter, setStatusFilter] = useState('all');

  return (
    <div>
      <div id="top" className="flex justify-between items-center flex-wrap  py-1 mb-10">
        <div>

        <h1 className="text-3xl font-bold ">Submissions</h1> 
        
        </div>
       <Button size="md" variant="primary" text={"New Submission"}/>
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
          <TableWithActions rows={data}/>
      </div>
    </div>
  )
}

export default page