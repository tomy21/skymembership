"use client";

import React, { useState } from "react";
import CardHistory from "../card-history/Page";
import Link from "next/link";
import { useHistoryParking, useHistoryPayment } from "@/hooks/useTransaction";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface responseHistoryPayment {
  createdAt: string;
  expired_date: string;
  id: number;
  invoice_id: string;
  location_code: string;
  location_name: string;
  periode: string;
  price: number;
  product_name: string;
  purchase_type: string;
  statusPayment: string;
  timestamp: string;
  transactionType: string;
  trxHistoryUser: {
    email: string;
    fullname: string;
  };
  trxId: string;
  updatedAt: string;
  user_id: number;
  vehicle_type: string;
  virtual_account: string;
}

interface responseHistoryParking {
  balance: number;
  location_name: string;
  plate_number: string;
  status_member: string;
  tariff: number;
  time: string;
  type: string;
}

export default function HistoryHome() {
  const [activeTab, setActiveTab] = useState("payment");
  const { data } = useHistoryPayment();
  const { data: parkingHistory } = useHistoryParking();
  // const [modalDetail, setModalDetail] = useState(false);
  const router = useRouter();
  const tabs = [
    { id: "payment", label: "Payment" },
    { id: "parking", label: "Parking" },
  ];

  const handleCekDetails = (id: string) => {
    router.push(`/payment?idTransaction=${id}`);
  };

  return (
    <div className="w-full p-5">
      {/* Tabs */}
      <div className="mb-3 flex w-full items-center justify-between">
        <h1 className="text-md font-semibold">History</h1>
        <Link href="/view-all">
          <h1 className="text-md font-medium text-yellow-400">View all</h1>
        </Link>
      </div>
      <div className="flex space-x-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4">
        {activeTab === "payment" && (
          <div className="aspect-[5/4] space-y-2 overflow-x-hidden overflow-y-auto">
            {data?.data?.length <= 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Image
                  src="/images/company/empty-box.png"
                  className="opacity-20"
                  alt="empty"
                  width={200}
                  height={200}
                />
                <h1 className="text-sm text-slate-300">
                  Kamu belum ada riwayat pembayaran
                </h1>
              </div>
            ) : (
              data?.data?.map((items: responseHistoryPayment) => (
                <CardHistory
                  key={items.id}
                  onClick={() => handleCekDetails(items.trxId.toString())}
                  type="payment"
                  date={items.createdAt}
                  product={items.purchase_type}
                  location={items.location_name ?? items.invoice_id}
                  productName={
                    items.purchase_type === "TOPUP"
                      ? `${items.product_name} Points`
                      : items.product_name
                  }
                  amount={Number(items.price)}
                  status={
                    items.statusPayment === "PAID"
                      ? "paid"
                      : items.statusPayment === "PENDING"
                        ? "pending"
                        : "failed"
                  }
                />
              ))
            )}
          </div>
        )}

        {activeTab === "parking" && (
          <div className="aspect-[4/3] space-y-2 overflow-x-hidden overflow-y-auto">
            {parkingHistory?.data?.length <= 0 ? (
              <div className="flex h-full flex-col items-center justify-center">
                <Image
                  src="/images/company/empty-box.png"
                  className="opacity-20"
                  alt="empty"
                  width={200}
                  height={200}
                />
                <h1 className="text-sm text-slate-300">
                  Kamu belum ada riwayat parking
                </h1>
              </div>
            ) : (
              parkingHistory?.data?.map(
                (items: responseHistoryParking, index: number) => (
                  <CardHistory
                    key={index}
                    type="parking"
                    date={items.time}
                    product={items.plate_number}
                    location={items.location_name}
                    productName={items.status_member}
                    amount={items.tariff ?? 0}
                    status={
                      items.type === "Masuk Area Parkir" ? "masuk" : "keluar"
                    }
                    isMember={items.status_member !== "NON-MEMBER"}
                  />
                ),
              )
            )}
          </div>
        )}
      </div>

      {/* {modalDetail && (
        <div className='bg-black/50 fixed inset-0 z-50 flex justify-center items-center'>
            <div className="bg-white w-2/3">Cek</div>
        </div>
      )} */}
    </div>
  );
}
