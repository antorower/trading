"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { SaveError } from "@/library/functions";
import Link from "next/link";
import TableWrapper from "../TableWrapper";
import TableRow from "../TableRow";
import ScheduleDay from "./ScheduleDay";
import { useAdminContext } from "@/context/AdminContext";

const Schedule = () => {
  const [schedulePanelExpanded, setSchedulePanelExpanded] = useState(false);
  const [startDay, setStartDay] = useState("");
  const [endDay, setEndDay] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const { settings, UpdateSettings } = useAdminContext();

  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    if (settings) {
      setStartDay(settings.schedule.datesSchedule.startDay);
      setEndDay(settings.schedule.datesSchedule.endDay);
      setStartMonth(settings.schedule.datesSchedule.startMonth);
      setEndMonth(settings.schedule.datesSchedule.endMonth);
    }
  }, [settings]);

  const NewWeek = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/reset-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ startDay: startDay, endDay: endDay, startMonth: startMonth, endMonth: endMonth }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification("You can start developing new schedule");
      UpdateSettings();
    } catch (error) {
      errorNotification(error.message);
    }
  };

  const ChangeDevelopmentMode = async (event, status) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/change-development-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, status }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      UpdateSettings();
    } catch (error) {
      errorNotification(error.message);
    }
  };

  if (!settings) {
    return null;
  }

  return (
    <TableWrapper title="Schedule" refresh={true} refreshFunction={UpdateSettings} panelExpanded={schedulePanelExpanded} setPanelExpanded={setSchedulePanelExpanded}>
      {schedulePanelExpanded && (
        <>
          <TableRow>
            {settings && settings.schedule.development && (
              <div className="flex gap-4">
                <input onChange={(e) => setStartDay(e.target.value)} value={startDay} className="text-input" placeholder="Starting Day" />
                <input onChange={(e) => setStartMonth(e.target.value)} value={startMonth} className="text-input" placeholder="Starting Month" />
                <input onChange={(e) => setEndDay(e.target.value)} value={endDay} className="text-input" placeholder="Ending Day" />
                <input onChange={(e) => setEndMonth(e.target.value)} value={endMonth} className="text-input" placeholder="Ending Month" />
              </div>
            )}
            {settings && !settings.schedule.development && (
              <div className="flex gap-2 items-center">
                <div className="text-lg font-weight-500">{startDay}</div>
                <div className="text-lg font-weight-500">{startMonth}</div>
                <div className="text-lg font-weight-500">-</div>
                <div className="text-lg font-weight-500">{endDay}</div>
                <div className="text-lg font-weight-500">{endMonth}</div>
              </div>
            )}
            {settings && settings.schedule.development && (
              <div className="flex gap-4">
                <button onClick={(e) => NewWeek(e)} className="btn-primary">
                  Save Dates
                </button>
                <button onClick={(e) => ChangeDevelopmentMode(e, false)} className="btn-accept">
                  Publish
                </button>
              </div>
            )}
            {settings && !settings.schedule.development && (
              <button onClick={(e) => ChangeDevelopmentMode(e, true)} className="btn-primary">
                Edit Schedule
              </button>
            )}
          </TableRow>
          {settings && (settings.schedule.monday.activeDay || settings.schedule.development) && <ScheduleDay day="Monday" data={settings?.schedule.monday} UpdateSettings={UpdateSettings} developmentMode={settings.schedule.development} />}
          {settings && (settings.schedule.tuesday.activeDay || settings.schedule.development) && <ScheduleDay day="Tuesday" data={settings?.schedule.tuesday} UpdateSettings={UpdateSettings} developmentMode={settings.schedule.development} />}
          {settings && (settings.schedule.wednesday.activeDay || settings.schedule.development) && <ScheduleDay day="Wednesday" data={settings?.schedule.wednesday} UpdateSettings={UpdateSettings} developmentMode={settings.schedule.development} />}
          {settings && (settings.schedule.thursday.activeDay || settings.schedule.development) && <ScheduleDay day="Thursday" data={settings?.schedule.thursday} UpdateSettings={UpdateSettings} developmentMode={settings.schedule.development} />}
          {settings && (settings.schedule.friday.activeDay || settings.schedule.development) && <ScheduleDay day="Friday" data={settings?.schedule.friday} UpdateSettings={UpdateSettings} developmentMode={settings.schedule.development} />}
        </>
      )}
    </TableWrapper>
  );
};

export default Schedule;
