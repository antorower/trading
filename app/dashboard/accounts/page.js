"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";

const Accounts = () => {
  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Account Control Center" subtitle="Manage your accounts" />

      <TableWrapper title="Accouns" refresh={true} refreshFunction={() => console.log("shit")}>
        fasdfsd
      </TableWrapper>
    </div>
  );
};

export default Accounts;
