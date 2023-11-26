"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Activation = () => {
  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <Image src="/tick.svg" width={50} height={50} alt="tick" />
      <div>Thanks a lto</div>
    </div>
  );
};

export default Activation;
