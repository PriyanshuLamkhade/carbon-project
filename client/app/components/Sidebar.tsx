'use client'

import {
  CoinsIcon,
  HomeIcon,
  Settings,
  User,
  VerifiedIcon,
} from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SideIcons } from './ui/SideIcons'

const Sidebar = () => {
  const pathname = usePathname()
const router = useRouter()
  const links = [
    { href: '/dashboard/home', text: 'Home', icon: <HomeIcon size="20px" /> },
    { href: '/dashboard/submissions', text: 'My Submissions', icon: <User size="20px" /> },
    { href: '/dashboard/areas', text: 'Verified Areas', icon: <VerifiedIcon size="20px" /> },
    { href: '/dashboard/carbonTokens', text: 'Carbon Tokens', icon: <CoinsIcon size="20px" /> },
    { href: '/dashboard/settings', text: 'Settings', icon: <Settings size="20px"  /> },
  ]

  return (
    <div className="hidden w-[17vmax] min-h-screen bg-green-400/70 border-r pt-6 border-green-200  md:flex flex-col font-semibold">
      <h1 className="text-white ml-2 text-lg lg:text-2xl font-extrabold flex-shrink-0 md:ml-8 sm:mb-3">
        User <br /> Dashboard
        </h1>

      <div className="min-h-[20vmax] w-full mt-10 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <div className={isActive ? 'bg-white rounded-md' : ''}>
                <SideIcons icon={link.icon} text={link.text} />
              </div>
            </Link>
          )
        })}
      </div>

      <button className="bg-red-500  ml-2 px-6 py-2  mt-10 self-start md:mx-8 hover:bg-red-400 cursor-pointer 
      transition-all duration-300 border    font-extrabold text-base rounded-2xl  hover:-translate-y-1"
      onClick={()=>{
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/")
      }}>
        Log Out
      </button>
    </div>
  )
}

export default Sidebar
