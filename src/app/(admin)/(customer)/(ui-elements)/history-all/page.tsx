"use client";

import React, { useEffect, useState } from "react";
import CardHistory from "../card-history/Page";
import { useHistoryParking, useHistoryPayment } from "@/hooks/useTransaction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { dataCustomer } from "../../../../../../libs/API/ExportData";
import { toast } from "sonner";
import Loading from "@/components/Loading/Loading";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

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

export default function HistoryAll() {
  const [activeTab, setActiveTab] = useState("payment");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalPayment, setModalPayment] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const { isAuthenticated } = useAuth();

  const { data: paymentHistory } = useHistoryPayment(
    isAuthenticated,
    currentPage,
    itemsPerPage,
    search,
  );
  const { data: parkingHistory } = useHistoryParking(
    isAuthenticated,
    currentPage,
    itemsPerPage,
    search,
  );
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const tabs = [
    { id: "payment", label: "Payment" },
    { id: "parking", label: "Parking" },
  ];

  useEffect(() => {
    function updateCount() {
      const cardHeight = 160;
      const reserved = 240;
      const perPage = Math.max(
        1,
        Math.floor((window.innerHeight - reserved) / cardHeight),
      );
      setItemsPerPage(perPage);
    }

    updateCount();
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, []);

  const pageDataPayment = paymentHistory?.data || [];
  const pageDataParking = parkingHistory?.data || [];
  const totalPagesPayment = paymentHistory?.pagination.totalPages;
  const totalPagesParking = parkingHistory?.totalPages;

  const activeData =
    activeTab === "payment" ? pageDataPayment : pageDataParking;
  const pageCount =
    activeTab === "payment" ? totalPagesPayment : totalPagesParking;

  useEffect(() => {
    setCurrentPage(1);
    setMounted(true);
  }, [activeTab, search]);

  if (!mounted) {
    // selama SSR dan sebelum mount, tolak render interaktif
    return null;
  }

  const handleCekDetails = (id: string) => {
    router.push(`/payment?idTransaction=${id}`);
  };

  const handleExport = () => {
    // const exportData = activeTab === 'payment' ? filteredPayment : filteredParking

    if (activeTab === "payment") {
      setModalPayment(true);
    }

    if (activeTab === "parking") {
      setModalPayment(true);
    }

    // alert(`Exported ${exportData?.length} item(s) from "${activeTab}"`)
  };

  const handleSubmitExport = async () => {
    if (!startDate || !endDate) return;

    setIsLoading(true);

    if (activeTab === "payment") {
      const result = await dataCustomer.exportDataPayment(startDate, endDate);

      if (result.error) {
        toast.error(result.message);
        setIsLoading(false);
        setStartDate("");
        setEndDate("");
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
      setStartDate("");
      setEndDate("");
    } else if (activeTab === "parking") {
      const result = await dataCustomer.exportDataTransaction(
        startDate,
        endDate,
      );

      if (result.error) {
        toast.error(result.message);
        setIsLoading(false);
        setStartDate("");
        setEndDate("");
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
      setStartDate("");
      setEndDate("");
    }
  };

  const handleCancel = () => {
    setModalPayment(false);
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full p-5">
      {/* Tabs */}
      <div className="mb-4 flex space-x-4 border-b border-gray-300">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? "border-yellow-500 text-yellow-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Export */}
      <div className="mb-4 flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center md:space-y-0">
        <input
          type="text"
          placeholder={`${activeTab === "payment" ? "Cari riwayat berdasarkan nama produk..." : "Cari riwayat berdasarkan nama riwayat..."}`}
          className="w-full rounded border border-gray-300 px-4 py-2 text-sm focus:outline-yellow-400 md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleExport}
          className="rounded bg-yellow-500 px-4 py-2 text-white transition hover:bg-yellow-600"
        >
          Export
        </button>
      </div>

      {/* Content Area */}
      <div className="flex h-[70vh] flex-col space-y-4">
        <div className="flex-1 space-y-2 overflow-y-auto pr-1">
          {activeData?.length ? (
            activeData.map(
              (
                item: responseHistoryPayment | responseHistoryParking,
                index: number,
              ) => {
                const isPayment =
                  (item as responseHistoryPayment).purchase_type !== undefined;

                return isPayment ? (
                  <CardHistory
                    key={(item as responseHistoryPayment).id}
                    type="payment"
                    onClick={() =>
                      handleCekDetails(
                        (item as responseHistoryPayment).trxId.toString(),
                      )
                    }
                    date={(item as responseHistoryPayment).createdAt}
                    product={(item as responseHistoryPayment).purchase_type}
                    location={
                      (item as responseHistoryPayment).location_name ??
                      (item as responseHistoryPayment).invoice_id
                    }
                    productName={
                      (item as responseHistoryPayment).purchase_type === "TOPUP"
                        ? `${(item as responseHistoryPayment).product_name} Points`
                        : (item as responseHistoryPayment).product_name
                    }
                    amount={Number((item as responseHistoryPayment).price)}
                    status={
                      (item as responseHistoryPayment).statusPayment === "PAID"
                        ? "paid"
                        : (item as responseHistoryPayment).statusPayment ===
                            "PENDING"
                          ? "pending"
                          : "failed"
                    }
                  />
                ) : (item as responseHistoryParking).time ? (
                  <CardHistory
                    key={index}
                    type="parking"
                    date={(item as responseHistoryParking).time}
                    product={(item as responseHistoryParking).plate_number}
                    location={(item as responseHistoryParking).location_name}
                    productName={(item as responseHistoryParking).status_member}
                    amount={Number(
                      (item as responseHistoryParking).tariff ?? 0,
                    )}
                    status={
                      (item as responseHistoryParking).type ===
                      "Masuk Area Parkir"
                        ? "masuk"
                        : "keluar"
                    }
                    isMember={
                      (item as responseHistoryParking).status_member !==
                      "NON-MEMBER"
                    }
                  />
                ) : null;
              },
            )
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Image
                src="/images/company/empty-box.png"
                className="opacity-20"
                alt="empty"
                width={200}
                height={200}
              />
              <h1 className="mt-2 text-sm text-slate-300">
                Kamu belum ada riwayat {activeTab}
              </h1>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <FaArrowLeft />
            </button>
            <span>
              Page {currentPage} / {pageCount}
            </span>
            <button
              className="rounded bg-gray-200 px-4 py-2 disabled:opacity-50"
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
            >
              <FaArrowRight />
            </button>
          </div>
        )}

        {modalPayment && (
          <div className="fixed top-0 left-0 z-[999] flex h-full w-full items-center justify-center bg-black/50">
            <div className="w-[90%] max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-lg">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Export Filter
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitExport}
                  disabled={!startDate || !endDate}
                  className={`rounded-lg px-4 py-2 text-white ${
                    startDate && endDate
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-blue-300"
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
  );
}
