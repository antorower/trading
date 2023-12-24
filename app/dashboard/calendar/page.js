"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import TableWrapper from "@/components/TableWrapper";
import Title from "@/components/Title";
import TableRow from "@/components/TableRow";
import { useUserContext } from "@/context/UserContext";

const Name = () => {
  const [calendarPanelExpanded, setCalendarPanelExpanded] = useState(true);
  const { settings } = useUserContext();

  if (!settings) {
    return (
      <div className="flex h-full justify-center items-center">
        <div className="relative w-[36px] h-[36px] animate-spin">
          <Image src="/spinner.svg" fill="true" alt="spinner" sizes="32x32" />
        </div>
      </div>
    );
  }

  if (settings?.schedule.development) {
    return <div className="flex justify-center items-center h-full text-white font-weight-600 text-lg"> Under Development... </div>;
  }

  return (
    <div className="text-white h-full flex flex-col overflow-auto scrollable p-8 gap-8">
      <Title title="Calendar" subtitle="Trading days and hours" />
      <TableWrapper title="Schedule" refresh="" refreshFunction="" panelExpanded={calendarPanelExpanded} setPanelExpanded={setCalendarPanelExpanded}>
        <TableRow>
          <div className="flex flex-col items-center">
            <div className="text-gray-500">Monday</div>
            {settings.schedule.monday.activeDay ? (
              <div className="text-lg font-weight-700">
                {settings.schedule.monday.startingTradingHour}:00 - {settings.schedule.monday.endingTradingHour}:00
              </div>
            ) : (
              <Image src="/reject-red.svg" width={20} height={20} />
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="text-gray-500">Tuesday</div>
            {settings.schedule.tuesday.activeDay ? (
              <div className="text-lg font-weight-700">
                {settings.schedule.tuesday.startingTradingHour}:00 - {settings.schedule.tuesday.endingTradingHour}:00
              </div>
            ) : (
              <Image src="/reject-red.svg" width={20} height={20} />
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="text-gray-500">Wednesday</div>
            {settings.schedule.wednesday.activeDay ? (
              <div className="text-lg font-weight-700">
                {settings.schedule.wednesday.startingTradingHour}:00 - {settings.schedule.wednesday.endingTradingHour}:00
              </div>
            ) : (
              <Image src="/reject-red.svg" width={20} height={20} />
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="text-gray-500">Thursday</div>
            {settings.schedule.thursday.activeDay ? (
              <div className="text-lg font-weight-700">
                {settings.schedule.thursday.startingTradingHour}:00 - {settings.schedule.thursday.endingTradingHour}:00
              </div>
            ) : (
              <Image src="/reject-red.svg" width={20} height={20} />
            )}
          </div>

          <div className="flex flex-col items-center">
            <div className="text-gray-500">Friday</div>
            {settings.schedule.friday.activeDay ? (
              <div className="text-lg font-weight-700">
                {settings.schedule.friday.startingTradingHour}:00 - {settings.schedule.friday.endingTradingHour}:00
              </div>
            ) : (
              <Image src="/reject-red.svg" width={20} height={20} />
            )}
          </div>
        </TableRow>
      </TableWrapper>
    </div>
  );
};

export default Name;
