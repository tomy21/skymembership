/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  FiArrowRight,
  FiCheck,
  FiChevronRight,
  FiCreditCard,
  FiShield,
  FiX,
} from "react-icons/fi";
import { toast } from "sonner";

import TermsAndCondition from "@/components/accordion/Termncondition";
import PaymentCard from "@/components/Card-payment/CardPayment";
import Checkbox from "@/components/form/input/Checkbox";
import Loading from "@/components/Loading/Loading";
import Button from "@/components/ui/button/Button";
import { usePurchaseContext } from "@/context/PurchaseContext";
import { useDetailCustomer } from "@/hooks/useAuth";
import { useProviderByType } from "@/hooks/usePayment";
import { FaWallet } from "react-icons/fa";
import { useTransaction } from "../../../../services/transaction";

interface Provider {
  id: string;
  bank_id: string;
  code_bank: string;
  type_payment: string;
  gateway_partner: string;
}

interface MembershipProduct {
  Create_by: string;
  Fee: number;
  KID: string;
  Update_by: string;
  card_activation_fee: number;
  created_at: string;
  end_date: string;
  id: number;
  location_code: string;
  periode: string;
  price: number;
  product_code: string;
  product_name: string;
  start_date: string;
  updated_at: string;
  vehicle_type: string;
}

type PaymentMethod = "POINT" | "VIRTUAL_ACCOUNT" | "";

