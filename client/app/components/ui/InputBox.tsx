import React from "react";

interface inputInterface {
  placeholder: string,
  reference : any
}

const InputBox = ({ placeholder,reference}: inputInterface) => {
  return (
    <input
    ref={reference}
      className="bg-[#6c7faf] px-4 py-3 outline-none w-[280px] text-white rounded-lg border-2 transition-colors duration-100 border-solid focus:border-[#692e2e] border-[#2B3040]"
      name="text"
      placeholder={placeholder}
      type="text"
    />
  );
};

export default InputBox;
