import { Metadata } from "next";
import React from "react";
import HistoryAll from "../history-all/page";
import HeaderPage from "@/components/header-page/page";

export const metadata: Metadata = {
  title: "History | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Lokasi() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <HeaderPage title="View All History" />
      <HistoryAll />
    </div>
  );
}
