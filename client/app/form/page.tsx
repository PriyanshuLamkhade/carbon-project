import React from 'react'
import InputBox from '../components/ui/InputBox'
import Button from '../components/ui/Button'

async function Form() {
  return (<>
    <div className='border-b-1 border-gray-700 py-5 px-4 font-extrabold text-3xl mt-5 '>
        Form 
    </div>
    <div id='Personal_Details' className='border-b-1 border-gray-700 py-5 px-4 text-2xl '>
        <h1 className='text-3xl font-bold'>Personal Details :</h1>
        <br />
        
        <div className='flex gap-5 items-baseline flex-wrap'>
            <label htmlFor="">Name:</label> <InputBox placeholder='name' isDisabled={true} className='bg-white h-10 text-black'/>
            <label htmlFor="">Organization:</label> <InputBox placeholder={''} isDisabled={true} className='bg-white h-10 text-black'/>
            
        </div>
        <br />  
        <label htmlFor="">Your current location:</label> <Button size='md' variant='secondary' text='Allow' className='mt-3'/>
    </div>
    <div>

    </div>
  </>
  )
}

export default Form