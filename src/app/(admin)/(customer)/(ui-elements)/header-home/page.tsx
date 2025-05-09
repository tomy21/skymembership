"use client"

import Button from '@/components/ui/button/Button'
import { useKeenSlider } from 'keen-slider/react'
import 'keen-slider/keen-slider.min.css'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { FaWallet } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useCardCustomer, useDetailCustomer } from '@/hooks/useAuth'
import { ClipLoader } from "react-spinners";
import ProfileDropdown from '@/components/user-profile/ProfilDropdown'
import NotificationDropdown from '@/components/header/NotificationDropdown'

interface responseCard {
    cust_id: number,
    id: number,
    member_customer_no: string,
    plate_number: string,
    plate_number_image: string,
    rfid: string,
    stnk_image: string,
    vehicle_type: string,
}

export default function HeaderHome() {
    const {data , isLoading , isError, refetch} = useDetailCustomer();
    const { data: cardCustomer, isLoading: isLoadingCard, isError: isErrorCard } = useCardCustomer();
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

    const getInitials = (fullname : string) => {
        if (!fullname) return "";

        const names = fullname.trim().split(" ");
        const first = names[0]?.charAt(0).toUpperCase() || "";
        const second = names[1]?.charAt(0).toUpperCase() || "";

        return first + second;
    }


    if (isLoading || isLoadingCard) {
        return (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                <div className="flex flex-col items-center justify-center p-6">
                    <ClipLoader size={50} color="#3b82f6" />
                    <p className="mt-4 text-gray-700">Mohon menunggu . . .</p>
                </div>
            </div>
        )
    }

    if(isError || isErrorCard) {
        return (
            <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
                <div className="flex flex-col items-center justify-center p-6">
                    <ClipLoader size={50} color="#3b82f6" />
                    <p className="mt-4 text-gray-700">Mohon menunggu . . ..</p>
                </div>
            </div>
        )
    }
    
  return (
    <>
        <header className='flex flex-col justify-start items-center w-full bg-yellow-400 aspect-[4/3] py-2 px-3 relative'>
            <div className="flex justify-between items-center w-full">
                <div className="flex flex-row justify-center items-center space-x-3">
                    <ProfileDropdown initial={getInitials(data?.data?.fullname)}/>
                    <div className="flex flex-col justify-start items-start">
                        <h1 className='text-sm font-semibold'>{data?.data?.fullname}</h1>
                        <p className={`text-sm ${data?.data?.is_active === 0 ? "text-red-500" : "text-green-500"}`}>{data?.data?.is_active === 0 ? "Inactive" : "Active"}</p>
                    </div>
                </div>
                <NotificationDropdown/>
            </div>
            <div ref={sliderRef} className="keen-slider w-full mt-4">
            <div ref={sliderRef} className="keen-slider w-full mt-4">
            {isLoadingCard ? (
                // Skeleton loading
                [...Array(2)].map((_, index) => (
                <div key={index} className="keen-slider__slide p-2">
                    <div className="w-full max-w-[230px] aspect-[3/2] bg-gray-300 animate-pulse rounded-xl" />
                </div>
                ))
            ) : cardCustomer.data?.filter((item: responseCard) => item.rfid)?.length === 0 ? (
                // Kalau kosong
                <div className="flex flex-col justify-center items-center w-full m-auto rounded-xl overflow-hidden">
                    <Image src="/images/company/card-member.png" alt="Empty Image" width={100} height={100} />
                    <h1>Kamu belum memiliki kartu</h1>
                </div>
            ) : (
                // Data kartu
                cardCustomer.data
                .filter((item: responseCard) => item.rfid)
                .map((item: responseCard) => (
                    <div
                    key={item.id}
                    className="keen-slider__slide relative rounded-xl bg-transparent p-2 flex flex-col items-center"
                    >
                    <div className="relative w-full max-w-[230px] aspect-[3/2] rounded-xl overflow-hidden">
                        <Image
                        src={
                            item.vehicle_type === "MOBIL"
                            ? "/images/company/card03.png"
                            : "/images/company/card02.png"
                        }
                        alt="Card Image"
                        fill
                        className="object-cover rounded-xl"
                        priority
                        />
                        <div className="absolute bottom-6 left-2 text-white rounded-md px-2 py-1 text-xs font-semibold">
                        No RFID: {item.rfid.toUpperCase()}
                        </div>
                        <div className="absolute bottom-2 left-2 text-green-500 px-2 py-1 text-xs rounded-md font-semibold">
                        Active
                        </div>
                    </div>
                    </div>
                ))
            )}
        </div>

        </div>
            <div className="w-[90%] bg-white rounded-lg h-20 shadow-lg absolute -bottom-12 p-4">
                <div className="flex justify-between items-center w-full">
                    <div className="flex flex-row justify-start items-center space-x-3">
                        <FaWallet size={30} className='text-yellow-400'/>
                        <div className="flex flex-col justify-start items-start">
                            <h1 className='text-sm font-semibold'>Points</h1>
                            <p className="text-md text-slate-400">{data?.data?.points.toLocaleString()}</p>
                        </div>
                    </div>
                    <Button onClick={() => router.push("/topup")} variant={'primary'} className='bg-emerald-500 w-24 h-12'>Top up</Button>
                </div>
            </div>
      </header> 
    </>
  )
}
