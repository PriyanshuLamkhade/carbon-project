"use client"

import { Navbar } from "./components/navbar";
import Button from "./components/ui/Button";
import { ShieldCheck, UserPlus, Workflow } from "lucide-react";
import Cards from "./components/ui/Cards";
import { useRouter } from "next/navigation";
import Footer from "./components/Footer";


const Homepage = () => {
     const router= useRouter();
    
  return (
   <div>
         <div className="fixed top-0 left-0 w-full z-10">
           <Navbar />
         </div>
   
         <div
           id="heroSection"
           className="relative w-full h-screen flex bg-fixed bg-center bg-cover"
           style={{
             backgroundImage: 'url("/Mangroves_at_sunset.jpg")',
           }}
         >
           {/* Optional: subtle dark overlay */}
           
   
           {/* Left Glass Panel */}
           <div className=" relative z-5 w-full md:w-[45%] h-full flex items-center px-8 md:px-16 bg-black/30 backdrop-blur-lg border-r border-white/20">
             <div className=" w-full ">
               <h1
                 className="text-white/80  mb-5 text-4xl lg:text-5xl font-extrabold leading-tight border-white  "
                 
               >
                 Track And Trade <br />Blue Carbon <br />
                 With Blockchain Transparency
               </h1>
   
               <Button
                className="w-[28vw]"
                 text="Get Started"
                 variant="primary"
                 size="lg"
                 onClick={() => {
                   router.push("/signup");
                 }}
                 
               />
             </div>
           </div>
   
           {/* Right side remains empty, shows background */}
           <div className="hidden md:block w-[50%]" />
         </div>
   
         <div
           id="cards"
           className="flex justify-evenly items-center flex-wrap gap-6 px-6 py-16 min-h-[80vh] align-center bg-white "
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
           
           {/* aboutsection */}
          <section id="about" className="px-6 md:px-20 py-32 bg-linear-to-br from-green-50 via-white to-blue-50 min-h-[90vh] ">
  <div className="max-w-6xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-gray-800 mb-8">🌍 About Layer Zero</h2>
    <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
      <strong>Layer Zero</strong> bridges grassroots restoration efforts with modern technology. We empower communities to log ecological work using geospatial forms, which are later verified by trusted admins and optionally logged on-chain — fostering integrity, impact, and traceability in global restoration efforts.
    </p>
    <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
        <h3 className="text-xl font-semibold mb-2">🌿 Environmental Restoration</h3>
        <p className="text-gray-600">From mangroves to wetlands — record and monitor your ecosystem restoration efforts.</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
        <h3 className="text-xl font-semibold mb-2">🔗 Blockchain Integrity</h3>
        <p className="text-gray-600">Immutably log verified environmental data to Solana for open auditing and traceability.</p>
      </div>
      <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-2xl transition">
        <h3 className="text-xl font-semibold mb-2">👥 Community First</h3>
        <p className="text-gray-600">Empower local organizations and individuals through accessible tools and transparent systems.</p>
      </div>
    </div>
  </div>
</section>


           {/* features section */}
         <section
  id="features"
  className="relative w-full min-h-[90vh] flex bg-fixed bg-center bg-cover "
  style={{
    backgroundImage: 'url("/Mangroves_at_sunset.jpg")',
  }}
>
  {/* Left side: just background image */}
  <div className="hidden md:block w-[50%]" />

  {/* Right side: Full-height glass panel */}
  <div className="w-full md:w-[50%] h-screen min-h-screen flex items-center px-8 md:px-16 bg-black/30 backdrop-blur-md border-l border-white/20">
    <div className="text-white w-full space-y-6">
      <h2 className="text-4xl font-bold">⚙️ Platform Features</h2>
      <ul className="space-y-4 text-lg text-white/90 list-disc list-inside">
        <li>🧾 Submit geo-tagged forms with restoration details & images</li>
        <li>✅ Admin review and satellite/drone-based verification</li>
        <li>📊 Track job creation (MGNREGA person-days) and community training</li>
        <li>🔐 Secure wallet login with nonce authentication flow</li>
        <li>📦 Optional blockchain storage for verifiable transparency</li>
        <li>🕓 Full user history via <code>historyId</code> based tracking</li>
      </ul>
    </div>
  </div>
</section>


{/* faq */}
<section id="faq" className="px-6 md:px-20 py-32 bg-linear-to-r from-white via-blue-50 to-white min-h-[80vh]">
  <div className="max-w-5xl mx-auto">
    <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">❓ Frequently Asked Questions</h2>
    <div className="space-y-6 text-gray-700 text-lg">
      <details className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
        <summary className="font-semibold text-gray-800 text-xl">✔ How does wallet-based login work?</summary>
        <p className="mt-2 text-gray-600">
          When you sign in, we generate a unique one-time code (nonce). You sign it using your wallet to prove ownership. Once verified, you're issued a secure session token stored in cookies.
        </p>
      </details>

      <details className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
        <summary className="font-semibold text-gray-800 text-xl">🌱 What kind of projects can I submit?</summary>
        <p className="mt-2 text-gray-600">
          Any project focused on ecological restoration — such as mangrove planting, reforestation, soil regeneration, or wetland revival — can be submitted, along with evidence and geolocation.
        </p>
      </details>

      <details className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
        <summary className="font-semibold text-gray-800 text-xl">🔗 Why should I use the blockchain?</summary>
        <p className="mt-2 text-gray-600">
          Logging verified restoration data on the Solana blockchain creates an immutable record. This ensures transparency for funders, buyers, and governing bodies — building trust through verifiable impact.
        </p>
      </details>

      <details className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
        <summary className="font-semibold text-gray-800 text-xl">👥 Who verifies the submitted data?</summary>
        <p className="mt-2 text-gray-600">
          Platform administrators or assigned validators manually review your submissions using uploaded images, satellite data, and field reports. Verification data is then updated in the system.
        </p>
      </details>

      <details className="bg-white p-6 rounded-lg shadow-md transition hover:shadow-lg cursor-pointer">
        <summary className="font-semibold text-gray-800 text-xl">📈 What happens after verification?</summary>
        <p className="mt-2 text-gray-600">
          The verified area is recorded, the status is updated, and the record can optionally be written to the blockchain. You’ll see the update reflected in your project history.
        </p>
      </details>
    </div>
  </div>
</section>

<Footer/>
       </div>
  )
}

export default Homepage