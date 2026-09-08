import HeaderPage from "@/components/header-page/page";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Voucher | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Voucher() {
  return (
    <div className="min-h-screen w-full bg-[#f7f8fa]">
      <HeaderPage title="Voucher" />

      <main className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-xl items-center justify-center px-4 pb-10">
        <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
            <Image
              src="/images/company/voucher.png"
              alt="Voucher"
              width={120}
              height={120}
              className="h-20 w-20 object-contain opacity-60"
            />
          </div>

          <h1 className="mt-5 text-base font-bold text-slate-800">
            Belum Ada Voucher
          </h1>

          <p className="mt-1 max-w-xs text-sm leading-5 text-slate-400">
            Saat ini kamu belum memiliki voucher yang tersedia.
          </p>
        </div>
      </main>
    </div>
  );
}
