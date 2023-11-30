"use client"
import React from "react";

const FirmsCheckbox = ({propFirm, selectPropFirm, selectedPropFirm, disabled}) => {
  return (
    <div className="flex gap-2 items-center">
            <input
              type="checkbox"
              disabled={disabled}
              onChange={() => selectPropFirm(propFirm)}
              checked={propFirm === selectedPropFirm}
              className="h-4 w-4 appearance-none checked:bg-violet-600 bg-gray-500  rounded-full border-[3px] border-white cursor-pointer"
            />
            <div className="font-weight-500 text-lg">{propFirm}</div>
          </div>
  );
};

export default FirmsCheckbox;