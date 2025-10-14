import Button from '@/app/components/ui/Button'
import InputBox from '@/app/components/ui/InputBox'
import ToggleSwitch from '@/app/components/ui/ToggleSwitch'
import React from 'react'

const page = () => {
  return (
    <div>
       <div id="top" className="flex justify-between items-center flex-wrap  py-1 mb-10">
        <div>

        <h1 className="text-3xl font-bold ">Settings</h1> 
        
        </div>
       <Button size="md" variant="primary" text={"Save Changes"}/>
      </div>
      <div id='main'className='flex flex-wrap gap-5'>
        <div className='flex flex-col gap-2 bg-white p-7 rounded-lg'>
          <h1 className="text-xl font-bold ">Profile Settings</h1> 
          <label htmlFor="" className='text-md text-gray-500'>Display Name</label><InputBox placeholder='User' />
          <label htmlFor="" className='text-md text-gray-500'>Email</label><InputBox placeholder='user@example.com'/>
          <label htmlFor="" className='text-md text-gray-500'>Phone Number</label><InputBox placeholder='1234567890'/>
        </div>
        <div className=' flex flex-col gap-5 bg-white p-7 rounded-lg '>
          <h1 className="text-xl font-bold ">Notification</h1>
          <div className='flex flex-wrap gap-5 text-gray-500'>

          <span><h1 className="text-md ">Email Notifications</h1>
          <h4 className="text-sm ">Recive updates via emails</h4></span>
          <ToggleSwitch/>
          </div>
          <div className='flex flex-wrap gap-5 text-gray-500'>

          <span><h1 className="text-md ">Push Notifications</h1>
          <h4 className="text-sm ">Recive updates in browser</h4></span>
          <ToggleSwitch/>
          </div>

        </div>
      </div>
    </div>
  )
}

export default page