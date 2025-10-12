import React from 'react'
import { Wallet } from '../wallet'
import SignInForm from './SignInForm'

const page = () => {
  return (
     <div className=" h-screen w-full items-center flex flex-col justify-center bg-amber-200">
        
        <Wallet>
            <SignInForm />
        </Wallet>
    </div>
  )
}

export default page