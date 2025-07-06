"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function CardHome() {
  const [maintenance] = useState(false);
  const features = [
    {
      image: "/images/company/vehicles.png",
      title: "Kendaraan",
      path: "/vehicle",
      disable: false,
    },
    {
      image: "/images/company/membership.png",
      title: "Membership",
      path: "/membership",
      disable: false,
    },
    {
      image: "/images/company/map.png",
      title: "Lokasi",
      path: "/lokasi",
      disable: false,
    },
    {
      image: "/images/company/voucher.png",
      title: "Voucher",
      path: "/voucher",
      disable: false,
    },
  ];
  const router = useRouter();
  return (
    <div className="p-5">
      <div className="mt-12 grid grid-cols-4 gap-2 md:grid-cols-4">
        {features.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (!item.disable) router.push(item.path);
            }}
            className={`${
              item.disable ? "pointer-events-none opacity-50" : "cursor-pointer"
            }`}
          >
            <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-gray-100 p-2 shadow-md transition hover:shadow-lg">
              <div className="relative h-11 w-11">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="mt-1 text-[10px]">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
      {maintenance && (
        <div className="bg-warning-50 border-warning-200 mt-5 mb-3 flex w-full items-center justify-between rounded-xl border p-3">
          <h1 className="text-xs">
            Maaf transaksi anda terganggu saat ini kami sedang lakukan perbaikan
            untuk proses pembelian ataupun topup
          </h1>
        </div>
      )}
    </div>
  );
}
