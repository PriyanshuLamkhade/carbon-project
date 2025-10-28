import React from "react";

interface InputInterface {
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
  type?: string;
  required?: boolean;
  readonly?:boolean
}

// 👇 Use forwardRef so parent refs work properly
const InputBox = React.forwardRef<HTMLInputElement, InputInterface>(
  (
    {
      placeholder,
      isDisabled = false,
      className = "",
      type = "text",
      required = false,
      readonly=false
    },
    ref
  ) => {
    return (
      <input
        ref={ref} // ✅ this now connects to parent refs
        name="title"
        placeholder={placeholder}
        type={type}
        readOnly={readonly}
        disabled={isDisabled}
        required={required}
        className={`
          w-full max-w-md 
          px-4 py-2
          text-sm sm:text-base
          text-gray-800 
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
  }
);

// ✅ Give it a display name (optional, but helps with debugging)
InputBox.displayName = "InputBox";

export default InputBox;
