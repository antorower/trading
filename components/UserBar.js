"use client";
import React, { useState, useEffect } from "react";
import UserButton from "./UserButton";
import Image from "next/image";
import { useInterfaceContext } from "@/context/InterfaceContext";
import { useUserContext } from "@/context/UserContext";

const UserBar = (props) => {
  const { users } = props;
  const { expandedRightSidebar, setExpandedRightSidebar } = useInterfaceContext();
  const { selectedUser, setSelectedUser } = useUserContext();
  const [userss, setUserss] = useState([]);

  const generateUserArray = () => {
    const userArray = [];

    for (let i = 1; i <= 50; i++) {
      userArray.push({
        imageUrl: "/admin.svg",
        id: i,
        username: `user${i}`,
        firstName: `FirstName${i}`,
        lastName: `LastName${i}`,
      });
    }

    return userArray;
  };

  useEffect(() => {
    setUserss(generateUserArray());
  }, []);

  return (
    <div
      onMouseEnter={() => setExpandedRightSidebar(true)}
      onMouseLeave={() => setExpandedRightSidebar(false)}
      className={`flex flex-col gap-4 h-full relative justify-center p-4 ${
        expandedRightSidebar ? "w-[250px]" : "w-[0px]"
      } transition-all duration-500 border-l border-gray-900`}
    >
      <div
        onClick={() => setExpandedRightSidebar(!expandedRightSidebar)}
        className="cursor-pointer absolute flex justify-center items-center text-white bg-dark  -left-[20px] rounded-full border border-gray-900 w-[40px] h-[40px]"
      >
        <Image src={`/${expandedRightSidebar ? "left" : "right"}-arrow.svg`} width={10} height={10} alt="left-arrow" />
      </div>
      <div className="text-white overflow-hidden flex justify-center">asdfasdf</div>
      <div className={`flex flex-col justify-start items-center h-full gap-4 overflow-y-auto overflow-x-hidden scrollable`}>
        {users &&
          users.map((user) => (
            <div className="" key={user.id}>
              <UserButton
                imageUrl={user.imageUrl}
                id={user.id}
                username={user.username}
                firstName={user.firstName}
                lastName={user.lastName}
                isExpaned={expandedRightSidebar}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserBar;
