'use client'

import React, { useEffect, useState } from 'react'
import CardHistory from '../card-history/Page'
import { useHistoryParking, useHistoryPayment } from '@/hooks/useTransaction'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { dataCustomer } from '../../../../../../libs/API/ExportData'
import { toast } from 'sonner'
import Loading from '@/components/Loading/Loading'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

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
  const [modalPayment, setModalPayment] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const { data: paymentHistory } = useHistoryPayment(currentPage, itemsPerPage, search)
  const { data: parkingHistory } = useHistoryParking()
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: 'payment', label: 'Payment' },
    { id: 'parking', label: 'Parking' },
  ]

  useEffect(() => {
      function updateCount() {
        const cardHeight = 160;
        const reserved = 240;
        const perPage = Math.max(1, Math.floor((window.innerHeight - reserved) / cardHeight));
        setItemsPerPage(perPage);
      }
      
      updateCount();
      window.addEventListener("resize", updateCount);
      return () => window.removeEventListener("resize", updateCount);
    }, []);

    const pageDataPayment = paymentHistory?.data || [];
    const pageDataParking = parkingHistory?.data || [];
    const totalPagesPayment = paymentHistory?.pagination.totalPages 
    const totalPagesParking = parkingHistory?.totalPages 

  const activeData = activeTab === 'payment' ? pageDataPayment : pageDataParking
  const pageCount = activeTab === 'payment' ? totalPagesPayment : totalPagesParking

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
    // const exportData = activeTab === 'payment' ? filteredPayment : filteredParking

    if(activeTab === "payment"){
      setModalPayment(true)
    }

    if(activeTab === "parking"){
      setModalPayment(false)
    }
    
    // alert(`Exported ${exportData?.length} item(s) from "${activeTab}"`)
  }

  const handleSubmitExport = async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);
  
    const result = await dataCustomer.exportDataPayment(startDate, endDate);

    if (result.error) {
      toast.error(result.message);
      setIsLoading(false);
      setStartDate('');
      setEndDate('');
      return;
    }

    // download file
    const url = window.URL.createObjectURL(result.blob || new Blob());
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", result.fileName || "export.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
    setIsLoading(false);
    setModalPayment(false);
    setStartDate('');
    setEndDate('');
  };

  const handleCancel = () => {
    setModalPayment(false);
    setStartDate('');
    setEndDate('');
  }

  if(isLoading){
    return (
      <Loading/>
    )
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
            activeData.map((item: responseHistoryPayment | responseHistoryParking, index: number) => {
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
        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage} / {pageCount}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              <FaArrowRight />
            </button>
          </div>
        )}

        {modalPayment && (
          <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[999] flex items-center justify-center">
            <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-lg space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Export Filter</h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitExport}
                  disabled={!startDate || !endDate}
                  className={`px-4 py-2 rounded-lg text-white ${
                    startDate && endDate
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-300 cursor-not-allowed'
                  }`}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
