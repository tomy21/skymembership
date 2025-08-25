"use client";

import { useAuth } from "@/context/AuthContext";
import { useCardList } from "@/hooks/useVehicle";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { MdOutlineAnnouncement } from "react-icons/md";

export default function CardHome() {
  const [maintenance] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const { isAuthenticated } = useAuth();
  const features = [
    {
      image: "/images/company/vehicles.png",
      title: "Kendaraan",
      path: "/vehicle",
      disable: false,
    },
    {
      image: "/images/company/membership.png",
      title: "New Member",
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

  const { data: dataCard, refetch: refetchCard } = useCardList(isAuthenticated);

  useEffect(() => {
    refetchCard();
    setTotalSlides(dataCard?.data.length || 0);
  }, [dataCard?.data.length, refetchCard]);

  const router = useRouter();
  return (
    <div className="p-5">
      {totalSlides > 0 && (
        <p className="mt-12 mb-3 text-center text-sm font-light italic">
          Untuk meperpanjang membership anda, silahkan klik pada gambar kartu
          yang ada di atas !
        </p>
      )}
      <div
        className={`grid grid-cols-4 gap-2 md:grid-cols-4 ${totalSlides > 0 ? "" : "mt-12"}`}
      >
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
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="mt-1 text-[10px]">{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      {maintenance && (
        <div className="bg-warning-50 border-warning-200 mb-3 flex w-full items-center justify-between rounded-xl border p-3">
          <h1 className="text-xs">
            Maaf transaksi anda terganggu saat ini kami sedang lakukan perbaikan
            untuk proses pembelian ataupun topup
          </h1>
        </div>
      )}
    </div>
  );
}
