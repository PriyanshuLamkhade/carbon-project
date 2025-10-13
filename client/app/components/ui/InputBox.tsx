import React from "react";

interface inputInterface {
  placeholder?: string,
  reference ?: any,
  isDisabled?:boolean ,
  className?:string,
  type?:string,
  required?:boolean
}

const InputBox = ({ placeholder,reference,isDisabled = false,className,type="text",required=false}: inputInterface) => {
  
  return (
    
    <input
    
    ref={reference}
      className={` bg-white h-10 text-black px-4 py-2 outline-none w-[15vw]  rounded-lg border-2 
        transition-colors duration-100 border-solid focus:border-[#692e2e] border-[#2B3040]
        placeholder-gray-600 disabled:placeholder-opacity-100
      ${isDisabled && "cursor-not-allowed"}
      ${className}
        `}
      name="title"
      placeholder={placeholder}
      type={type}
      disabled={isDisabled}
      required={required}
    />
  );
};

export default InputBox;
