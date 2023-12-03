"use client";
import React, { useState } from "react";
import Image from "next/image";
const TableWrapper = ({ children, title, refresh, refreshFunction, panelExpanded, setPanelExpanded }) => {
  return (
    <div className={`flex flex-col bg-light rounded-${panelExpanded ? "xl" : "full"} px-8 ${panelExpanded && "pb-8"} gap-4`}>
      <div className="flex justify-between items-center border-b border-gray-800 py-4 px-2">
        <div className="font-roboto font-weight-500 text-lg">{title}</div>
        <div className="flex gap-8">
          {panelExpanded && refresh && (
            <button onClick={refreshFunction} className="w-[14px] h-[14px] relative">
              <Image src="/refresh.svg" fill="true" alt="refresh-icon" sizes="32x32" />
            </button>
          )}
          <button onClick={() => setPanelExpanded(!panelExpanded)} className="w-[14px] h-[14px] relative">
            <Image src={`/${panelExpanded ? "minus" : "plus"}.svg`} fill="true" sizes="32x32" alt="expand-icon" />
          </button>
        </div>
      </div>
      {panelExpanded && <div className="flex flex-col gap-4 px-2 mt-4">{children}</div>}
    </div>
  );
};

export default TableWrapper;
