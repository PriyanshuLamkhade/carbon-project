import Image from "next/image";
import { Navbar } from "./components/navbar";
import Button from "./components/ui/Button";

export default function Home() {
 
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
          className="text-white font-bold text-4xl space-y-4 "
          style={{ textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          <h1>Track And Trade Blue Carbon</h1>
          <h1>With Blockchain Transparency</h1>
        </div>
        <br />
        <Button text="Get Started" varient="primary" size="md"  onClick(()=>{navigate("/signin")})/>
      </div>

      <div></div>
    </div>
  );
}
