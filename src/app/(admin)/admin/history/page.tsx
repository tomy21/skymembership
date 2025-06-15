import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Admin SKY Membership",
  description: "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-white">
      <h1>Admin HO</h1>
    </div>
  );
}
