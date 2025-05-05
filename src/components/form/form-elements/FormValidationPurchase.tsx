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
  const [detail, setDetail] = useState({
    idProduct: '',
    lokasi: '',
    tipe: '',
    periode: '',
    produk: '',
    kendaraan: '',
    harga: '',
  });

  const { data: providerData } = useProviderByType(selectedMethod || undefined);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { setPurchaseData } = usePurchaseContext();

  const providerOptions = providerData ?? [];
  const methodOptions = [
    { value: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
  ];

  useEffect(() => {
    if (searchParams) {
      const lokasi = searchParams.get('location') || '';
      const tipe = searchParams.get('type') || '';
      const periode = searchParams.get('period') || '';
      const produk = searchParams.get('product') || '';
      const kendaraan = searchParams.get('vehicle') || '';
      const harga = searchParams.get('price') || '';
      const idProduct = searchParams.get('idProduct') || '';

      setDetail({ lokasi, tipe, periode, produk, kendaraan, harga, idProduct });

      // Simpan hasil getPeriodRange ke state
      const periodeRange = getPeriodRange(periode);
      setPeriodeTanggal(periodeRange);
    }
  }, [searchParams]);

  console.log(searchParams.get("idProduct"));

  const getPeriodRange = (period: string) => {
    if (!period) return null;

    // Ambil angka bulan dari text, misal "1 Bulan" -> 1
    const match = period.match(/^(\d+)\s*Bulan$/i);
    if (!match) return null;

    const months = parseInt(match[1]); // angka bulan

    const today = new Date();
    const nextDate = new Date(today); // clone supaya today tetap utuh
    nextDate.setMonth(today.getMonth() + months);

    const format = (date: Date) => {
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
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
    
    setPurchaseData({idProduct: parseInt(detail.idProduct), bank_id: selectedProviders[0].id, plate_number: detail.kendaraan, type: "purchase", provider: selectedProviders[0]});
    setShowModal(true);
  };

  console.log(detail.kendaraan)

  const handleConfirm = () => {
    setShowModal(false);
    if (searchParams.get('type')) {
      const query = new URLSearchParams({
        type: "purchase",
      }).toString();

      router.push(`/pin-verifikasi?${query}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-2xl space-y-6">
      <div className="rounded-xl border border-gray-200 p-5 shadow-sm bg-gray-50 space-y-3">
        <div className="flex justify-between">
          {/* <span className="text-gray-600">Lokasi</span> */}
          <span className="font-medium text-gray-900">{detail.lokasi}</span>
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
            <span className="text-sm font-medium text-gray-900">{periodeTanggal}</span>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              options={methodOptions}
              placeholder="Pilih Metode"
              onChange={setSelectedMethod}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
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
              defaultValue=""
               onChange={(selected) => {
                  setSelectedProviders((prev) => [...prev, selected]);
                }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        )}

        <Button

          onClick={handleSubmit}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 transition-all"
        >
          Bayar Sekarang
        </Button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex justify-center items-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white rounded-t-2xl w-full p-5 shadow-lg"
              initial={{ y: 500 }}
              animate={{ y: 0 }}
              exit={{ y: 500 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full flex justify-center mb-4">
                <div className="w-16 h-1 bg-gray-300 rounded-full" />
              </div>

              <h2 className="text-center text-lg font-medium text-gray-700">
                Total pembayaran
              </h2>
              <h1 className="text-center text-3xl font-bold my-2">
                IDR {(parseInt(detail.harga) + 5000).toLocaleString("id-ID")}
              </h1>

              <div className="text-sm mt-4 space-y-3">
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Metode pembayaran</span>
                  <span className="font-semibold uppercase">{selectedMethod === "VIRTUAL_ACCOUNT" ? "VA" : selectedMethod } {selectedProviders.map((provider) => provider.gateway_partner)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Biaya admin</span>
                  <span className="font-semibold">IDR 5.000</span>
                </div>
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
                <Button onClick={handleConfirm} className="w-full">Lanjutkan</Button>
                <Button onClick={() => setShowModal(false)} className="w-full bg-red-500">
                  Batal
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
