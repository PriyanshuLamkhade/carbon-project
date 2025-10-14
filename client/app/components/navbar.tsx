import React, { useState, useEffect } from "react";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={` transition-all duration-500 delay-75 ease-in-out hidden sm:flex py-5 text-sm md:text px-4 md:px-8 rounded-full m-4
        ${
          scrolled
            ? " px-4 border border-[#c0bebe] bg-gradient-to-br from-white/30 to-black/20 backdrop-blur-[30px] items-baseline justify-between  "
            : " px-4 justify-between items-baseline bg-transparent border-none backdrop-blur-0"
        }
      `}

    >
      {/* Logo */}
      <h1 className="text-white md:text-3xl font-extrabold flex-shrink-0 mr-2">LayerZero</h1>

      {/* Menu + Buttons */}
      <div className={` flex items-center gap-7  text-white md:text-xl font-bold  `}>
        {["Home", "About", "Features", "FAQ"].map((item) => (
          <h4 key={item} className={ `cursor-pointer hover:underline p-1 ${!scrolled && "backdrop-blur-[1px] p-1 " } `}>
            {item}
          </h4>
        ))}
        

        <Button
          text="Login"
          variant="primary"
          size="sm"
          onClick={() => {
            router.push("/auth/signin");
          }}
        />

        <Button
          text="DashBoard"
          variant="secondary"
          size="sm"
          onClick={() => {
            router.push("/auth/signup");
          }}
        />
        
      </div>
    </div>
  );
};
