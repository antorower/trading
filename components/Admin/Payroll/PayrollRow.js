"use client";
import React from "react";
import Image from "next/image";
import TableRow from "../../TableRow";
import { useUserContext } from "@/context/UserContext";
import { toast } from "react-toastify";

const PayrollRow = ({ user }) => {
  const { UpdateUsers } = useUserContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  const ChangePayrollState = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/change-payroll-state`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id, state: user.publicMetadata.payroll }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      await UpdateUsers();
      successNotification(`${user.username} state successfully changed`);
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex gap-4 items-center justify-center">
        <div className="relative w-[40px] h-[40px] flex justify-center items-center">
          <Image src={user.imageUrl} alt="user-image" fill="true" sizes="32x32" className="rounded-full" />
        </div>
        <div className="flex flex-col">
          <div className="">
            {user.firstName} {user.lastName}
          </div>
          <div className="text-gray-500 text-sm">{user.username}</div>
        </div>
      </div>
      <button onClick={() => ChangePayrollState()} className={user.publicMetadata.payroll ? "btn-decline" : "btn-accept"}>
        {user.publicMetadata.payroll ? "Remove" : "Add"}
      </button>
    </TableRow>
  );
};

export default PayrollRow;
