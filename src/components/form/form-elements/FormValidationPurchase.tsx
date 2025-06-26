"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// import Select from "react-select";
import CustomSelectWithImage from "../SelectWithImage";
import Button from "@/components/ui/button/Button";
import { useRouter, useSearchParams } from "next/navigation";
import Select from "@/components/form/Select";
import { useProviderByType } from "@/hooks/usePayment";
import Label from "../Label";
import { ChevronDownIcon } from "@/icons";
import { toast } from "sonner";
import { usePurchaseContext } from "@/context/PurchaseContext";
import { useDetailCustomer } from "@/hooks/useAuth";
import Checkbox from "@/components/form/input/Checkbox";
import TermsAndCondition from "@/components/accordion/Termncondition";

interface Option {
  id: string;
  code_bank: string;
  gateway_partner: string;
}

export default function ConfirmationForm() {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Option[]>([]);
  const [periodeTanggal, setPeriodeTanggal] = useState<string | null>(null);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
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

  const { data: providerData } = useProviderByType(selectedMethod || undefined);
  const { data } = useDetailCustomer();

  const searchParams = useSearchParams();
  const router = useRouter();

  const { setPurchaseData } = usePurchaseContext();

  const providerOptions = providerData ?? [];
  const methodOptions = [
    { value: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
    { value: "POINT", label: "Point" },
  ];

  useEffect(() => {
    if (searchParams) {
      const lokasi = searchParams.get("location") || "";
      const tipe = searchParams.get("type") || "";
      const periode = searchParams.get("period") || "";
      const produk = searchParams.get("product") || "";
      const kendaraan = searchParams.get("vehicle") || "";
      const harga = searchParams.get("price") || "";
      const idProduct = searchParams.get("idProduct") || "";
      const typeProduct = searchParams.get("typeProduct") || "";

      setDetail({
        lokasi,
        tipe,
        periode,
        produk,
        kendaraan,
        harga,
        idProduct,
        typeProduct,
      });

      // Simpan hasil getPeriodRange ke state
      const periodeRange = getPeriodRange(periode);
      setPeriodeTanggal(periodeRange);
    }
  }, [searchParams]);

  useEffect(() => {
    setSelectedProviders([]);
  }, [selectedMethod]);

  const getPeriodRange = (period: string) => {
    if (!period) return null;

    // Ambil angka bulan dari text, misal "1 Bulan" -> 1
    const match = period.match(/^(\d+)\s*Bulan$/i);
    if (!match) return null;

    const months = parseInt(match[1]); // angka bulan

    const today = new Date();
    const nextDate = new Date(today); // clone supaya today tetap utuh
    nextDate.setMonth(today.getMonth() + months);
    nextDate.setDate(nextDate.getDate());

    const format = (date: Date) => {
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    return `${format(today)} - ${format(nextDate)}`;
  };

  const handleSubmit = () => {
    if (!selectedMethod) {
      toast.warning("Pilih metode pembayaran");
      return;
    }
    if (!selectedProviders) {
      toast.warning("Pilih provider");
      return;
    }

    const dataPayload = {
      idProduct: parseInt(detail.idProduct),
      bank_id: selectedProviders[0].id,
      plate_number: detail.kendaraan,
      type: detail.typeProduct,
      provider: selectedProviders[0],
    };

    localStorage.setItem("purchaseData", JSON.stringify(dataPayload));

    setPurchaseData({
      idProduct: parseInt(detail.idProduct),
      bank_id: selectedProviders[0].id,
      plate_number: detail.kendaraan,
      type: detail.typeProduct,
      provider: selectedProviders[0],
    });
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (selectedMethod === "POINT") {
      if (data.data.points < parseInt(detail.harga)) {
        toast.warning("Oops...! Point tidak mencukupi");
        return;
      }
    }

    if (searchParams.get("type")) {
      const query = new URLSearchParams({
        type: selectedMethod,
      }).toString();

      router.push(`/verifikasi?${query}`);
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="mx-auto max-w-full py-6">
          <div className="flex w-full flex-col items-center justify-between space-y-3">
            <div className="w-full space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
              <div className="flex justify-between">
                {/* <span className="text-gray-600">Lokasi</span> */}
                <span className="font-medium text-gray-900">
                  {detail.lokasi}
                </span>
              </div>
              <div className="flex justify-between">
                {/* <span className="text-gray-600">Tipe</span> */}
                <span className="font-medium text-gray-900">{detail.tipe}</span>
              </div>
              <div className="flex justify-between">
                {/* <span className="text-gray-600">Total Bayar</span> */}
                <span className="font-semibold text-emerald-600">
                  {parseInt(detail.harga).toLocaleString()}
                </span>
              </div>
              {periodeTanggal && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Periode:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {periodeTanggal}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                {/* <span className="text-gray-600">Tipe</span> */}
                <span className="font-medium text-gray-900">
                  {detail.typeProduct}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="w-full">
                <Label>Metode Pembayaran</Label>
                <div className="relative">
                  <Select
                    options={methodOptions}
                    placeholder="Pilih Metode"
                    onChange={(value) => {
                      setSelectedMethod(value);
                      setSelectedProviders([]); // Reset provider saat metode berubah
                    }}
                  />
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                    <ChevronDownIcon />
                  </span>
                </div>
              </div>

              {selectedMethod && (
                <div className="w-full">
                  <Label>Provider</Label>
                  <div className="relative">
                    <CustomSelectWithImage
                      options={providerOptions}
                      defaultValue={selectedProviders[0]?.id || undefined}
                      onChange={(selected) => {
                        setSelectedProviders(() => [selected]);
                      }}
                    />
                    <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                      <ChevronDownIcon />
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-3 flex w-full items-center justify-start gap-3 px-1">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="text-start text-sm text-gray-600">
                  <button
                    type="button"
                    className="text-blue-600 underline hover:text-blue-800"
                    onClick={() => setShowTermsModal(true)}
                  >
                    <p className="text-start">
                      Saya telah membaca dan menyetujui syarat dan ketentuan
                    </p>
                  </button>
                </span>
              </div>

              <Button
                onClick={handleSubmit}
                className="mt-4 w-full bg-emerald-600 transition-all hover:bg-emerald-700 disabled:bg-emerald-300"
                disabled={!isChecked || !selectedMethod || !selectedProviders}
              >
                Bayar Sekarang
              </Button>
            </div>

            <AnimatePresence>
              {showModal && (
                <motion.div
                  className="fixed inset-0 z-50 mx-auto flex w-sm items-end justify-center bg-black/40"
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
                    <div className="mb-4 flex w-full justify-center">
                      <div className="h-1 w-16 rounded-full bg-gray-300" />
                    </div>

                    <h2 className="text-center text-lg font-medium text-gray-700">
                      Total pembayaran
                    </h2>
                    <h1 className="my-2 text-center text-3xl font-bold">
                      IDR{" "}
                      {selectedMethod === "POINT"
                        ? parseInt(detail.harga).toLocaleString("id-ID")
                        : (parseInt(detail.harga) + 5000).toLocaleString(
                            "id-ID",
                          )}
                    </h1>

                    <div className="mt-4 space-y-3 text-sm">
                      <div className="flex justify-between border-b border-slate-300 py-1">
                        <span className="text-slate-400">
                          Metode pembayaran
                        </span>
                        <span className="font-semibold uppercase">
                          {selectedMethod === "VIRTUAL_ACCOUNT"
                            ? "VA"
                            : selectedMethod}{" "}
                          {selectedProviders.map((provider) =>
                            provider.gateway_partner === "BAYARIND"
                              ? "BCA"
                              : provider.gateway_partner,
                          )}
                        </span>
                      </div>
                      {selectedMethod === "VIRTUAL_ACCOUNT" && (
                        <div className="flex justify-between border-b border-slate-300 py-1">
                          <span className="text-slate-400">Biaya admin</span>
                          <span className="font-semibold">IDR 5.000</span>
                        </div>
                      )}
                      {/* <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Total points</span>
                  <span className="font-semibold">
                    {(harga ?? 0).toLocaleString("id-ID")} Points
                  </span>
                </div> */}
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

            <TermsAndCondition
              isVisible={showTermsModal}
              onClose={() => {
                setIsChecked(true); // otomatis setuju saat klik "Setuju" di modal
                setShowTermsModal(false);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
