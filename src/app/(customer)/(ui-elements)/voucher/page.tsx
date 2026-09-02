import { Metadata } from "next";
import React from "react";
import Image from "next/image";
import HeaderPage from "@/components/header-page/page";

export const metadata: Metadata = {
  title: "Voucher | SKY Membership",
  description: "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Voucher() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <HeaderPage title="Voucher" />
      <div className="m-auto flex min-h-[90%] flex-col items-center justify-center opacity-50">
        <Image
          src="/images/company/voucher.png"
          alt="Voucher"
          width={300}
          height={300}
        />
        <h1 className="text-slate-500">Kamu belum ada voucher</h1>
      </div>
    </div>
  );
}
