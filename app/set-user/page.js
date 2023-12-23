"use client";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const SetUser = () => {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [usernameValidation, setUsernameValidation] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState(false);
  const [lastNameValidation, setLastNameValidation] = useState(false);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const UsernameValidation = (event) => {
    const value = event.target.value;

    if (/^[a-zA-Z0-9]{0,12}$/.test(value) || value === "") {
      setUsername(value);
      setUsernameValidation(value.length >= 3 && value.length <= 12);
    }
  };
  const FirstNameValidation = (event) => {
    const value = event.target.value;

    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setFirstName(value);
      setFirstNameValidation(value.length >= 3 && value.length <= 15);
    }
  };
  const LastNameValidation = (event) => {
    const value = event.target.value;

    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setLastName(value);
      setLastNameValidation(value.length >= 3 && value.length <= 15);
    }
  };
  const SaveDetails = async (event) => {
    event.preventDefault();
    if (!localStorage.getItem("mentor")) {
      errorNotification("Sorry, you don't have the necessary permissions to access our platform.");
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/set-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, firstName: firstName, lastName: lastName, mentor: localStorage.getItem("mentor") }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("Your account is now set up. Our team will activate it shortly.");
      router.push("/activation");
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <div className="text-white flex h-screen justify-center items-center">
      <div className="w-[300px] bg-theme2 rounded-lg p-4 flex flex-col gap-2 shadow-black shadow-lg">
        <div className="border-b border-gray-700 p-2 flex gap-2 justify-start items-center mb-2">
          <Image src="/new-user.svg" width={15} height={15} alt="new-user" />
          <div className="text-md font-nova">Provide your details</div>
        </div>
        <form onSubmit={(e) => SaveDetails(e)} className="flex flex-col gap-4">
          <div className="relative">
            <input type="text" className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full" placeholder="Username" maxLength={12} minLength={3} onChange={(e) => UsernameValidation(e)} value={username} autoComplete="off" />
            {usernameValidation && (
              <div className="absolute right-4 top-4">
                <div className="relative w-4 h-4 right-0">
                  <Image src="/tick.svg" fill="true" alt="tick" sizes="32x32" />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <input type="text" className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full" placeholder="First Name" maxLength={15} minLength={3} onChange={(e) => FirstNameValidation(e)} value={firstName} autoComplete="off" />
            {firstNameValidation && (
              <div className="absolute right-4 top-4">
                <div className="relative w-4 h-4 right-0">
                  <Image src="/tick.svg" fill="true" alt="tick" sizes="32x32" />
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <input type="text" className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full" placeholder="Last Name" maxLength={15} minLength={3} onChange={(e) => LastNameValidation(e)} value={lastName} autoComplete="off" />
            {lastNameValidation && (
              <div className="absolute right-4 top-4">
                <div className="relative w-4 h-4 right-0">
                  <Image src="/tick.svg" fill="true" alt="tick" sizes="32x32" />
                </div>
              </div>
            )}
          </div>

          {usernameValidation && firstNameValidation && lastNameValidation && (
            <button className="flex items-center justify-center btn-primary gap-3">
              <Image src="/plus.svg" width={13} height={13} alt="plus" />
              <div>Register</div>
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default SetUser;
