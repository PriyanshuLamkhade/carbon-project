import React from "react";

interface inputInterface {
  placeholder: string,
  reference ?: any
  isDisabled?:boolean 
  className?:string
}

const InputBox = ({ placeholder,reference,isDisabled = false,className}: inputInterface) => {
  
  return (
    
    <input
    ref={reference}
      className={`bg-[#6c7faf] px-4 py-2 outline-none w-[280px] text-white rounded-lg border-2 
        transition-colors duration-100 border-solid focus:border-[#692e2e] border-[#2B3040]
      ${isDisabled && "cursor-not-allowed"}
      ${className}
        `}
      name="text"
      placeholder={placeholder}
      type="text"
      disabled={isDisabled}
    />
  );
};

export default InputBox;