export default function ConfirmationForm() {
  const searchParams = useSearchParams();
  const { data, isLoading } = useDetailCustomer();
  const { setPurchaseData } = usePurchaseContext();
  const { transaction } = useTransaction();

  const { data: pointProvider = [] } = useProviderByType("POINT");

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  const [product, setProduct] = useState<MembershipProduct | null>(null);

  const [mounted, setMounted] = useState(false);
  const [isPoint, setIsPoint] = useState(false);

  const [method, setMethod] = useState<PaymentMethod>("");

  const [detail, setDetail] = useState({
    idProduct: "",
    lokasi: "",
    tipe: "",
    periode: "",
    produk: "",
    kendaraan: "",
    harga: "",
    typeProduct: "",
  });

  const harga = Number(detail.harga) || 0;

  const biayaAdmin = method === "VIRTUAL_ACCOUNT" ? 5000 : 0;

  const biayaAktivasi =
    detail.typeProduct !== "Extend"
      ? Number(product?.card_activation_fee ?? 0)
      : 0;

  const total = harga + biayaAdmin + biayaAktivasi;

  const isPointEnough = Number(data?.data?.points ?? 0) >= harga;

  const paymentLabel = useMemo(() => {
    if (method === "POINT") {
      return "Points";
    }

    if (method === "VIRTUAL_ACCOUNT") {
      return selectedProvider?.code_bank
        ? `Virtual Account ${selectedProvider.code_bank}`
        : "Virtual Account";
    }

    return "Belum dipilih";
  }, [method, selectedProvider]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const idProduct = searchParams.get("idProduct");

    if (!idProduct) {
      return;
    }

    setDetail({
      lokasi: searchParams.get("location") || "",
      tipe: searchParams.get("type") || "",
      periode: searchParams.get("period") || "",
      produk: searchParams.get("product") || "",
      kendaraan: searchParams.get("vehicle") || "",
      harga: searchParams.get("price") || "",
      idProduct,
      typeProduct: searchParams.get("typeProduct") || "",
    });
  }, [searchParams]);

  useEffect(() => {
    if (!detail.idProduct) {
      return;
    }

    fetch(
      `https://apimembership.skyparking.online/v1/product/membership-product/${detail.idProduct}`,
    )
      .then((res) => res.json())
      .then((response) => {
        setProduct(response);
      })
      .catch((error) => {
        console.error("Failed to fetch membership product:", error);
      });
  }, [detail.idProduct]);

  useEffect(() => {
    if (data) {
      localStorage.setItem("userData", JSON.stringify(data));
    }
  }, [data]);

  const handlePointChange = () => {
    const nextState = !isPoint;

    if (nextState && !isPointEnough) {
      toast.warning("Point tidak mencukupi");
      return;
    }

    setIsPoint(nextState);

    if (nextState) {
      setMethod("POINT");

      if (pointProvider.length > 0) {
        setSelectedProvider(pointProvider[0]);
      }

      return;
    }

    setMethod("");
    setSelectedProvider(null);
  };

  const handleSelectProvider = (provider?: Provider | null) => {
    if (!provider) {
      setSelectedProvider(null);
      setMethod("");
      setIsPoint(false);
      return;
    }

    if (provider.type_payment === "VIRTUAL_ACCOUNT") {
      setSelectedProvider(provider);
      setMethod("VIRTUAL_ACCOUNT");
      setIsPoint(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedProvider) {
      toast.warning("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    if (!isChecked) {
      toast.warning("Silakan setujui syarat dan ketentuan");
      return;
    }

    if (method === "POINT" && !isPointEnough) {
      toast.warning("Point tidak mencukupi");
      return;
    }

    const payload = {
      idProduct: Number(detail.idProduct),
      bank_id: selectedProvider.bank_id || "",
      plate_number: detail.kendaraan,
      type: detail.typeProduct,
      methode_purchase: method,
      code_bank: selectedProvider.code_bank || "",
    };

    localStorage.setItem("purchaseData", JSON.stringify(payload));

    setPurchaseData(payload);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!selectedProvider) {
      return;
    }

    if (method === "POINT" && !isPointEnough) {
      toast.warning("Point tidak mencukupi");
      return;
    }

    setShowModal(false);
    setLoading(true);

    try {
      const response: any = await transaction({
        type: detail.typeProduct,
        provider: selectedProvider.code_bank || "",
        bank_id: selectedProvider.id || "",
        amount: harga,
        code_bank: selectedProvider.code_bank || "",
        idProduct: Number(detail.idProduct),
        plate_number: detail.kendaraan,
        methode_purchase: method,
      });

      if (response.status === "success") {
        toast.success("Transaksi berhasil!");
      } else {
        toast.error(response.message || "Transaksi gagal!");
      }
    } catch (error) {
      console.error("Transaction failed:", error);

      toast.error("Transaksi gagal!");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isLoading && !data) {
    return <Loading />;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="min-h-screen overflow-x-clip bg-[#f7f8fa] pb-32">
      {/* Content */}
      <div className="mx-auto w-full max-w-xl px-4 pt-5 pb-8">
        {/* Summary */}
        <section>
          <div className="mb-3">
            <h1 className="text-lg font-semibold text-slate-900">
              Detail Pembayaran
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Pastikan detail membership sudah sesuai.
            </p>
          </div>

          <div className="overflow-hidden rounded-[20px] border border-slate-200 bg-white">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100">
                  <FiCreditCard className="text-lg text-yellow-700" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-slate-400">Membership</p>

                  <h2 className="mt-0.5 truncate text-base font-semibold text-slate-900">
                    {detail.produk || product?.product_name || "Membership"}
                  </h2>
                </div>
              </div>

              <div className="mt-4 divide-y divide-slate-100 border-t border-slate-100">
                <SummaryRow label="Kendaraan" value={detail.kendaraan || "-"} />

                <SummaryRow label="Tipe kendaraan" value={detail.tipe || "-"} />

                <SummaryRow label="Periode" value={detail.periode || "-"} />

                <SummaryRow label="Lokasi" value={detail.lokasi || "-"} />
              </div>
            </div>
          </div>
        </section>

        {/* Payment methods */}
        <section className="mt-7">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Metode Pembayaran
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Pilih metode pembayaran yang tersedia.
            </p>
          </div>

          {/* Points */}
          <button
            type="button"
            onClick={handlePointChange}
            disabled={method === "VIRTUAL_ACCOUNT"}
            className={`w-full rounded-[18px] border bg-white p-4 text-left transition ${
              isPoint
                ? "border-yellow-400 ring-2 ring-yellow-100"
                : "border-slate-200 hover:border-slate-300"
            } ${
              method === "VIRTUAL_ACCOUNT"
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-50">
                <FaWallet className="text-lg text-yellow-600" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-slate-900">Points</p>

                  <span className="text-sm font-semibold text-slate-900">
                    {Number(data?.data?.points ?? 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="mt-1 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isPointEnough ? "bg-emerald-500" : "bg-red-500"
                    }`}
                  />

                  <p
                    className={`text-xs ${
                      isPointEnough ? "text-slate-400" : "text-red-500"
                    }`}
                  >
                    {isPointEnough
                      ? "Saldo cukup untuk pembayaran"
                      : "Saldo tidak mencukupi"}
                  </p>
                </div>
              </div>

              <div
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  isPoint
                    ? "border-yellow-500 bg-yellow-400"
                    : "border-slate-300"
                }`}
              >
                {isPoint && <FiCheck className="text-xs text-slate-900" />}
              </div>
            </div>
          </button>

          {/* VA */}
          <div className="mt-3">
            <PaymentCard
              onSelect={handleSelectProvider}
              disabled={isPoint}
              isVA={false}
            />
          </div>

          {/* Selected method */}
          {selectedProvider && (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2.5">
              <FiShield className="shrink-0 text-emerald-500" />

              <p className="text-xs text-slate-500">
                Metode pembayaran:
                <span className="ml-1 font-semibold text-slate-800">
                  {paymentLabel}
                </span>
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Bottom payment bar */}
      <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur">
        <div className="mx-auto max-w-xl">
          <div className="mb-3 flex items-center gap-2">
            <Checkbox checked={isChecked} onChange={setIsChecked} />

            <p className="text-[11px] leading-4 text-slate-500">
              Saya menyetujui{" "}
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="font-medium text-slate-800 underline underline-offset-2"
              >
                syarat dan ketentuan
              </button>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-400">Total pembayaran</p>

              <p className="truncate text-lg font-bold text-slate-900">
                Rp {total.toLocaleString("id-ID")}
              </p>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isChecked || !selectedProvider}
              className="flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              Bayar
              <FiArrowRight />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.button
              type="button"
              aria-label="Close"
              className="absolute inset-0 bg-slate-950/40"
              onClick={() => setShowModal(false)}
            />

            <motion.div
              className="relative w-full max-w-xl rounded-t-[24px] bg-white px-5 pt-5 pb-6 shadow-2xl"
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 32,
              }}
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-slate-200" />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400">Konfirmasi</p>

                  <h2 className="mt-1 text-lg font-semibold text-slate-900">
                    Periksa Pembayaran
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                >
                  <FiX />
                </button>
              </div>

              <div className="mt-5 rounded-[18px] bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Membership</span>

                  <span className="max-w-[55%] truncate text-sm font-semibold text-slate-900">
                    {detail.produk || product?.product_name || "-"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Kendaraan</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {detail.kendaraan || "-"}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-slate-500">Pembayaran</span>

                  <span className="text-sm font-semibold text-slate-900">
                    {paymentLabel}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <PriceRow label="Harga membership" value={harga} />

                {method === "VIRTUAL_ACCOUNT" && (
                  <PriceRow label="Biaya admin" value={biayaAdmin} />
                )}

                {biayaAktivasi > 0 && (
                  <PriceRow label="Aktivasi kartu" value={biayaAktivasi} />
                )}

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-medium text-slate-500">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-slate-900">
                      Rp {total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleConfirm}
                className="mt-5 h-12 w-full rounded-xl bg-yellow-400 font-semibold text-slate-900 hover:bg-yellow-300"
              >
                Konfirmasi Pembayaran
                <FiChevronRight className="ml-2" />
              </Button>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="mt-2 h-11 w-full rounded-xl text-sm font-medium text-slate-500 transition hover:bg-slate-50"
              >
                Kembali
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <TermsAndCondition
        isVisible={showTermsModal}
        onClose={() => {
          setIsChecked(true);
          setShowTermsModal(false);
        }}
      />
    </main>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-xs text-slate-400">{label}</span>

      <span className="max-w-[60%] truncate text-right text-xs font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>

      <span className="text-sm font-medium text-slate-800">
        Rp {value.toLocaleString("id-ID")}
      </span>
    </div>
  );
}
