"use client";
import { Navbar } from "./components/navbar";
import Button from "./components/ui/Button";
import { useRouter } from "next/navigation";
import Cards from "./components/ui/Cards";
import { Key, ShieldCheck, UserPlus, Workflow } from "lucide-react";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div
        id="heroSection"
        className="relative w-full h-[100vh] flex bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: 'url("/Mangroves_at_sunset.jpg")',
        }}
      >
        {/* Optional: subtle dark overlay */}
        

        {/* Left Glass Panel */}
        <div className=" relative z-5 w-full md:w-[50%] h-full flex items-center px-8 md:px-16 bg-black/30 backdrop-blur-lg border-r border-white/20">
          <div className=" w-full ">
            <h1
              className="text-white/80  mb-5 text-4xl md:text-5xl font-extrabold leading-tight border-white  "
              
            >
              Track And Trade Blue Carbon <br />
              With Blockchain Transparency
            </h1>

            <Button
           
              text="Get Started"
              variant="primary"
              size="lg"
              onClick={() => {
                router.push("/auth/signup");
              }}
            />
          </div>
        </div>

        {/* Right side remains empty, shows background */}
        <div className="hidden md:block w-[50%]" />
      </div>

      <div
        id="cards"
        className="flex justify-evenly flex-wrap mt-10 mb-10 gap-6 px-6"
      >
        {[
          {
            Key: 1,
            title: "How it Works",
            number: 1,
            subtext: "From field to blockchain",
            body: "Upload geo-tagged evidence, get it verified with satellite & drone data, and see it stored immutably on the blockchain.",
            icon: <Workflow size={35} />,
          },
          {
            Key: 2,
            title: "Verified Impact",
            number: 2,
            subtext: "Trust through transparency",
            body: "Every project shows real CO₂ reduction and tokenized credits, traceable from source to buyer with complete transparency.",
            icon: <ShieldCheck size={35} />,
          },
          {
            Key: 3,
            title: "Get Involved",
            number: 3,
            subtext: "Empowering communities & organizations",
            body: "Join as a community, NGO, or buyer — register projects, verify sites, or purchase trusted carbon credits.",
            icon: <UserPlus size={35} />,
          },
        ].map(({ Key, title, number, subtext, body, icon }) => (
          <Cards
            key={Key}
            title={title}
            number={number}
            subtext={subtext}
            body={body}
            icon={icon}
          />
        ))}
      </div>
    </div>
  );
}
