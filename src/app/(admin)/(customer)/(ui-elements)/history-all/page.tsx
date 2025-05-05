'use client'

import React, { useState } from 'react'
import CardHistory from '../card-history/Page'
import { useHistoryParking, useHistoryPayment } from '@/hooks/useTransaction'
import Image from 'next/image'

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

  const { data } = useHistoryPayment()
  const { data: parkingHistory } = useHistoryParking()

  const tabs = [
    { id: 'payment', label: 'Payment' },
    { id: 'parking', label: 'Parking' },
  ];

  // 🔍 FILTER DATA BERDASARKAN SEARCH
  const filteredPayment = data?.data?.filter((item: responseHistoryPayment) =>
    item.product_name.toLowerCase().includes(search.toLowerCase()) ||
    item.purchase_type.toLowerCase().includes(search.toLowerCase())
  )

  const filteredParking = parkingHistory?.data?.filter((item: responseHistoryParking) =>
    item.plate_number?.toLowerCase().includes(search.toLowerCase()) ||
    item.location_name?.toLowerCase().includes(search.toLowerCase())
  )

  // 📤 EXPORT (Placeholder Logic)
  const handleExport = () => {
    const exportData = activeTab === 'payment' ? filteredPayment : filteredParking
    console.log('Exported Data:', exportData)

    // Tambahkan logika ekspor ke CSV/Excel di sini
    alert(`Exported ${exportData?.length} item(s) from "${activeTab}"`)
  }

  return (
    <div className="w-full min-h-screen p-5">
      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mt-4 space-y-2 md:space-y-0">
        <input
          type="text"
          placeholder="Cari riwayat..."
          className="border border-gray-300 rounded px-4 py-2 w-full md:w-1/2"
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

      {/* Content */}
      <div className="mt-4 h-[70vh] overflow-y-auto space-y-4">
        {activeTab === 'payment' && (
          <div className="overflow-y-auto overflow-x-hidden space-y-2">
            {filteredPayment?.length ? (
              filteredPayment.map((item: responseHistoryPayment) => (
                <CardHistory
                  key={item.id}
                  type="payment"
                  date={item.createdAt}
                  product={item.purchase_type}
                  location={
                    item.location_name === null ? item.invoice_id : item.location_name
                  }
                  productName={
                    item.purchase_type === 'TOPUP'
                      ? `${item.product_name} Points`
                      : item.product_name
                  }
                  amount={Number(item.price)}
                  status="paid"
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Image src="/images/company/empty-box.png" className='opacity-20' alt="empty" width={200} height={200} />
                <h1 className="text-slate-300 text-sm">Kamu belum ada riwayat pembayaran</h1>
              </div> 
            )}
          </div>
        )}

        {activeTab === 'parking' && (
          <div className="overflow-y-auto overflow-x-hidden space-y-2">
            {filteredParking?.length ? (
              filteredParking.map(
                (item: responseHistoryParking, index: number) => (
                  
                  <CardHistory
                    key={index}
                    type="parking"
                    date={item.time ?? "-"}
                    product={item.plate_number}
                    location={item.location_name}
                    productName={item.status_member}
                    amount={Number(item.tariff ?? 0) }
                    status={
                      item.type === 'Masuk Area Parkir' ? 'masuk' : 'keluar'
                    }
                    isMember={item.status_member !== 'NON-MEMBER'}
                  />
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Image src="/images/company/empty-box.png" className='opacity-20' alt="empty" width={200} height={200} />
                <h1 className="text-slate-300 text-sm">Kamu belum ada riwayat parking</h1>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
