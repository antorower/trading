"use client";
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const params = useSearchParams();
  const mentorId = params.get("id");

  if (typeof localStorage !== "undefined" && mentorId) {
    localStorage.setItem("mentor", mentorId);
  }

  return (
    <div className="flex justify-center items-center h-full">
      <SignIn />
    </div>
  );
}

