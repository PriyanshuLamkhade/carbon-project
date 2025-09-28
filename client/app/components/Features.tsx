"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Globe,
  Database,
  Users,
} from "lucide-react";

const features = [
  {
    title: "Transparent Carbon Tracking",
    subtitle: "Verified & Immutable",
    description:
      "Track carbon credits with blockchain-backed proofs for total transparency you can trust.",
    icon: <Leaf size={48} />,
    gradient: "from-green-400 to-blue-500",
  },
  {
    title: "Decentralized Data Security",
    subtitle: "Safe & Reliable",
    description:
      "Your sustainability data is protected by blockchain encryption — tamper-proof and always accessible.",
    icon: <Database size={48} />,
    gradient: "from-blue-500 to-teal-400",
  },
  {
    title: "Global Community Impact",
    subtitle: "Collaborate & Grow",
    description:
      "Join a worldwide network of communities and organizations driving real climate action together.",
    icon: <Users size={48} />,
    gradient: "from-emerald-400 to-green-600",
  },
  {
    title: "Eco-Friendly Innovation",
    subtitle: "Sustainable & Smart",
    description:
      "Harness cutting-edge technology to empower greener decisions and fair carbon credit trading.",
    icon: <Globe size={48} />,
    gradient: "from-teal-400 to-blue-600",
  },
];

// Animation variants for cards (hover + entrance)
const cardVariants = {
  rest: { scale: 1, boxShadow: "0 0 15px rgba(0,0,0,0.1)", opacity: 0, y: 30 },
  hover: {
    scale: 1.05,
    boxShadow: "0 0 25px rgba(72,187,120,0.7)",
    transition: { duration: 0.3 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const iconGlow = {
  rest: { filter: "drop-shadow(0 0 4px rgba(72,187,120,0))" },
  hover: {
    filter: "drop-shadow(0 0 8px rgba(72,187,120,0.8))",
    transition: { duration: 0.3 },
  },
};

// Title animation
const titleVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function Features() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-extrabold text-center mb-12 text-gray-900 relative inline-block pb-3
          before:block before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
          before:w-32 before:h-1.5 before:rounded-full before:bg-gradient-to-r before:from-green-400 before:to-blue-500"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          Features That Empower
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {features.map(({ title, subtitle, description, icon, gradient }, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-br rounded-xl p-8 cursor-pointer shadow-md text-gray-900
                flex flex-col gap-6"
              initial="rest"
              whileHover="hover"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }}
              variants={cardVariants}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-full bg-white inline-flex items-center justify-center
                  text-green-600`}
                variants={iconGlow}
              >
                <div
                  className={`text-4xl bg-clip-text text-transparent bg-gradient-to-r ${gradient}`}
                >
                  {icon}
                </div>
              </motion.div>

              <div>
                <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="text-sm font-semibold text-green-700 mb-1">{subtitle}</p>
                <p className="text-gray-700 leading-relaxed">{description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
