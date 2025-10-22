"use client";
import React, { useEffect, useState, useRef } from "react";
import InputBox from "../../components/ui/InputBox";
import Button from "../../components/ui/Button";
import { useRouter } from "next/navigation";

import MapPicker from "@/app/components/InitMap";

function Form() {
  const [location, setLocation] = useState<{
    lat: number;
    lon: number;
    address: string;
  } | null>(null);

  const router = useRouter();
  const [userDetails, setUserDetails] = useState({
    organisation: "",
    name: "",
  });

  // useEffect(() => {
  //   async function callDetails() {
  //     const response = await fetch("http://localhost:4000/users/userDetails", {
  //       method: "GET",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUserDetails({
  //         organisation: data.userDetails.organisation || "",
  //         name: data.userDetails.name || "",
  //       });
  //     } else {
  //       console.error("Failed to fetch user details", response.status);
  //     }
  //   }

  //   callDetails();
  // }, []);

  //  BASIC DETAILS refs
  const locationRef = useRef<HTMLInputElement>(null);
  const areaClaimRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  //  PLANTATION DETAILS refs
  const species1Ref = useRef<HTMLInputElement>(null);
  const species1CountRef = useRef<HTMLInputElement>(null);
  const species2Ref = useRef<HTMLInputElement>(null);
  const species2CountRef = useRef<HTMLInputElement>(null);
  const species3Ref = useRef<HTMLInputElement>(null);
  const species3CountRef = useRef<HTMLInputElement>(null);
  const plantationDateRef = useRef<HTMLInputElement>(null);
  const mgnregaRef = useRef<HTMLInputElement>(null);

  // select values can be accessed via state or directly via DOM if needed

  return (
    <div className="max-w-4xl mx-auto my-10 bg-linear-to-br from-green-50 to-green-100 rounded-2xl shadow-2xl p-10">
      
      <form>
        <div className="border-b border-gray-300 text-center pb-6 mb-8">
          <h1 className="text-4xl font-extrabold text-gray-700">
            Please Fill Details
          </h1>
        </div>

        {/* PERSONAL DETAILS */}
        <section className="space-y-6 border-b mb-8 pb-8" id="Personal_Details">
          <h2 className="text-2xl font-semibold text-gray-700">
            Personal Details :
          </h2>
          <br />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-gray-600 font-medium mb-1"
              >
                Name:
              </label>
              <InputBox
                className="ml-2"
                placeholder={userDetails.name}
                isDisabled={true}
              />
            </div>
            <div>
              <label
                htmlFor="organization"
                className="block text-gray-600 font-medium mb-1"
              >
                Organization:
              </label>
              <InputBox
                className="ml-2"
                placeholder={userDetails.organisation}
                isDisabled={true}
              />
            </div>
          </div>
        </section>

        {/* BASIC DETAILS */}
        <section
          id="Basic-Details"
          className="border-b border-gray-300 pb-6 mb-3"
        >
          <h2 className="text-3xl font-bold text-gray-700 mb-6">
            Basic Details :
          </h2>
          <div className="flex flex-col gap-6">
            <div>
        <h1>Select a Location</h1>
        <MapPicker setLocation={setLocation} />
       
          <div style={{ marginTop: "1rem" }}>
            <p>
              <strong>Latitude:</strong> {location?.lat.toFixed(6)}
            </p>
            <p>
              <strong>Longitude:</strong> {location?.lon.toFixed(6)}
            </p>
            
          </div>
      
      </div>
            <label className="flex flex-col gap-1 text-gray-600 text-lg">
              Location:
              <InputBox
                placeholder={location?.address ?? "Select location on map"}
                reference={locationRef}
                className="w-full"
                isDisabled={true}
              />
            </label>

            <label className="flex flex-col gap-1 text-gray-600 text-lg">
              Area Claim:
              <InputBox
                placeholder="in Hectare"
                type="number"
                reference={areaClaimRef}
                className="w-full"
              />
            </label>
          </div>
          <br />
          <label className="flex flex-col gap-1 text-gray-600 text-lg">
            Description:
            <textarea
              rows={3}
              cols={30}
              ref={descriptionRef}
              className="bg-white  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent p-3 rounded-lg resize-none"
            ></textarea>
          </label>
        </section>

        {/* PLANTATION DETAILS */}
        <section
          className="space-y-6 bg-linear-to-br from-green-100 to-green-200 p-6 rounded-xl shadow-inner"
          id="Plantation-Details"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Plantation Details :
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Species 1:
              </label>
              <InputBox
                placeholder="Name"
                reference={species1Ref}
                className="w-full"
              />
              <InputBox
                placeholder="Total Trees"
                type="number"
                reference={species1CountRef}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Species 2:
              </label>
              <InputBox
                placeholder="Name"
                reference={species2Ref}
                className="w-full"
              />
              <InputBox
                placeholder="Total Trees"
                type="number"
                reference={species2CountRef}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Species 3:
              </label>
              <InputBox
                placeholder="Name"
                reference={species3Ref}
                className="w-full"
              />
              <InputBox
                placeholder="Total Trees"
                type="number"
                reference={species3CountRef}
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Plantation Date:
              </label>
              <InputBox
                type="date"
                reference={plantationDateRef}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Community Involvement Level:
              </label>
              <select
                id="level"
                className="bg-white   focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-lg p-2 w-full"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                MGNREGA Person Days:
              </label>
              <InputBox
                type="number"
                reference={mgnregaRef}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-1">
                Trained:
              </label>
              <select
                id="trained"
                className="bg-white  focus:outline-none
        focus:ring-2 focus:ring-blue-500 focus:border-transparent  rounded-lg p-2 w-full"
              >
                <option value="True">true</option>
                <option value="False">false</option>
              </select>
            </div>
          </div>
        </section>

        <Button
          text="Submit"
          size="lg"
          variant="third"
          className="mt-8 mx-auto block w-[100%] border-0"
          onClick={async () => {
            const res = await submitForm();
            if (res && res.ok) {
              router.push("/dashboard/home");
            } else {
              console.error("Form submission failed.");
            }
          }}
        />
      </form>
    </div>
  );

  async function submitForm() {
    const payload = {
      location: locationRef.current?.value,
      areaclaim: areaClaimRef.current?.valueAsNumber,
      description: descriptionRef.current?.value,
      species1: species1Ref.current?.value,
      species1_count: species1CountRef.current?.valueAsNumber,
      species2: species2Ref.current?.value,
      species2_count: species2CountRef.current?.valueAsNumber,
      species3: species3Ref.current?.value,
      species3_count: species3CountRef.current?.valueAsNumber,
      plantationDate: plantationDateRef.current?.value,
      MGNREGAPersonDays: mgnregaRef.current?.valueAsNumber,
      CommunityInvolvementLevel: (
        document.getElementById("level") as HTMLSelectElement
      )?.value,
      trained: (document.getElementById("trained") as HTMLSelectElement)?.value,
    };

    console.log("Form submission payload:", payload);

    try {
      const formRes = await fetch("http://localhost:4000/users/userForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      return formRes;
    } catch (error) {
      console.error("Error during form submission:", error);
      return null;
    }
  }
}

export default Form;
