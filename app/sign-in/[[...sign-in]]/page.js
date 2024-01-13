"use client";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();

  if (typeof localStorage !== "undefined") {
    localStorage.setItem("mentor", params.get("id"));
  }
  return (
    <div className="flex justify-center items-center h-full">
      <SignIn />
    </div>
  );
}
