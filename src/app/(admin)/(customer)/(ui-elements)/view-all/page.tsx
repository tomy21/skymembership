
import { Metadata } from "next";
import React from "react";
import HeaderPage from "../header-page/page";
import HistoryAll from "../history-all/page";

export const metadata: Metadata = {
  title: "Lokasi | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Lokasi() {

  return (
    <div className="bg-white w-full min-h-screen relative">
      <HeaderPage title="View All History" />
      <HistoryAll/>
    </div>
  );
}
