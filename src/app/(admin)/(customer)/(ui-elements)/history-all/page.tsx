'use client'

import React, { useEffect, useState } from 'react'
import CardHistory from '../card-history/Page'
import { useHistoryParking, useHistoryPayment } from '@/hooks/useTransaction'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface responseHistoryPayment {
  createdAt: string
  expired_date: string
  id: number
  invoice_id: string
  location_code: string
  location_name: string
  periode: string
  price: number
  product_name: string
  purchase_type: string
  statusPayment: string
  timestamp: string
  transactionType: string
  trxHistoryUser: {
    email: string
    fullname: string
  }
  trxId: string
  updatedAt: string
  user_id: number
  vehicle_type: string
  virtual_account: string
}

interface responseHistoryParking {
  balance: number
  location_name: string
  plate_number: string
  status_member: string
  tariff: number
  time: string
  type: string
}

export default function HistoryAll() {
  const [activeTab, setActiveTab] = useState('payment')
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { data } = useHistoryPayment()
  const { data: parkingHistory } = useHistoryParking()
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: 'payment', label: 'Payment' },
    { id: 'parking', label: 'Parking' },
  ]

  const filteredPayment = data?.data?.filter((item: responseHistoryPayment) =>
    item.product_name.toLowerCase().includes(search.toLowerCase()) ||
    item.purchase_type.toLowerCase().includes(search.toLowerCase())
  )

  const filteredParking = parkingHistory?.data?.filter((item: responseHistoryParking) =>
    item.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
    item.location_name?.toLowerCase().includes(search.toLowerCase())
  )

  const activeData = activeTab === 'payment' ? filteredPayment : filteredParking
  const pageCount = Math.ceil((activeData?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  useEffect(() => {
    setCurrentPage(1)
    setMounted(true)
  }, [activeTab, search])


  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleCekDetails = (id: string) => {
    router.push(`/payment?idTransaction=${id}`);
  }

  const handleExport = () => {
    const exportData = activeTab === 'payment' ? filteredPayment : filteredParking
    
    alert(`Exported ${exportData?.length} item(s) from "${activeTab}"`)
  }

  return (
    <div className="w-full min-h-screen p-5">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              activeTab === tab.id
                ? 'border-yellow-500 text-yellow-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Cari riwayat berdasarkan nama produk..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2 focus:outline-yellow-400 text-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleExport}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Export
        </button>
      </div>

      {/* Content Area */}
      <div className="flex flex-col h-[70vh] space-y-4">
        <div className="flex-1 overflow-y-auto pr-1 space-y-2">
          {activeData?.length ? (
            activeData
              .slice(startIndex, endIndex)
              .map((item: responseHistoryPayment | responseHistoryParking, index: number) => {
                const isPayment = (item as responseHistoryPayment).purchase_type !== undefined;

                return isPayment ? (
                  <CardHistory
                    key={(item as responseHistoryPayment).id}
                    type="payment"
                    onClick={() => handleCekDetails((item as responseHistoryPayment).trxId.toString())}
                    date={(item as responseHistoryPayment).createdAt}
                    product={(item as responseHistoryPayment).purchase_type}
                    location={(item as responseHistoryPayment).location_name ?? (item as responseHistoryPayment).invoice_id}
                    productName={
                      (item as responseHistoryPayment).purchase_type === 'TOPUP'
                        ? `${(item as responseHistoryPayment).product_name} Points`
                        : (item as responseHistoryPayment).product_name
                    }
                    amount={Number((item as responseHistoryPayment).price)}
                    status={(item as responseHistoryPayment).statusPayment === "PAID" ? "paid" :((item as responseHistoryPayment).statusPayment === "PENDING" ? "pending" : "failed")}
                  />
                ) : (
                  <CardHistory
                    key={index}
                    type="parking"
                    date={(item as responseHistoryParking).time ?? '-'}
                    product={(item as responseHistoryParking).plate_number}
                    location={(item as responseHistoryParking).location_name}
                    productName={(item as responseHistoryParking).status_member}
                    amount={Number((item as responseHistoryParking).tariff ?? 0)}
                    status={(item as responseHistoryParking).type === 'Masuk Area Parkir' ? 'masuk' : 'keluar'}
                    isMember={(item as responseHistoryParking).status_member !== 'NON-MEMBER'}
                  />
                );
              })
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Image
                src="/images/company/empty-box.png"
                className="opacity-20"
                alt="empty"
                width={200}
                height={200}
              />
              <h1 className="text-slate-300 text-sm mt-2">
                Kamu belum ada riwayat {activeTab}
              </h1>
            </div>
          )}

        </div>

        {/* Pagination */}
        {activeData?.length > itemsPerPage && (
          <div className="flex justify-center items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`px-3 py-1 border rounded ${
                  num === currentPage ? 'bg-yellow-500 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              disabled={currentPage === pageCount}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, pageCount))}
              className="px-3 py-1 border rounded disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
