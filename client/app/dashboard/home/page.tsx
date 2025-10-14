import Button from "@/app/components/ui/Button";
import Cards from "@/app/components/ui/Cards";
import React from "react";

const page = () => {
  return (
    <div className="space-y-6 text-gray-700">
      <div id="top" className="flex justify-between items-center flex-wrap  py-2 ">
        <div>

        <h1 className="text-3xl font-extrabold ">Welcome, {"x"}!</h1> 
        <h2 className="text-xl">Keep Making Imapact!</h2>
        </div>
       <Button size="md" variant="primary" text={"New Submission"}/>
      </div>

      <div id="main" className=" flex flex-wrap justify-between py-3 gap-2 ">
        <Cards className="h-60 w-72" 
        title={<span className=" text-xl">Total <br /> Area  Claimed</span>} subtext={<p className="text-3xl font-extrabold">245</p>}
        body="hectares"
        />
        <Cards className="h-60 w-72" 
        title={<span className=" text-xl">Total<br />   Area Verified</span>} subtext={<p className="text-3xl font-extrabold">245</p>}
        body="hectares"
        />
        <Cards className="h-60 w-72" 
        title={<span className=" text-xl">Carbon <br /> Tokens  Earned</span>} subtext={<p className="text-3xl font-extrabold">320</p>}
        body="tokens"
        />
        <Cards className="h-60 w-72" 
        title={<span className=" text-xl">Pending <br /> Verifications</span>} subtext={<p className="text-3xl font-extrabold">8</p>}
        body="Submissions"
        />
      </div>
    </div>
  );
};

export default page;
