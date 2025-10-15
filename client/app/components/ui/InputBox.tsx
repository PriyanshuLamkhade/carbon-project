import React from "react";

interface InputInterface {
  placeholder?: string;
  reference?: React.Ref<HTMLInputElement>;
  isDisabled?: boolean;
  className?: string;
  type?: string;
  required?: boolean;
}

const InputBox = ({
  placeholder,
  reference,
  isDisabled = false,
  className = "",
  type = "text",
  required = false,
}: InputInterface) => {
  return (
    <input
      ref={reference}
      name="title"
      placeholder={placeholder}
      type={type}
      disabled={isDisabled}
      required={required}
      className={`
        w-full max-w-md 
        px-4 py-2
        text-sm sm:text-base
        text-gray-800 dark:text-white
        placeholder-gray-400 
        bg-white 
        border border-gray-300 
        rounded-lg shadow-sm
        focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200 ease-in-out
        disabled:cursor-not-allowed
        ${className}
      `}
    />
  );
};

export default InputBox;
