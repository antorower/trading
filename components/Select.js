"use client";
import React from "react";

const Select = ({ selectOption, children }) => {
  return <select onChange={selectOption} className="bg-gray-700 text-white rounded-lg p-2">
    {children}
  </select>;
};

export default Select;