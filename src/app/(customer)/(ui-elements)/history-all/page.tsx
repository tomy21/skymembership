"use client";

import Loading from "@/components/Loading/Loading";
import { useAuth } from "@/context/AuthContext";
import { useHistoryParking, useHistoryPayment } from "@/hooks/useTransaction";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { FiDownload, FiSearch, FiX } from "react-icons/fi";
import { toast } from "sonner";
import { dataCustomer } from "../../../../../libs/API/ExportData";
import CardHistory from "../card-history/Page";

interface ResponseHistoryPayment {
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

interface ResponseHistoryParking {
  balance: number;
  location_name: string;
  plate_number: string;
  status_member: string;
  tariff: number;
  time: string;
  type: string;
}

type ActiveTab = "payment" | "parking";

export default function HistoryAll() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>("payment");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalPayment, setModalPayment] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const itemsPerPage = 5;

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

  const tabs: {
    id: ActiveTab;
    label: string;
  }[] = [
    {
      id: "payment",
      label: "Pembayaran",
    },
    {
      id: "parking",
      label: "Parkir",
    },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  if (!mounted) {
    return null;
  }

  const pageDataPayment = paymentHistory?.data || [];

  const pageDataParking = parkingHistory?.data || [];

  const totalPagesPayment = paymentHistory?.pagination?.totalPages || 0;

  const totalPagesParking = parkingHistory?.totalPages || 0;

  const activeData =
    activeTab === "payment" ? pageDataPayment : pageDataParking;

  const pageCount =
    activeTab === "payment" ? totalPagesPayment : totalPagesParking;

  const handleCekDetails = (id: string) => {
    if (!id) {
      toast.error("ID transaksi tidak ditemukan");
      return;
    }

    router.push(`/payment?idTransaction=${id}`);
  };

  const handleExport = () => {
    setStartDate("");
    setEndDate("");
    setModalPayment(true);
  };

  const handleCancel = () => {
    if (isLoading) {
      return;
    }

    setModalPayment(false);
    setStartDate("");
    setEndDate("");
  };

  const handleSubmitExport = async () => {
    if (!startDate || !endDate) {
      toast.error("Silakan pilih tanggal mulai dan tanggal akhir");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Tanggal akhir tidak boleh sebelum tanggal mulai");
      return;
    }

    setIsLoading(true);

    try {
      const result =
        activeTab === "payment"
          ? await dataCustomer.exportDataPayment(startDate, endDate)
          : await dataCustomer.exportDataTransaction(startDate, endDate);

      if (result.error) {
        toast.error(result.message || "Gagal melakukan export data");
        return;
      }

      const blob = result.blob || new Blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;
      link.download =
        result.fileName ||
        `${
          activeTab === "payment" ? "payment-history" : "parking-history"
        }.xlsx`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Data berhasil diexport");

      setModalPayment(false);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      console.error("Export error:", error);

      toast.error("Terjadi kesalahan saat export data");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((page) => Math.min(pageCount, page + 1));
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {isLoading && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
          <Loading />
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-200 bg-amber-300">
        <div className="mx-auto flex h-16 w-full max-w-xl items-center px-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-700 transition hover:bg-slate-100"
            aria-label="Kembali"
          >
            <FaArrowLeft size={16} />
          </button>

          <h1 className="flex-1 text-center text-lg font-bold text-slate-900">
            Riwayat
          </h1>

          <div className="h-9 w-9" />
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-xl px-4 pb-10">
        {/* Tabs */}
        <section className="pt-5">
          <div className="grid grid-cols-2 rounded-xl bg-slate-200/70 p-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* Search & Export */}
        <section className="mt-4">
          <div className="flex gap-2">
            <div className="relative min-w-0 flex-1">
              <FiSearch
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder={
                  activeTab === "payment"
                    ? "Cari produk..."
                    : "Cari plat nomor atau lokasi..."
                }
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pr-4 pl-10 text-sm text-slate-900 transition outline-none placeholder:text-slate-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute top-1/2 right-3 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Hapus pencarian"
                >
                  <FiX size={15} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleExport}
              className="flex h-11 shrink-0 items-center gap-2 rounded-xl bg-yellow-400 px-4 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 active:scale-[0.98]"
            >
              <FiDownload size={17} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </section>

        {/* History */}
        <section className="mt-5">
          {activeData?.length ? (
            <div className="space-y-3">
              {activeData.map(
                (
                  item: ResponseHistoryPayment | ResponseHistoryParking,
                  index: number,
                ) => {
                  const isPayment =
                    (item as ResponseHistoryPayment).purchase_type !==
                    undefined;

                  if (isPayment) {
                    const payment = item as ResponseHistoryPayment;

                    return (
                      <CardHistory
                        key={payment.id || payment.trxId}
                        type="payment"
                        onClick={() =>
                          handleCekDetails(payment.trxId?.toString())
                        }
                        date={payment.createdAt}
                        product={payment.purchase_type}
                        location={payment.location_name ?? payment.invoice_id}
                        productName={
                          payment.purchase_type === "TOPUP"
                            ? `${payment.product_name} Points`
                            : payment.product_name
                        }
                        amount={Number(payment.price || 0)}
                        status={
                          payment.statusPayment === "PAID"
                            ? "paid"
                            : payment.statusPayment === "PENDING"
                              ? "pending"
                              : "failed"
                        }
                      />
                    );
                  }

                  const parking = item as ResponseHistoryParking;

                  if (!parking.time) {
                    return null;
                  }

                  return (
                    <CardHistory
                      key={`${parking.time}-${parking.plate_number}-${index}`}
                      type="parking"
                      date={parking.time}
                      product={parking.plate_number}
                      location={parking.location_name}
                      productName="-"
                      platNumber={parking.plate_number}
                      amount={Number(parking.tariff || 0)}
                      status={
                        parking.type === "Masuk Area Parkir"
                          ? "masuk"
                          : "keluar"
                      }
                      isMember={parking.status_member !== "NON-MEMBER"}
                    />
                  );
                },
              )}
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
                <Image
                  src="/images/company/empty-box.png"
                  alt="Tidak ada riwayat"
                  width={100}
                  height={100}
                  className="h-20 w-20 object-contain opacity-40"
                />
              </div>

              <h2 className="mt-5 text-base font-bold text-slate-800">
                Belum ada riwayat
              </h2>

              <p className="mt-1 max-w-xs text-sm leading-5 text-slate-400">
                {search
                  ? "Tidak ada riwayat yang sesuai dengan pencarian Anda."
                  : `Kamu belum memiliki riwayat ${
                      activeTab === "payment" ? "pembayaran" : "parkir"
                    }.`}
              </p>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-4 rounded-lg px-4 py-2 text-sm font-semibold text-yellow-600 hover:bg-yellow-50"
                >
                  Hapus pencarian
                </button>
              )}
            </div>
          )}
        </section>

        {/* Pagination */}
        {pageCount > 1 && (
          <section className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
            <button
              type="button"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman sebelumnya"
            >
              <FaArrowLeft size={13} />
            </button>

            <div className="text-center">
              <p className="text-xs text-slate-400">Halaman</p>

              <p className="text-sm font-bold text-slate-800">
                {currentPage}{" "}
                <span className="font-normal text-slate-400">
                  / {pageCount}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={handleNextPage}
              disabled={currentPage === pageCount}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Halaman berikutnya"
            >
              <FaArrowRight size={13} />
            </button>
          </section>
        )}
      </main>

      {/* Export Modal */}
      {modalPayment && (
        <div
          className="fixed inset-0 z-[999] flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleCancel();
            }
          }}
        >
          <div className="w-full max-w-md rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Export Riwayat
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Pilih periode data yang ingin diexport.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Tutup"
              >
                <FiX size={19} />
              </button>
            </div>

            {/* Active Type */}
            <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-400">
                Data yang akan diexport
              </p>

              <p className="mt-1 text-sm font-semibold text-slate-900">
                {activeTab === "payment"
                  ? "Riwayat Pembayaran"
                  : "Riwayat Parkir"}
              </p>
            </div>

            {/* Date */}
            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tanggal Mulai
                </label>

                <input
                  id="start-date"
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>

              <div>
                <label
                  htmlFor="end-date"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Tanggal Akhir
                </label>

                <input
                  id="end-date"
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(event) => setEndDate(event.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-800 transition outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100"
                />
              </div>
            </div>

            {/* Action */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="h-11 flex-1 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleSubmitExport}
                disabled={!startDate || !endDate || isLoading}
                className="h-11 flex-1 rounded-xl bg-yellow-400 text-sm font-semibold text-slate-900 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Memproses..." : "Export Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
