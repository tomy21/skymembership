"use client";

import React, { useState } from "react";
import Label from "@/components/form/Label";
import { ChevronDownIcon } from "@/icons";
import CustomSelectWithImage from "@/components/form/SelectWithImage";
import Select from "@/components/form/Select";
import Button from "@/components/ui/button/Button";
import Checkbox from "@/components/form/input/Checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useProviderByType } from "@/hooks/usePayment";
import { useTopupContext } from "@/context/TopupContext";
import HeaderPage from "@/components/header-page/page";

interface Option {
  id: string;
  code_bank: string;
  gateway_partner: string;
}

export default function TopupPage() {
  const [isChecked, setIsChecked] = useState(false);
  const [selectedNominal, setSelectedNominal] = useState<number | 0>(0);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedProviders, setSelectedProviders] = useState<Option[]>([]);
  const [showModal, setShowModal] = useState(false);
  const { data: providerData } = useProviderByType(selectedMethod || undefined);
  
  const router = useRouter();
  const { setTopupData } = useTopupContext();
  
  const providerOptions = providerData ?? [];
  const methodOptions = [
    { value: "VIRTUAL_ACCOUNT", label: "Virtual Account" },
  ];

  const nominals = [300000, 100000, 70000, 50000, 10000];
  
  const handleTopup = () => {
    if (!selectedNominal || selectedNominal < 10000) {
      toast.error("Nominal minimal 10.000");
      return;
    }

    if (!selectedMethod) {
      toast.warning("Pilih metode pembayaran");
      return;
    }
    if (!selectedProviders) {
      toast.warning("Pilih provider");
      return;
    }

    setTopupData({ nominal: selectedNominal, type: "topup", method: selectedMethod, provider: selectedProviders[0] });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedNominal(0);
    setSelectedMethod("");
    setSelectedProviders([]);
  };

  return (
    <div className="w-full min-h-screen overflow-y-auto bg-white">
      <HeaderPage title="Topup Point" />

      <div className="flex flex-col justify-center items-start w-full mt-5">
        <h1 className="text-xl text-slate-400 mx-auto">Nominal Top Up</h1>
        <div className="flex flex-row justify-center items-start mt-3">
          <h1 className="text-2xl text-slate-400 font-medium">Rp</h1>
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            value={selectedNominal?.toLocaleString("id-ID") || ""}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // ambil angka aja
              const numericValue = parseInt(rawValue);
              if (!isNaN(numericValue) && numericValue <= 999999999) {
                setSelectedNominal(numericValue);
              } else if (rawValue === "") {
                setSelectedNominal(0);
              }
            }}
            className="text-4xl font-medium bg-transparent focus:outline-none text-center w-[60%]"
          />
        </div>

        <div className="grid grid-cols-5 gap-3 mt-10 mx-auto">
          {nominals.map((nominal) => (
            <button
              key={nominal}
              onClick={() => setSelectedNominal(nominal)}
              className={`p-2 rounded-md text-center font-semibold bg-gray-200`}
            >
              {nominal / 1000}K
            </button>
          ))}
        </div>

        <div className="border-b border-slate-300 my-7 w-full"></div>

        <div className="w-full px-5 mb-5">
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
          <div className="w-full px-5">
          <Label>Provider</Label>
          <div className="relative">
            <CustomSelectWithImage
              options={providerOptions}
              defaultValue=""
               onChange={(selected) => {
                  setSelectedProviders(() => [selected]);
                }}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <ChevronDownIcon />
            </span>
          </div>
        </div>
        )}

        <div className="flex justify-start items-center gap-3 mt-3 w-full px-5">
          <Checkbox checked={isChecked} onChange={setIsChecked} />
          <span className="block text-sm font-medium text-gray-700 dark:text-gray-400">
            Saya menyetujui syarat dan ketentuan
          </span>
        </div>

        <div className="w-full px-5 space-y-2 mt-7">
          <Button type="button" onClick={handleTopup} className="w-full" disabled={!isChecked || !selectedMethod || !selectedNominal || !selectedProviders}>
            Topup Sekarang
          </Button>
          <Button onClick={handleModalClose} type="button" className="w-full bg-red-500">
            Batal
          </Button>
        </div>
      </div>

      {/* MODAL */}
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
                IDR {(selectedNominal + 5000).toLocaleString("id-ID")}
              </h1>

              <div className="text-sm mt-4 space-y-3">
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Metode pembayaran</span>
                  <span className="font-semibold uppercase">{selectedMethod === "VIRTUAL_ACCOUNT" ? "VA" : selectedMethod } {selectedProviders.map((provider) => provider.gateway_partner === "BAYARIND" ? "BCA" : provider.gateway_partner)}</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Biaya admin</span>
                  <span className="font-semibold">IDR 5.000</span>
                </div>
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Total points</span>
                  <span className="font-semibold">
                    {(selectedNominal ?? 0).toLocaleString("id-ID")} Points
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
              </div>

              <div className="mt-5 space-y-2">
                <Button onClick={() => router.push("/verifikasi")} className="w-full">Lanjutkan</Button>
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
