import React from 'react'
import Button from './ui/Button'

export const Navbar = () => {
  return (
    <div className='transition-all hidden fix sm:flex justify-between items-baseline py-6 text-sm md:text 
    px-4  md:px-8 border border-amber-50 backdrop-filter
     backdrop-blur-lg rounded-full translate-y-4 md:w-[90vw] mx-auto'>
        <h1 className='font-bold text-lg '>LayerZero</h1>
        <div className='flex gap-8 '>
            <h4 className="cursor-pointer">Home</h4>
            <h4 className="cursor-pointer">About</h4>
            <h4 className="cursor-pointer">Features</h4>
            <h4 className="cursor-pointer">FAQ</h4>
        </div>
        <div className='flex gap-5'>
            <Button text='Login' varient='primary'  size="sm"/>
            <Button text='DashBoard' varient='secondary'  size="sm"/>
        </div>
    </div>
  )
}
