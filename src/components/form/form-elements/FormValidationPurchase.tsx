/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/button/Button";
import { useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@/icons";
import { toast } from "sonner";
import { usePurchaseContext } from "@/context/PurchaseContext";
import { useDetailCustomer } from "@/hooks/useAuth";
import Checkbox from "@/components/form/input/Checkbox";
import TermsAndCondition from "@/components/accordion/Termncondition";
import Image from "next/image";
import PaymentCard from "@/components/Card-payment/CardPayment";
import { useProviderByType } from "@/hooks/usePayment";
import { useTransaction } from "../../../../services/transaction";

interface Provider {
  id: string;
  bank_id: string;
  code_bank: string;
  type_payment: string;
  gateway_partner: string;
}

export default function ConfirmationForm() {
  const [showModal, setShowModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  const [mounted, setMounted] = useState(false);
  const [isPoint, setIsPoint] = useState(false);
  const [method, setMethod] = useState<"POINT" | "VIRTUAL_ACCOUNT" | "">("");
  const { data: pointProvider = [] } = useProviderByType("POINT");

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

  const { data, isLoading } = useDetailCustomer();
  const searchParams = useSearchParams();
  // const router = useRouter();
  const { setPurchaseData } = usePurchaseContext();
  const { transaction } = useTransaction();

  // onChange untuk checkbox Point
  const handlePointChange = () => {
    const newState = !isPoint;
    setIsPoint(newState);

    if (newState) {
      setMethod("POINT");
      if (pointProvider.length > 0) {
        setSelectedProvider(pointProvider[0]);
      }
    } else {
      setMethod("");
      setSelectedProvider(null);
    }
  };

  console.log("selectedProvider", selectedProvider);
  // onSelect dari PaymentCard
  const handleSelectProvider = (provider?: Provider | null) => {
    if (!provider) {
      // kalau kosong → reset semua
      setSelectedProvider(null);
      setMethod("");
      setIsPoint(false);
      return;
    }

    if (provider.type_payment === "VIRTUAL_ACCOUNT") {
      setSelectedProvider(provider);
      setMethod("VIRTUAL_ACCOUNT");
      setIsPoint(false); // otomatis matikan Point
    }
  };

  // ✅ ambil detail dari query sekali aja
  useEffect(() => {
    if (searchParams) {
      setDetail({
        lokasi: searchParams.get("location") || "",
        tipe: searchParams.get("type") || "",
        periode: searchParams.get("period") || "",
        produk: searchParams.get("product") || "",
        kendaraan: searchParams.get("vehicle") || "",
        harga: searchParams.get("price") || "",
        idProduct: searchParams.get("idProduct") || "",
        typeProduct: searchParams.get("typeProduct") || "",
      });
    }
    setMounted(true);
  }, [searchParams]);

  const handleSubmit = () => {
    if (!selectedProvider) {
      toast.warning("Pilih provider");
      return;
    }

    const dataPayload = {
      idProduct: Number(detail.idProduct),
      bank_id: selectedProvider?.bank_id || "",
      plate_number: detail.kendaraan,
      type: detail.typeProduct,
      method, // POINT / VIRTUAL_ACCOUNT
      code_bank: selectedProvider?.code_bank || "",
    };

    localStorage.setItem("purchaseData", JSON.stringify(dataPayload));
    setPurchaseData(dataPayload);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);

    if (method === "POINT") {
      if (data?.data?.points < parseInt(detail.harga)) {
        toast.warning("Oops...! Point tidak mencukupi");
        return;
      }
    }

    try {
      const res: any = await transaction({
        type: detail.typeProduct,
        provider: selectedProvider?.code_bank || "",
        bank_id: selectedProvider?.id || "",
        amount: parseInt(detail.harga),
        code_bank: selectedProvider?.code_bank || "",
        idProduct: Number(detail.idProduct),
        plate_number: detail.kendaraan,
        methode_purchase: method,
      });

      if (res.status === "success") {
        console.log("✅ transaksi berhasil:", res.data);
        toast.success("Transaksi berhasil!");
      }
    } catch (err) {
      console.error("❌ transaksi gagal:", err);
      toast.error("Transaksi gagal!");
    }
  };

  if (!mounted) return null;

  if (isLoading && !data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-h-screen p-5">
      <div className="mx-auto max-w-full">
        <div className="mb-4 flex w-full flex-col items-start justify-start">
          <h2 className="text-md font-semibold text-gray-800 dark:text-white/90">
            Pilih Cara Bayar Membership
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Pilih cara bayar yang kamu inginkan!
          </p>
        </div>

        {/* --- Pilih Point --- */}

        <label className="relative mb-4 flex w-full cursor-pointer items-center justify-between rounded-lg border p-3 shadow dark:bg-gray-800">
          <input
            type="checkbox"
            name="paymentOption"
            value="point"
            className="peer absolute opacity-0"
            checked={isPoint}
            onChange={handlePointChange}
            disabled={method === "VIRTUAL_ACCOUNT"}
          />
          <div className="flex flex-row items-center space-x-4">
            <Image
              src={`/images/company/logo.png`}
              alt="produk"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-gray-800 dark:text-white">
                Point
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Number(data?.data?.points).toLocaleString("id-ID")}
              </p>
            </div>
          </div>
          <CheckCircleIcon
            className={`h-6 w-6 ${
              isPoint ? "text-yellow-400" : "text-gray-300"
            }`}
            strokeWidth={2.5}
          />
        </label>

        {/* --- Pilih Provider --- */}
        <PaymentCard
          onSelect={handleSelectProvider}
          disabled={isPoint}
          isVA={false}
        />

        {/* Tombol Bayar */}
        <div className="fixed right-2 bottom-10 left-2 z-50 rounded-2xl border bg-white shadow-lg">
          <div className="flex w-full items-center justify-between border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col items-start justify-start px-3">
              <h1 className="text-title-xs font-semibold text-gray-800 dark:text-white">
                Total Pembayaran
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Number(detail.harga).toLocaleString("id-ID")}
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="h-full w-1/3 rounded-tr-2xl rounded-bl-2xl bg-yellow-400 py-3 text-white transition-all hover:bg-yellow-700 disabled:bg-gray-300"
              disabled={!isChecked || !selectedProvider}
            >
              Bayar Sekarang
            </button>
          </div>
          <div className="mt-3 flex w-full items-center justify-start gap-3 px-2 py-3">
            <Checkbox checked={isChecked} onChange={setIsChecked} />
            <span className="text-start text-xs text-gray-600">
              <button
                type="button"
                className="text-start text-blue-600 hover:text-blue-800"
                onClick={() => setShowTermsModal(true)}
              >
                Saya telah membaca dan menyetujui syarat dan ketentuan
              </button>
            </span>
          </div>
        </div>

        {/* --- Modal Konfirmasi --- */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 mx-auto flex w-full items-end justify-center bg-black/40 sm:w-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
            >
              <motion.div
                className="w-full rounded-t-2xl bg-white p-5 shadow-lg"
                initial={{ y: 500 }}
                animate={{ y: 0 }}
                exit={{ y: 500 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-center text-lg font-medium text-gray-700">
                  Total pembayaran
                </h2>
                {method === "POINT" ? (
                  <h1 className="my-2 text-center text-3xl font-bold">
                    IDR {Number(detail.harga).toLocaleString("id-ID")}
                  </h1>
                ) : (
                  <h1 className="my-2 text-center text-3xl font-bold">
                    IDR {(Number(detail.harga) + 5000).toLocaleString("id-ID")}
                  </h1>
                )}
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-300 py-1">
                    <span className="text-slate-400">Metode pembayaran</span>
                    <span className="font-semibold uppercase">
                      {method === "POINT"
                        ? "POINT"
                        : `VA ${selectedProvider?.code_bank}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-300 py-1">
                    <span className="text-slate-400">Tanggal</span>
                    <span className="font-semibold">
                      {new Date().toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  {method === "VIRTUAL_ACCOUNT" && (
                    <div className="flex justify-between border-b border-slate-300 py-1">
                      <span className="text-slate-400">Biaya Admin</span>
                      <span className="font-semibold uppercase">
                        {Number(5000).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-5 space-y-2">
                  <Button onClick={handleConfirm} className="w-full">
                    Lanjutkan
                  </Button>
                  <Button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-red-500"
                  >
                    Batal
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- Terms Modal --- */}
        <TermsAndCondition
          isVisible={showTermsModal}
          onClose={() => {
            setIsChecked(true);
            setShowTermsModal(false);
          }}
        />
      </div>
    </div>
  );
}
