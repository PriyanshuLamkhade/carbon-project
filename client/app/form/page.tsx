"use client";
import React, { useEffect, useState, useRef } from "react";
import InputBox from "../components/ui/InputBox";
import Button from "../components/ui/Button";

function Form() {
  const [userDetails, setUserDetails] = useState({
    organisation: "",
    name: "",
  });

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

  useEffect(() => {
    async function callDetails() {
      const response = await fetch("http://localhost:4000/users/userDetails", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setUserDetails({
          organisation: data.userDetails.organisation || "",
          name: data.userDetails.name || "",
        });
      } else {
        console.error("Failed to fetch user details", response.status);
      }
    }

    callDetails();
  }, []);

  return (
    <>
      <div className="border-b-1 border-gray-700 py-5 px-4 font-extrabold text-3xl mt-5 ">
        Form
      </div>

      {/* PERSONAL DETAILS */}
      <div id="Personal_Details" className="border-b-1 border-gray-700 py-5 px-4 text-2xl ">
        <h1 className="text-3xl font-bold">Personal Details :</h1>
        <br />
        <div className="flex gap-5 items-baseline flex-wrap">
          <label htmlFor="">Name:</label>
          <InputBox placeholder={userDetails.name} isDisabled={true} />
          <label htmlFor="">Organization:</label>
          <InputBox placeholder={userDetails.organisation} isDisabled={true} />
        </div>
      </div>

      {/* BASIC DETAILS */}
      <div id="Basic-Details" className="border-b-1 border-gray-700 py-5 px-4 text-2xl ">
        <h1 className="text-3xl font-bold">Basic Details :</h1>
        <br />
        <div className="flex gap-5 items-baseline flex-wrap">
          <label htmlFor="">Location:</label>
          <InputBox placeholder="" reference={locationRef} />
          <label htmlFor="">Area Claim:</label>
          <InputBox placeholder="in Hectare" type="number" reference={areaClaimRef} />
          <br />
          <label htmlFor="">Description:</label>
          <textarea
            rows={2}
            cols={30}
            ref={descriptionRef}
            className="bg-white border border-black p-1"
          ></textarea>
        </div>
      </div>

      {/* PLANTATION DETAILS */}
      <div id="Plantation-Details" className="border-b-1 border-gray-700 py-5 px-4 text-2xl ">
        <h1 className="text-3xl font-bold">Plantation Details :</h1>
        <br />
        <div className="gap-5 items-baseline flex flex-col">
          <div>
            <label htmlFor="">Species 1: </label>
            <InputBox placeholder="Name" reference={species1Ref} />
            <InputBox placeholder="Total Trees" type="number" className="ml-2" reference={species1CountRef} />
          </div>
          <div>
            <label htmlFor="">Species 2: </label>
            <InputBox placeholder="Name" reference={species2Ref} />
            <InputBox placeholder="Total Trees" type="number" className="ml-2" reference={species2CountRef} />
          </div>
          <div>
            <label htmlFor="">Species 3: </label>
            <InputBox placeholder="Name" reference={species3Ref} />
            <InputBox placeholder="Total Trees" type="number" className="ml-2" reference={species3CountRef} />
          </div>
          <div>
            <label htmlFor="">Plantation Date: </label>
            <InputBox type="date" reference={plantationDateRef} />
          </div>
          <div>
            <label htmlFor="">Community Involvement Level: </label>
            <select id="level" className="bg-white border border-black rounded-lg p-1">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex gap-2 justify-baseline">
            <label htmlFor="">MGNREGA Person Days:</label>
            <InputBox type="number" reference={mgnregaRef}  />
            <label htmlFor="">Trained:</label>
            <select id="trained" className="bg-white border border-black rounded-lg p-1">
              <option value="True">true</option>
              <option value="False">false</option>
            </select>
          </div>
        </div>
      </div>

      <Button
        text="Submit"
        size="lg"
        variant="secondary"
        className=" m-4"
        onClick={() => {
          submitForm();
        }}
      />
    </>
  );

  async function submitForm() {
    let formRes
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
      CommunityInvolvementLevel: (document.getElementById("level") as HTMLSelectElement)?.value,
  trained: (document.getElementById("trained") as HTMLSelectElement)?.value,
    };

    console.log("Form submission payload:", payload);
    formRes = await fetch("http://localhost:4000/users/userForm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
     return formRes
     
  }
}

export default Form;
