'use client'

import {
  CoinsIcon,
  HomeIcon,
  MapPin,
  Settings,
  VerifiedIcon,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { SideIcons } from './ui/SideIcons'

const AdminSidebar = () => {
  const pathname = usePathname()
const router = useRouter()
  const links = [
    { href: '/admin/dashboard/home', text: 'Home', icon: <HomeIcon size="20px" /> },
    { href: '/admin/dashboard/map', text: 'Map', icon: <MapPin size="20px"/> },
    { href: '/admin/dashboard/allsubmissions', text: 'All Submissions', icon: <VerifiedIcon size="20px" /> },
    { href: '/admin/dashboard/carbontokens', text: 'Carbon Tokens', icon: <CoinsIcon size="20px" /> },
    { href: '/admin/dashboard/settings', text: 'Settings', icon: <Settings size="20px"  /> },
  ]

  return (
    <div className="hidden w-[17vmax] min-h-screen bg-black/80 border-r pt-6 border-black  md:flex flex-col font-semibold">
      <h1 className="text-white/90 ml-2 text-lg lg:text-2xl font-extrabold flex-shrink-0 md:ml-8 sm:mb-3">
        Admin <br /> Dashboard
        </h1>

      <div className="min-h-[20vmax] w-full mt-10 flex flex-col gap-2">
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <div className={isActive ? 'bg-violet-500 rounded-md' : ''}>
                <SideIcons icon={link.icon} text={link.text}  className='hover:bg-violet-500 text-white/90'/>
              </div>
            </Link>
          )
        })}
      </div>

      <button className="bg-red-500  ml-2 px-6 py-2  mt-10 self-start md:mx-8 hover:bg-red-400 cursor-pointer 
      transition-all duration-300  text-whir   font-extrabold text-base rounded-2xl  hover:-translate-y-1"
      onClick={()=>{
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        router.push("/")
      }}>
        Log Out
      </button>
    </div>
  )
}

export default AdminSidebar
