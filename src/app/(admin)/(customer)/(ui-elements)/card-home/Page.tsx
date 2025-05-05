import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function CardHome() {
    const features = [
    { image: "/images/company/vehicles.png", title: "Kendaraan", path:"/vehicle" },
    { image: "/images/company/membership.png", title: "Membership", path:"/membership" },
    { image: "/images/company/map.png", title: "Lokasi", path:"/lokasi" },
    { image: "/images/company/voucher.png", title: "Voucher", path:"/voucher" },
  ]
  return (
    <div className='grid grid-cols-4 md:grid-cols-4 gap-2 p-5 mt-12'>
      {features.map((item, index) => (
        <Link href={item.path} key={index}>
          <div
          key={index}
          className='flex flex-col items-center justify-center border border-slate-200 bg-gray-100 shadow-md rounded-md p-2 hover:shadow-lg transition'
          >
            <div className="relative w-11 h-11">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-contain"
              />
            </div>
            <div className='text-[10px] mt-1'>{item.title}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
