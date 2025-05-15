import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function CardHome() {
  const features = [
    {
      image: "/images/company/vehicles.png",
      title: "Kendaraan",
      path: "/vehicle",
    },
    {
      image: "/images/company/membership.png",
      title: "Membership",
      path: "/membership",
    },
    { image: "/images/company/map.png", title: "Lokasi", path: "/lokasi" },
    {
      image: "/images/company/voucher.png",
      title: "Voucher",
      path: "/voucher",
    },
  ];
  return (
    <div className="mt-12 grid grid-cols-4 gap-2 p-5 md:grid-cols-4">
      {features.map((item, index) => (
        <Link href={item.path} key={index}>
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-gray-100 p-2 shadow-md transition hover:shadow-lg"
          >
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
        </Link>
      ))}
    </div>
  );
}
