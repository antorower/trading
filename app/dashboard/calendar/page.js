"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";

const Name = () => {
  const [calendarPanelExpanded, setCalendarPanelExpanded] = useState(true);

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Calendar" subtitle="Trading days and hours" />
      <TableWrapper title="Days" refresh="" refreshFunction="" panelExpanded={calendarPanelExpanded} setPanelExpanded={setCalendarPanelExpanded}>
        <TableRow>
          <div className="flex w-full justify-between items-center">
            <div className="font-weight-500 text-lg">Monday</div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500">Trading day schedule</div>
              <div className="text-lg font-weight-700">9:00 - 13:00</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-gray-500">Report Hours</div>
              <div className="text-lg font-weight-700">16:00 - 21:00</div>
            </div>
            <button className="btn-decline">Reject</button>
          </div>
        </TableRow>
        <TableRow>Tuesday</TableRow>
        <TableRow>Wednesday</TableRow>
        <TableRow>Thursday</TableRow>
        <TableRow>Friday</TableRow>
      </TableWrapper>
    </div>
  );
};

export default Name;
