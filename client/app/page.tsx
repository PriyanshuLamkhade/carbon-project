"use client";
import { Navbar } from "./components/navbar";
import Button from "./components/ui/Button";
import { useRouter } from "next/navigation"; 
import Cards from "./components/ui/Cards";
import { ShieldCheck, UserPlus, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import AboutPage from "./components/About";
import Features from "./components/Features";

export default function Home() {
  const router = useRouter();

  // Animation variants for hero texts
  const heroTextVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.3, duration: 0.6, ease: "easeOut" }
    })
  };

  // Animation variant for the button
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.9, duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { duration: 0.5, ease: "easeOut" } 
    },
    hover: { scale: 1.05, boxShadow: "0 8px 15px rgba(0,0,0,0.2)", transition: { duration: 0.3 } }
  };

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div
        id="heroSection"
        className="w-full h-[90vh] bg-cover bg-center flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: 'url("/1.jpg")',
        }}
      >
        <div
          className="text-4xl font-extrabold text-center mb-12 text-white relative inline-block pb-3
          before:block before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
          before:w-32 before:h-1.5 before:rounded-full before:bg-gradient-to-r "
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          {/* Animate each heading line with stagger */}
          {[ "Track And Trade Blue Carbon", "With Blockchain Transparency" ].map((text, i) => (
            <motion.h1
              key={text}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={heroTextVariants}
            >
              {text}
            </motion.h1>
          ))}
        </div>
        <br />
        <motion.div
          initial="hidden"
          animate="visible"
          whileHover="hover"
          variants={buttonVariants}
        >
          <Button
            text="Get Started"
            varient="primary"
            size="md"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        </motion.div>
      </div>

      <div id="cards" className="flex justify-evenly flex-wrap mt-10 mb-10 gap-6 px-6">
        {[
          {
            title: "How it Works",
            number: 1,
            subtext: "From field to blockchain",
            body:
              "Upload geo-tagged evidence, get it verified with satellite & drone data, and see it stored immutably on the blockchain.",
            icon: <Workflow size={35}/>,
          },
          {
            title: "Verified Impact",
            number: 2,
            subtext: "Trust through transparency",
            body:
              "Every project shows real CO₂ reduction and tokenized credits, traceable from source to buyer with complete transparency.",
            icon: <ShieldCheck size={35}/>,
          },
          {
            title: "Get Involved",
            number: 3,
            subtext: "Empowering communities & organizations",
            body:
              "Join as a community, NGO, or buyer — register projects, verify sites, or purchase trusted carbon credits.",
            icon: <UserPlus size={35} />,
          },
        ].map(({ title, number, subtext, body, icon }) => (
          <motion.div
            key={number}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.3 }}
            variants={cardVariants}
            whileHover="hover"
            className="w-full sm:w-[320px]"
          >
            <Cards
              title={title}
              number={number}
              subtext={subtext}
              body={body}
              icon={icon}
            />
          </motion.div>
        ))}
      </div>
      <AboutPage/>
      <Features/>
    </div>
  );
}
