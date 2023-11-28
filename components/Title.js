import React, { useState, useEffect } from "react";

const Title = ({ title, subtitle }) => {
  return (
    <div className="flex flex-wrap justify-between items-center px-2">
      <div className="flex flex-col gap-1">
        <div className="font-roboto font-weight-500 text-2xl">{title}</div>
        <div className="font-roboto text-sm text-gray-500">{subtitle}</div>
      </div>
      <div className="text-lg font-weight-600">{new Intl.DateTimeFormat("en-US", { day: "numeric", month: "long", year: "numeric" }).format(new Date())}</div>
    </div>
  );
};

export default Title;
