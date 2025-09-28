import React from "react";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export const Navbar = () => {
  const router = useRouter();

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.42, 0, 0.58, 1] },
    },
  };

  const navItemVariants = {
    hover: { scale: 1.1, color: "#A0AEC0", transition: { duration: 0.3 } }, // subtle color + scale on hover
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      className="transition-all hidden fix sm:flex justify-between items-baseline py-6 text-sm md:text px-4 md:px-8 border border-[#c0bebe] backdrop-filter backdrop-blur-lg rounded-full translate-y-4 md:w-[90vw] mx-auto"
      initial="hidden"
      animate="visible"
      
      variants={navbarVariants}
    >
      <h1 className="text-2xl font-extrabold">LayerZero</h1>

      <div className="flex gap-10 text-xl font-bold ">
        {["Home", "About", "Features", "FAQ"].map((item) => (
          <motion.h4
            key={item}
            className="cursor-pointer"
            whileHover="hover"
            variants={navItemVariants}
          >
            {item}
          </motion.h4>
        ))}
      </div>

      <div className="flex gap-5">
        <motion.div whileHover="hover" variants={buttonVariants}>
          <Button
            text="Login"
            varient="primary"
            size="sm"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        </motion.div>

        <motion.div whileHover="hover" variants={buttonVariants}>
          <Button
            text="DashBoard"
            varient="secondary"
            size="sm"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
