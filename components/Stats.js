"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useUserContext } from "@/context/UserContext";

const Stats = () => {
  const { stats } = useUserContext();
  console.log("Stats: ", stats);
  return <div>content</div>;
};

export default Stats;
