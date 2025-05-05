import { Metadata } from 'next';
import React from 'react'
import HeaderPage from '../header-page/page';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Voucher | SKY Membership",
  description:
    "Aplikasi membership SKY Parking",
  // other metadata
};

export default function Voucher() {
  return (
    <div className='bg-white w-full min-h-screen relative'>
        <HeaderPage title="Voucher"/>
        <div className="flex flex-col justify-center items-center m-auto opacity-50 min-h-[90%]">
            <Image src="/images/company/voucher.png" alt="Voucher" width={300} height={300} />
            <h1 className='text-slate-500'>Kamu belum ada voucher</h1>
        </div>
    </div>
  )
}
