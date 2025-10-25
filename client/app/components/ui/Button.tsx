import React from "react";

interface buttonProps {
  
  text: string;
  variant: "primary" | "secondary"|"third";
  size: "sm" | "md" | "lg";
  onClick?: (e:any)=>void;
  className?: string
}
const sizeStyles ={
    "sm":"px-4 py-1.5",
    "md":"px-6 py-2",
    "lg":"px-9 py-3",
    
}

const varientStyles ={
    "primary":"   bg-green-500 border-green-600 text-white",
    "secondary":" bg-black text-white border-slate-800",
    "third":" bg-blue-500 text-white border-slate-800",
}

const Button = (props: buttonProps) => {
  return (
    <div>
      <button
        className={`${varientStyles[props.variant]} ${sizeStyles[props.size]} ${props.className}
          transition-all duration-300 border    font-extrabold text-base rounded-2xl  hover:-translate-y-1 cursor-pointer
          `}
          onClick={props.onClick}
      >
        {props.text}
      </button>
    </div>
  );
};

export default Button;
