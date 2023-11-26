"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

const SetUser = () => {
  const { userData } = useUserContext();

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [usernameValidation, setUsernameValidation] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState(false);
  const [lastNameValidation, setLastNameValidation] = useState(false);

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    /*if (userData?.username) {
      setUsernameValidation(true);
    }
    if (userData?.firstName) {
      setFirstNameValidation(true);
    }
    if (userData?.lastName) {
      setLastNameValidation(true);
    }*/
  }, [userData]);

  if (!userData) {
    return <Loading />;
  }

  const UsernameValidation = (event) => {
    event.preventDefault();
    const value = event.target.value;

    if (/^[a-zA-Z0-9]{0,12}$/.test(value) || value === "") {
      setUsername(value);
      setUsernameValidation(value.length >= 3 && value.length <= 12);
    }
  };
  const FirstNameValidation = (event) => {
    event.preventDefault();
    const value = event.target.value;

    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setFirstName(value);
      setFirstNameValidation(value.length >= 3 && value.length <= 15);
    }
  };
  const LastNameValidation = (event) => {
    event.preventDefault();
    const value = event.target.value;

    if (/^[a-zA-Z]+$/.test(value) || value === "") {
      setLastName(value);
      setLastNameValidation(value.length >= 3 && value.length <= 15);
    }
  };

  const SaveDetails = async (event) => {
    event.preventDefault();
    let status = 0;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/set-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, firstName: firstName, lastName: lastName, mentor: "nothing" }),
      });

      if (!response.ok) {
        status = response.status;
        if (response.status === 500) {
          throw new Error("Apologies, an internal server error occurred. Please refresh the page and attempt your action again.");
        }
        const data = await response.json();
        throw new Error(data.error);
      }

      successNotification("Your account is now set up. Our team will activate it shortly.");
    } catch (error) {
      errorNotification(data.error);
      await SaveError(error.message, "File: /set-user | Function: SaveDetails", status);
    }
  };

  return (
    <div className="text-white flex h-screen justify-center items-center">
      <div className="w-[300px] bg-theme2 rounded-lg p-4 flex flex-col gap-2 shadow-black shadow-lg">
        <div className="border-b border-gray-800 p-2 flex gap-2 justify-start items-center mb-2">
          <Image src="/new-user.svg" width={15} height={15} alt="new-user" />
          <div className="text-md font-nova">Provide your details</div>
        </div>
        <form onSubmit={(e) => SaveDetails(e)} className="flex flex-col gap-4">
          {userData && userData.username && (
            <div className="relative">
              <input
                type="text"
                className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full"
                placeholder="Username"
                maxLength={12}
                minLength={3}
                onChange={(e) => UsernameValidation(e)}
                value={username}
                autoComplete="off"
              />
              {usernameValidation && (
                <div className="absolute right-4 top-4">
                  <div className="relative w-4 h-4 right-0">
                    <Image src="/tick.svg" fill="true" alt="tick" />
                  </div>
                </div>
              )}
            </div>
          )}
          {userData && userData.firstName && (
            <div className="relative">
              <input
                type="text"
                className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full"
                placeholder="First Name"
                maxLength={15}
                minLength={3}
                onChange={(e) => FirstNameValidation(e)}
                value={firstName}
                autoComplete="off"
              />
              {firstNameValidation && (
                <div className="absolute right-4 top-4">
                  <div className="relative w-4 h-4 right-0">
                    <Image src="/tick.svg" fill="true" alt="tick" />
                  </div>
                </div>
              )}
            </div>
          )}
          {userData && userData.lastName && (
            <div className="relative">
              <input
                type="text"
                className="h-12 px-4 bg-theme3 rounded-md font-roboto text-theme7 placeholder-theme5 outline-none border-[#7747CA] focus:border w-full"
                placeholder="Last Name"
                maxLength={15}
                minLength={3}
                onChange={(e) => LastNameValidation(e)}
                value={lastName}
                autoComplete="off"
              />
              {lastNameValidation && (
                <div className="absolute right-4 top-4">
                  <div className="relative w-4 h-4 right-0">
                    <Image src="/tick.svg" fill="true" alt="tick" />
                  </div>
                </div>
              )}
            </div>
          )}
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
