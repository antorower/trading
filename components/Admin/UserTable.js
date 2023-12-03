"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import TableWrapper from "../TableWrapper";
import TableRow from "../TableRow";

const UserTable = ({ user }) => {
  const [userTablePanelExpanded, setUserTablePanelExpanded] = useState(true);
  console.log("The user", user);
  return (
    <TableWrapper title={"User Data"} refresh={true} refreshFunction={() => console.log("good")} panelExpanded={userTablePanelExpanded} setPanelExpanded={setUserTablePanelExpanded}>
      {userTablePanelExpanded && (
        <>
          <TableRow>asdklfjklds</TableRow>
        </>
      )}
    </TableWrapper>
  );
};

export default UserTable;
