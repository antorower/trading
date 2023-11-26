"use client";
import React, { useState, useEffect } from "react";
import UserButton from "./UserButton";

const UserBar = (props) => {
  const { users } = props;
  const [isExpaned, setIsExpanded] = useState(false);

  return (
    <div className="flex w-5/6 absolute right-0 gap-4 bg-light p-4 overflow-hidden">
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <UserButton
              imageUrl={user.imageUrl}
              id={user.id}
              username={user.username}
              firstName={user.firstName}
              lastName={user.lastName}
              isExpaned={isExpaned}
            />
          </div>
        ))}
    </div>
  );
};

export default UserBar;
