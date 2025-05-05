
import { Metadata } from "next";
import React from "react";
import HeaderPage from "../header-page/page";
import CardLocation from "@/components/CardLocation";

export const metadata: Metadata = {
  title: "Lokasi | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};



export default function Lokasi() {
  

  return (
    <div className="bg-white w-full min-h-screen relative">
      <HeaderPage title="Lokasi Member" />
      <CardLocation/>
    </div>
  );
}
