import { ReactElement } from "react"

interface SideIconProps {
  icon: ReactElement
  text: string
  onClick?: () => void
  className?: string 
}

export const SideIcons = (props: SideIconProps) => {
  return (
    <div
      className={`rounded-md text-gray-900 py-4 w-full px-2 transition-all duration-400 lg:text-lg  md:px-8 cursor-pointer hover:bg-white ${props.className ?? ''}`}
    >
      <button className="flex items-center flex-wrap cursor-pointer" onClick={props.onClick}>
        <div className="mr-2">{props.icon}</div>
        <div>
          <p>{props.text}</p>
        </div>
      </button>
    </div>
  )
}
