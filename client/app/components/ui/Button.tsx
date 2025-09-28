import React from "react";

interface buttonProps {
  
  text: string;
  varient: "primary" | "secondary";
  size: "sm" | "md" | "lg";
  onClick?: ()=>void;
}
const sizeStyles ={
    "sm":"px-4 py-1.5",
    "md":"px-6 py-2",
    "lg":"px-9 py-3",
    
}

const varientStyles ={
    "primary":"bg-cyan-300  text-black",
    "secondary":"bg-gray-200  text-white"
}

const Button = (props: buttonProps) => {
  return (
    <div>
      <button
        className={`${varientStyles[props.varient]} ${sizeStyles[props.size]}
          transition-all border border-slate-800  rounded-2xl cursor-pointer  hover:-translate-y-1  `}
      >
        {props.text}
      </button>
    </div>
  );
};

export default Button;
