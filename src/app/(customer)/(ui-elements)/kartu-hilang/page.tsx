import { Metadata } from "next";
import React from "react";
// import CardLocation from "@/components/CardLocation";
import HeaderPage from "@/components/header-page/page";
import PageKartuHilang from "./context/page";

export const metadata: Metadata = {
  title: "Kartu Hilang | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function KartuHilang() {
  return (
    <div className="relative min-h-screen w-full bg-white sm:w-sm">
      <HeaderPage title="Kartu Hilang" />
      <PageKartuHilang />
    </div>
  );
}
