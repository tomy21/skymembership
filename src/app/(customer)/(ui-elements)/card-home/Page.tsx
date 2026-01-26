/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useCardList } from "@/hooks/useVehicle";
import { InfoIcon } from "@/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { MdOutlineAnnouncement } from "react-icons/md";

interface DetailCard {
  member_customer_no: string;
  rfid: string;
  vehicle_type: string;
  plate_number: string;
  customer_membership_detail: {
    is_active: number;
    location_id: string;
  };
}

export default function CardHome() {
  const [maintenance] = useState(false);
  const [totalSlides, setTotalSlides] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVehicleOpen, setIsModalVehicleOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isAuthenticated } = useAuth();
  const [selectedCard, setSelectedCard] = useState<DetailCard | null>(null);

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

  const { data: dataCard, refetch: refetchCard } = useCardList(isAuthenticated);

  useEffect(() => {
    refetchCard();
    setTotalSlides(dataCard?.data.length || 0);
    setMounted(true);
  }, [dataCard?.data.length, refetchCard]);

  const router = useRouter();

  const handleModalExtend = () => {
    setIsModalVehicleOpen(true);
    setIsModalOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className="p-5">
      {/* {totalSlides > 0 && (
        <p className="mt-12 mb-3 text-center text-sm font-light italic">
          Untuk memperpanjang membership anda, silahkan klik pada gambar kartu
          yang ada di atas!
        </p>
      )} */}
      <div
        className={`mt-12 grid grid-cols-4 gap-2 md:grid-cols-4 ${totalSlides > 0 ? "" : "mt-12"}`}
      >
        {features.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              if (item.title === "Membership") {
                // buka modal kalau klik membership
                setIsModalOpen(true);
              } else if (!item.disable) {
                router.push(item.path);
              }
            }}
            className={`${item.disable ? "pointer-events-none opacity-50" : "cursor-pointer"
              }`}
          >
            <div className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-gray-100 p-2 shadow-md transition hover:shadow-lg">
              <div className="relative h-11 w-12">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
              <div className="mt-1 text-[9px]">{item.title}</div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsModalOpen(false)} // klik backdrop -> close
        >
          <div
            className="relative w-80 rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} // biar klik dalam modal gak nutup
          >
            <div className="mb-4 flex flex-row items-center justify-center space-x-3">
              <InfoIcon className="text-blue-500 h-20 w-20" />
              <h2 className="text-lg font-semibold">Membership Info</h2>
            </div>

            <p className="text-center text-sm text-gray-600">
              Apakah anda ingin membuat membership atau melakukan perpanjangan?
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={handleModalExtend}
                className="rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Perpanjang
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  router.push("/membership");
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Daftar Baru
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalVehicleOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setIsModalVehicleOpen(false)} // klik backdrop -> close
        >
          <div
            className="relative w-80 rounded-xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()} // biar klik dalam modal gak nutup
          >
            <div className="mb-4 flex flex-row items-center justify-center space-x-3 text-center">
              <InfoIcon className="text-blue-500 h-20 w-20" />
              <h2 className="text-lg font-semibold">Masukan No RFID</h2>
            </div>

            <p className="text-center text-sm text-gray-600">
              Untuk perpanjang membership silahkan pilih kendaraan yang akan di
              perpanjang!
            </p>

            <div className="relative mt-5 mb-4 w-full">
              <select
                value={selectedCard ? JSON.stringify(selectedCard) : ""}
                onChange={(e) => setSelectedCard(JSON.parse(e.target.value))}
                className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Kartu --</option>
                {dataCard?.data?.map((card: any, idx: number) => (
                  <option key={idx} value={JSON.stringify(card)}>
                    {card.rfid} - {card.vehicle_type}
                    {card.plate_number ? ` - ${card.plate_number}` : ""}
                  </option>
                ))}
              </select>

              {/* Icon panah dropdown */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                onClick={() => {
                  router.push(`extend-membership?idCard=${selectedCard?.rfid}`);
                  console.log("Extend membership kendaraan");
                  setIsModalVehicleOpen(false); // ✅ close setelah action
                }}
                className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm hover:bg-gray-300"
              >
                Perpanjang
              </button>
              <button
                onClick={() => setIsModalVehicleOpen(false)}
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

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
