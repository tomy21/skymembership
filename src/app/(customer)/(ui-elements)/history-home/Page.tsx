"use client";

import { useAuth } from "@/context/AuthContext";
import { useHistoryParking, useHistoryPayment } from "@/hooks/useTransaction";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type HistoryTab = "payment" | "parking";

export default function HistoryHome() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<HistoryTab>("payment");

  const { isAuthenticated, isLoadingAuth } = useAuth();

  const { data, refetch: refetchPayment } = useHistoryPayment(isAuthenticated);

  const { data: parkingHistory, refetch: refetchHistory } =
    useHistoryParking(isAuthenticated);

  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    refetchPayment();
    refetchHistory();
  }, [isAuthenticated, isLoadingAuth, router, refetchPayment, refetchHistory]);

  const paymentCount = data?.data?.length ?? 0;
  const parkingCount = parkingHistory?.data?.length ?? 0;

  const handlePaymentDetail = (id: string) => {
    router.push(`/payment?idTransaction=${id}`);
  };

  return (
    <section className="px-5 pt-8 pb-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">
              Activity
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Riwayat Transaksi
            </h2>
          </div>

          <Link
            href="/view-all"
            className="text-xs font-semibold text-yellow-600 transition hover:text-yellow-700"
          >
            Lihat semua
          </Link>
        </div>

        {/* History container */}
        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1">
            <HistoryTabButton
              active={activeTab === "payment"}
              label="Payment"
              count={paymentCount}
              onClick={() => setActiveTab("payment")}
            />

            <HistoryTabButton
              active={activeTab === "parking"}
              label="Parking"
              count={parkingCount}
              onClick={() => setActiveTab("parking")}
            />
          </div>

          {/* Content */}
          <div className="mt-3 max-h-[420px] overflow-y-auto overscroll-contain pr-1">
            {activeTab === "payment" && (
              <>
                {paymentCount === 0 ? (
                  <EmptyHistory message="Kamu belum ada riwayat pembayaran" />
                ) : (
                  <div className="space-y-2">
                    {data?.data?.map(
                      (item: ResponseHistoryPayment, index: number) => (
                        <CardHistory
                          key={`${item.trxId}-${index}`}
                          onClick={() =>
                            handlePaymentDetail(item.trxId.toString())
                          }
                          type="payment"
                          date={item.createdAt}
                          product={item.purchase_type}
                          location={item.location_name ?? item.invoice_id}
                          productName={
                            item.purchase_type === "TOPUP"
                              ? `${item.product_name} Points`
                              : item.product_name
                          }
                          amount={Number(item.price)}
                          status={
                            item.statusPayment === "PAID"
                              ? "paid"
                              : item.statusPayment === "PENDING"
                                ? "pending"
                                : "failed"
                          }
                        />
                      ),
                    )}
                  </div>
                )}
              </>
            )}

            {activeTab === "parking" && (
              <>
                {parkingCount === 0 ? (
                  <EmptyHistory message="Kamu belum ada riwayat parking" />
                ) : (
                  <div className="space-y-2">
                    {parkingHistory?.data?.map(
                      (item: ResponseHistoryParking, index: number) => (
                        <CardHistory
                          key={`${item.time}-${index}`}
                          type="parking"
                          date={item.time}
                          product={item.plate_number}
                          location={item.location_name}
                          productName={item.status_member}
                          amount={item.tariff ?? 0}
                          status={
                            item.type === "Masuk Area Parkir"
                              ? "masuk"
                              : "keluar"
                          }
                          isMember={item.status_member !== "NON-MEMBER"}
                        />
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface HistoryTabButtonProps {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}

function HistoryTabButton({
  active,
  label,
  count,
  onClick,
}: HistoryTabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
        active
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {label}

      {count > 0 && (
        <span
          className={`ml-2 rounded-full px-1.5 py-0.5 text-[9px] ${
            active
              ? "bg-yellow-100 text-yellow-700"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyHistory({ message }: { message: string }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center px-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50">
        <Image
          src="/images/company/empty-box.png"
          alt="Empty"
          width={100}
          height={100}
          className="opacity-30"
        />
      </div>

      <p className="mt-4 text-center text-xs font-medium text-slate-400">
        {message}
      </p>
    </div>
  );
}
