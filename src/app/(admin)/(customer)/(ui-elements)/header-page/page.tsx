"use client"
import { useRouter } from 'next/navigation'
import React from 'react'
import { GoArrowLeft } from "react-icons/go";

interface HeaderPageProps {
  title: string
}

export default function HeaderPage({title} : HeaderPageProps) {
  const router = useRouter()
  return (
    <div className="relative flex items-center justify-between px-4 py-4 shadow-sm bg-yellow-400 border-b w-full">
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-1 text-gray-700 hover:text-black z-10"
      >
        <GoArrowLeft size={24} />
      </button>

      {/* Title benar-benar center */}
      <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold">
        {title}
      </h1>

      {/* Spacer untuk menjaga jarak antara kanan */}
      <div className="w-[24px]" />
    </div>

  )
}
