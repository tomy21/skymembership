import { Metadata } from "next";
import React from "react";
import CardLocation from "@/components/CardLocation";
import HeaderPage from "@/components/header-page/page";

export const metadata: Metadata = {
  title: "Lokasi | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Lokasi() {
  return (
    <div className="relative min-h-screen w-sm bg-white">
      <HeaderPage title="Lokasi Member" />
      <CardLocation />
    </div>
  );
}
