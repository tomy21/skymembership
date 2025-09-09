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
import TermsAndCondition from "@/components/accordion/Termncondition";

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
  const [showTermsModal, setShowTermsModal] = useState(false);

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

    const dataPayload = {
      nominal: selectedNominal,
      type: "topup",
      method: selectedMethod,
      provider: selectedProviders[0],
    };

    localStorage.setItem("topupData", JSON.stringify(dataPayload));

    setTopupData({
      nominal: selectedNominal,
      type: "topup",
      method: selectedMethod,
      provider: selectedProviders[0],
    });
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedNominal(0);
    setSelectedMethod("");
    setSelectedProviders([]);
  };

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-white">
      <HeaderPage title="Topup Point" />

      <div className="mt-5 flex w-full flex-col items-start justify-center">
        <h1 className="mx-auto text-xl text-slate-400">Nominal Top Up</h1>
        <div className="mt-3 flex flex-row items-start justify-center">
          <h1 className="text-2xl font-medium text-slate-400">Rp</h1>
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
            className="w-[60%] bg-transparent text-center text-4xl font-medium focus:outline-none"
          />
        </div>

        <div className="mx-auto mt-10 grid grid-cols-5 gap-3">
          {nominals.map((nominal) => (
            <button
              key={nominal}
              onClick={() => setSelectedNominal(nominal)}
              className={`rounded-md bg-gray-200 p-2 text-center font-semibold`}
            >
              {nominal / 1000}K
            </button>
          ))}
        </div>

        <div className="my-7 w-full border-b border-slate-300"></div>

        <div className="mb-5 w-full px-5">
          <Label>Metode Pembayaran</Label>
          <div className="relative">
            <Select
              options={methodOptions}
              placeholder="Pilih Metode"
              onChange={setSelectedMethod}
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
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
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500">
                <ChevronDownIcon />
              </span>
            </div>
          </div>
        )}

        <div className="mt-3 flex w-full items-center justify-start gap-3 px-5">
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

        <div className="mt-7 w-full space-y-2 px-5">
          <Button
            type="button"
            onClick={handleTopup}
            className="w-full"
            disabled={
              !isChecked ||
              !selectedMethod ||
              !selectedNominal ||
              !selectedProviders
            }
          >
            Topup Sekarang
          </Button>
          <Button
            onClick={handleModalClose}
            type="button"
            className="w-full bg-red-500"
          >
            Batal
          </Button>
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
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
                IDR {(selectedNominal + 5000).toLocaleString("id-ID")}
              </h1>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-300 py-1">
                  <span className="text-slate-400">Metode pembayaran</span>
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
                <Button
                  onClick={() => router.push("/verifikasi?type=topup")}
                  className="w-full"
                >
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
  );
}
