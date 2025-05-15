"use client";

import Button from "@/components/ui/button/Button";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import React, { useEffect } from "react";
import { FaWallet } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCardCustomer, useDetailCustomer } from "@/hooks/useAuth";
import { ClipLoader } from "react-spinners";
import ProfileDropdown from "@/components/user-profile/ProfilDropdown";
import NotificationDropdown from "@/components/header/NotificationDropdown";

interface responseCard {
  cust_id: number;
  id: number;
  member_customer_no: string;
  plate_number: string;
  plate_number_image: string;
  rfid: string;
  stnk_image: string;
  vehicle_type: string;
}

export default function HeaderHome() {
  const { data, isLoading, isError, refetch } = useDetailCustomer();
  const {
    data: cardCustomer,
    isLoading: isLoadingCard,
    isError: isErrorCard,
  } = useCardCustomer();
  const router = useRouter();
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 1,
      spacing: 50,
    },
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const getInitials = (fullname: string) => {
    if (!fullname) return "";

    const names = fullname.trim().split(" ");
    const first = names[0]?.charAt(0).toUpperCase() || "";
    const second = names[1]?.charAt(0).toUpperCase() || "";

    return first + second;
  };

  if (isLoading || isLoadingCard) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center justify-center p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <p className="mt-4 text-gray-700">Mohon menunggu . . .</p>
        </div>
      </div>
    );
  }

  if (isError || isErrorCard) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center justify-center p-6">
          <ClipLoader size={50} color="#3b82f6" />
          <p className="mt-4 text-gray-700">Mohon menunggu . . ..</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="relative flex aspect-[4/3] w-full flex-col items-center justify-start bg-yellow-400 px-3 py-2">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-row items-center justify-center space-x-3">
            <ProfileDropdown initial={getInitials(data?.data?.fullname)} />
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-sm font-semibold">{data?.data?.fullname}</h1>
              <p
                className={`text-sm ${data?.data?.is_active === 0 ? "text-red-500" : "text-green-500"}`}
              >
                {data?.data?.is_active === 0 ? "Inactive" : "Active"}
              </p>
            </div>
          </div>
          <NotificationDropdown />
        </div>
        <div ref={sliderRef} className="keen-slider mt-4 w-full">
          <div ref={sliderRef} className="keen-slider mt-4 w-full">
            {isLoadingCard ? (
              // Skeleton loading
              [...Array(2)].map((_, index) => (
                <div key={index} className="keen-slider__slide p-2">
                  <div className="aspect-[3/2] w-full max-w-[230px] animate-pulse rounded-xl bg-gray-300" />
                </div>
              ))
            ) : cardCustomer.data?.filter((item: responseCard) => item.rfid)
                ?.length === 0 ? (
              // Kalau kosong
              <div className="m-auto flex w-full flex-col items-center justify-center overflow-hidden rounded-xl">
                <Image
                  src="/images/company/card-member.png"
                  alt="Empty Image"
                  width={100}
                  height={100}
                />
                <h1>Kamu belum memiliki kartu</h1>
              </div>
            ) : (
              // Data kartu
              cardCustomer.data
                .filter((item: responseCard) => item.rfid)
                .map((item: responseCard) => (
                  <div
                    key={item.id}
                    className="keen-slider__slide relative flex flex-col items-center rounded-xl bg-transparent p-2"
                  >
                    <div className="relative aspect-[3/2] w-full max-w-[230px] overflow-hidden rounded-xl">
                      <Image
                        src={
                          item.vehicle_type === "MOBIL"
                            ? "/images/company/card03.png"
                            : "/images/company/card02.png"
                        }
                        alt="Card Image"
                        fill
                        className="rounded-xl object-cover"
                        priority
                      />
                      <div className="absolute bottom-6 left-2 rounded-md px-2 py-1 text-xs font-semibold text-white">
                        No RFID: {item.rfid.toUpperCase()}
                      </div>
                      <div className="absolute bottom-2 left-2 rounded-md px-2 py-1 text-xs font-semibold text-green-500">
                        Active
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
        <div className="absolute -bottom-12 h-20 w-[90%] rounded-lg bg-white p-4 shadow-lg">
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-row items-center justify-start space-x-3">
              <FaWallet size={30} className="text-yellow-400" />
              <div className="flex flex-col items-start justify-start">
                <h1 className="text-sm font-semibold">Points</h1>
                <p className="text-md text-slate-400">
                  {data?.data?.points.toLocaleString()}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/topup")}
              variant={"primary"}
              className="h-12 w-24 bg-emerald-500"
            >
              Top up
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
