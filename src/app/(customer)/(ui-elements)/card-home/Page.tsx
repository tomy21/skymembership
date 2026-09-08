/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useCardList } from "@/hooks/useVehicle";
import { InfoIcon } from "@/icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiChevronDown, FiCreditCard, FiX } from "react-icons/fi";

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
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const { data: dataCard, refetch: refetchCard } = useCardList(isAuthenticated);

  const [isMembershipModalOpen, setIsMembershipModalOpen] = useState(false);

  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState<DetailCard | null>(null);

  const features = [
    {
      image: "/images/company/vehicles.png",
      title: "Kendaraan",
      description: "Kelola kendaraan",
      path: "/vehicle",
      disable: false,
    },
    {
      image: "/images/company/membership.png",
      title: "Membership",
      description: "Kelola membership",
      path: "/membership",
      disable: false,
    },
    {
      image: "/images/company/map.png",
      title: "Lokasi",
      description: "Cari lokasi",
      path: "/lokasi",
      disable: false,
    },
    {
      image: "/images/company/voucher.png",
      title: "Voucher",
      description: "Lihat voucher",
      path: "/voucher",
      disable: false,
    },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    refetchCard();
  }, [isAuthenticated, refetchCard]);

  const handleFeatureClick = (item: (typeof features)[number]) => {
    if (item.disable) {
      return;
    }

    if (item.title === "Membership") {
      setIsMembershipModalOpen(true);
      return;
    }

    router.push(item.path);
  };

  const handleExtend = () => {
    if (!selectedCard?.rfid) {
      return;
    }

    setIsVehicleModalOpen(false);
    router.push(`/extend-membership?idCard=${selectedCard.rfid}`);
  };

  return (
    <section className="px-5 pt-20">
      <div className="mx-auto max-w-6xl">
        {/* Section title */}
        <div className="mb-4">
          <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            Explore
          </p>

          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Quick Actions
          </h2>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {features.map((item) => (
            <button
              key={item.title}
              type="button"
              disabled={item.disable}
              onClick={() => handleFeatureClick(item)}
              className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md ${
                item.disable ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={34}
                    height={34}
                    className="object-contain"
                  />
                </div>

                <FiArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600" />
              </div>

              <div className="mt-4">
                <p className="text-sm font-bold text-slate-900">{item.title}</p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Membership modal */}
      {isMembershipModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm"
          onClick={() => setIsMembershipModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                <InfoIcon className="h-6 w-6 text-blue-500" />
              </div>

              <button
                type="button"
                onClick={() => setIsMembershipModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <div className="mt-5">
              <h2 className="text-lg font-bold text-slate-900">Membership</h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apa yang ingin Anda lakukan?
              </p>
            </div>

            <div className="mt-5 space-y-3">
              <button
                type="button"
                onClick={() => {
                  setIsMembershipModalOpen(false);
                  setIsVehicleModalOpen(true);
                }}
                className="flex w-full items-center justify-between rounded-2xl border border-slate-200 p-4 text-left transition hover:border-yellow-400 hover:bg-yellow-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100">
                    <FiCreditCard className="text-yellow-600" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Perpanjang
                    </p>

                    <p className="text-xs text-slate-400">
                      Perpanjang membership kendaraan
                    </p>
                  </div>
                </div>

                <FiArrowRight className="text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMembershipModalOpen(false);
                  router.push("/membership");
                }}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-900 p-4 text-left text-white transition hover:bg-slate-800"
              >
                <div>
                  <p className="text-sm font-bold">Daftar Membership</p>

                  <p className="mt-0.5 text-xs text-white/60">
                    Buat membership baru
                  </p>
                </div>

                <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vehicle modal */}
      {isVehicleModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm"
          onClick={() => setIsVehicleModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50">
                  <FiCreditCard className="text-xl text-blue-500" />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900">
                  Pilih Kendaraan
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pilih kendaraan yang ingin diperpanjang.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100"
              >
                <FiX />
              </button>
            </div>

            <div className="relative mt-5">
              <select
                value={selectedCard ? JSON.stringify(selectedCard) : ""}
                onChange={(event) => {
                  if (!event.target.value) {
                    setSelectedCard(null);
                    return;
                  }

                  setSelectedCard(JSON.parse(event.target.value));
                }}
                className="w-full appearance-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-slate-700 transition outline-none focus:border-yellow-400 focus:bg-white focus:ring-4 focus:ring-yellow-100"
              >
                <option value="">Pilih kendaraan</option>

                {dataCard?.data?.map((card: any, index: number) => (
                  <option
                    key={`${card.rfid}-${index}`}
                    value={JSON.stringify(card)}
                  >
                    {card.rfid} - {card.vehicle_type}
                    {card.plate_number ? ` - ${card.plate_number}` : ""}
                  </option>
                ))}
              </select>

              <FiChevronDown className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-slate-400" />
            </div>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setIsVehicleModalOpen(false)}
                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="button"
                disabled={!selectedCard}
                onClick={handleExtend}
                className="flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
              >
                Perpanjang
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
