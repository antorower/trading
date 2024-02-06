"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import TableRow from "@/components/TableRow";

const ScheduleDay = ({ day, data, UpdateSettings, developmentMode }) => {
  const [activePairs, setActivePairs] = useState(null);
  const [startingTradingHour, setStartingTradingHour] = useState("");
  const [endingTradingHour, setEndingTradingHour] = useState("");
  const [lotsFactor, setLotsFactor] = useState("");
  const [activeDay, setActiveDay] = useState(false);

  const forexPairs = ["EURUSD", "GBPUSD", "AUDUSD", "NZDUSD", "USDJPY", "USDCAD", "USDCHF", "EURGBP", "EURJPY", "EURCHF", "EURCAD", "EURAUD", "GBPJPY", "GBPCHF", "GBPCAD", "GBPAUD", "AUDJPY", "AUDCHF", "AUDCAD", "AUDNZD", "NZDJPY", "NZDCHF", "NZDCAD", "CADJPY", "CADCHF", "CHFJPY"];
  //Removed Pairs: "EURNZD", "GBPNZD"
  const successNotification = (message) => toast.success(message);
  const errorNotification = (message) => toast.warn(message);

  useEffect(() => {
    setActivePairs(data.pairs);
    setStartingTradingHour(data.startingTradingHour);
    setEndingTradingHour(data.endingTradingHour);
    setLotsFactor(data.lotsFactor);
    setActiveDay(data.activeDay);
  }, [data]);

  const RemovePairs = (currency) => {
    let updatedPairs;
    if (currency === "EUR" || currency === "GBP") {
      updatedPairs = activePairs.filter((pair) => !pair.includes("EUR"));
      updatedPairs = updatedPairs.filter((pair) => !pair.includes("GBP"));
    } else if (currency === "NZD" || currency === "AUD") {
      updatedPairs = activePairs.filter((pair) => !pair.includes("AUD"));
      updatedPairs = updatedPairs.filter((pair) => !pair.includes("NZD"));
    } else if (currency === "USD" || currency === "CAD") {
      updatedPairs = activePairs.filter((pair) => !pair.includes("USD"));
      updatedPairs = updatedPairs.filter((pair) => !pair.includes("CAD"));
    } else {
      updatedPairs = activePairs.filter((pair) => !pair.includes(currency));
    }
    setActivePairs(updatedPairs);
  };

  const UpdateDaySettings = async (event) => {
    try {
      event.preventDefault();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/settings/save-day-settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ day: day.toLowerCase(), pairs: activePairs, startingTradingHour: startingTradingHour, endingTradingHour: endingTradingHour, lotsFactor: lotsFactor, activeDay: activeDay }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      successNotification(`You have successfully update ${day} settings`);
      await UpdateSettings();
    } catch (error) {
      errorNotification(error.message);
    }
  };

  return (
    <TableRow>
      <div className="flex w-full flex-col gap-8 justify-center">
        <div className="flex w-full justify-between items-center">
          <div className="font-weight-500 text-lg">{day}</div>
          {activeDay && (
            <>
              <div className="flex gap-4 justify-center items-center">
                <div className="text-gray-500 text-sm">Start: </div>
                <input onChange={(e) => setStartingTradingHour(e.target.value)} value={startingTradingHour} type="number" className="text-input w-[80px]" />
              </div>
              <div className="flex gap-4 justify-center items-center">
                <div className="text-gray-500 text-sm">End: </div>
                <input onChange={(e) => setEndingTradingHour(e.target.value)} value={endingTradingHour} type="number" className=" text-input w-[80px]" />
              </div>
              <div className="flex gap-4 justify-center items-center">
                <div className="text-gray-500 text-sm">Lots Factor: </div>
                <input onChange={(e) => setLotsFactor(e.target.value)} value={lotsFactor} type="number" className=" text-input w-[80px]" />
              </div>
            </>
          )}
          {developmentMode && (
            <>
              <input onChange={(e) => setActiveDay(e.target.checked)} checked={activeDay} type="checkbox" className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer" />
              <button onClick={(e) => UpdateDaySettings(e)} className="btn-accept">
                Save {day} Settings
              </button>
            </>
          )}
        </div>

        {activeDay && developmentMode && (
          <div className="flex justify-between">
            <div className="flex gap-4 justify-center items-center">
              <div>Remove:</div>
              <button onClick={() => RemovePairs("EUR")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                EUR
              </button>
              <button onClick={() => RemovePairs("USD")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                USD
              </button>
              <button onClick={() => RemovePairs("GBP")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                GBP
              </button>
              <button onClick={() => RemovePairs("JPY")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                JPY
              </button>
              <button onClick={() => RemovePairs("CHF")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                CHF
              </button>
              <button onClick={() => RemovePairs("CAD")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                CAD
              </button>
              <button onClick={() => RemovePairs("AUD")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                AUD
              </button>
              <button onClick={() => RemovePairs("NZD")} className="rounded border border-gray-700 px-4 py-2 hover:bg-violet-950">
                NZD
              </button>
            </div>
            <button onClick={() => setActivePairs(forexPairs)} className="btn-primary">
              Restore
            </button>
          </div>
        )}
        {activeDay && (
          <div className="flex gap-4 flex-wrap justify-center items-center">
            {activePairs.map((pair, index) => (
              <div key={index} className="rounded border border-gray-700 px-4 py-2">
                {pair}
              </div>
            ))}
          </div>
        )}
      </div>
    </TableRow>
  );
};

export default ScheduleDay;
