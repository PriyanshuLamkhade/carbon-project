"use client";
import React, { useEffect, useState } from "react";
import InputBox from "../components/ui/InputBox";
import Button from "../components/ui/Button";

function Form() {
  const [userDetails, setUserDetails] = useState({
    organisation: "",
    name: "",
  });

  useEffect(() => {
    async function callDetails() {
      const response = await fetch("http://localhost:4000/users/userDetails", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming response has fields: data.organisation and data.name
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
      <div
        id="Personal_Details"
        className="border-b-1 border-gray-700 py-5 px-4 text-2xl "
      >
        <h1 className="text-3xl font-bold">Personal Details :</h1>
        <br />
        <div className="flex gap-5 items-baseline flex-wrap">
          <label htmlFor="">Name:</label>
          {userDetails.name}
          <InputBox placeholder={""} isDisabled={true} />
          <label htmlFor="">Organization:</label>
          {userDetails.organisation}
          <InputBox placeholder={""} isDisabled={true} />
        </div>
      </div>
      <div
        id="Basic-Details"
        className="border-b-1 border-gray-700 py-5 px-4 text-2xl "
      >
        <h1 className="text-3xl font-bold">Basic Details :</h1>
        <br />
        <div className="flex gap-5 items-baseline flex-wrap">
          <label htmlFor="">Location:</label> <InputBox placeholder="" />
          <label htmlFor="">Area Claim:</label>
          <InputBox placeholder="in Hectare" type="number" />
          <br />
          <label htmlFor="">Description:</label>{" "}
          <textarea
            rows={2}
            cols={30}
            id=""
            className="bg-white border border-black p-1"
          ></textarea>
        </div>
      </div>
      <div
        id="Plantation-Details"
        className="border-b-1 border-gray-700 py-5 px-4 text-2xl "
      >
        <h1 className="text-3xl font-bold">Plantation Details :</h1>
        <br />
        <div className=" gap-5 items-baseline flex flex-col ">
          <div>
            <label htmlFor="">Species 1: </label>{" "}
            <InputBox placeholder="Name" />
            <InputBox
              placeholder="Total Trees"
              type="number"
              className="ml-2"
            />
          </div>
          <div>
            <label htmlFor="">Species 2: </label>{" "}
            <InputBox placeholder="Name" />
            <InputBox
              placeholder="Total Trees"
              type="number"
              className="ml-2"
            />
          </div>
          <div>
            <label htmlFor="">Species 3: </label>{" "}
            <InputBox placeholder="Name" />
            <InputBox
              placeholder="Total Trees"
              type="number"
              className="ml-2"
            />
          </div>
          <div>
            <label htmlFor="">Plantation Date: </label> <InputBox type="date" />
          </div>
          <div>
            <label htmlFor="">Community Involvement Level: </label>
            <select
              name=""
              id="level"
              className="bg-white border border-black rounded-lg p-1"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="flex gap-2 justify-baseline">
            <label htmlFor="">MGNREGA Person Days:</label>{" "}
            <InputBox type="number" />
            <label htmlFor="">Trained:</label>
            <select
              name=""
              id="level"
              className="bg-white border border-black rounded-lg p-1"
            >
              <option value="True">True</option>
              <option value="False">False</option>
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
  async function submitForm() {}
}

export default Form;
