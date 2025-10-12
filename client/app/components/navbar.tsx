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
      className={`transition-all duration-500 ease-in-out hidden sm:flex py-5 text-sm md:text px-4 md:px-8 rounded-full translate-y-4
        ${
          scrolled
            ? "w-[90vw] mx-auto border border-[#c0bebe] bg-gradient-to-br from-white/30 to-black/20 backdrop-blur-[30px] items-baseline justify-between"
            : "w-full px-4 justify-between items-baseline bg-transparent border-none backdrop-blur-0"
        }
      `}
      style={{}}
    >
      {/* Logo */}
      <h1 className="text-white text-3xl font-extrabold flex-shrink-0">LayerZero</h1>

      {/* Menu + Buttons */}
      <div className={`flex items-center  text-white text-xl font-bold ${scrolled ? "gap-25 " : "gap-10"}`}>
        {["Home", "About", "Features", "FAQ"].map((item) => (
          <h4 key={item} className=" cursor-pointer hover:underline">
            {item}
          </h4>
        ))}
        <div className="flex gap-5 ml-10">

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
            router.push("/auth/signin");
          }}
        />
        </div>
      </div>
    </div>
  );
};
