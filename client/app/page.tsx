"use client";
import { Navbar } from "./components/navbar";
import Button from "./components/ui/Button";
import { useRouter } from "next/navigation"; 
import Cards from "./components/ui/Cards";
import { ShieldCheck, UserPlus, Workflow } from "lucide-react";



export default function Home() {
  const router = useRouter();

  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-10">
        <Navbar />
      </div>

      <div
        id="heroSection"
        className="w-full h-[90vh] bg-cover bg-center flex flex-col justify-center items-center text-center"
        style={{
          backgroundImage: 'url("")',
        }}
      >
        <div
          className="text-4xl font-extrabold text-center mb-12 text-white relative inline-block pb-3
          before:block before:absolute before:bottom-0 before:left-1/2 before:-translate-x-1/2
          before:w-32 before:h-1.5 before:rounded-full before:bg-gradient-to-r "
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          Track And Trade Blue Carbon
          With Blockchain Transparency
        </div>
        <br />
        
          <Button
            text="Get Started"
            varient="primary"
            size="md"
            onClick={() => {
              router.push("/auth/signin");
            }}
          />
        
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
          
            <Cards
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
