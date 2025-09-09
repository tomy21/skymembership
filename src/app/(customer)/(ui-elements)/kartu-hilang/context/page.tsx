/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAuth } from "@/context/AuthContext";
import { useCardList } from "@/hooks/useVehicle";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface RequestQris {
  member_customer_no: string;
  rfid: string;
  vehicle_type: string;
  customer_membership_detail: {
    is_active: number;
    location_id: string;
  };
}

export default function PageKartuHilang() {
  const { isAuthenticated } = useAuth();
  const {
    data: dataCard,
    isLoading: isLoadingCardData,
    refetch: refetchCard,
  } = useCardList(isAuthenticated);

  const [selectedCard, setSelectedCard] = useState<RequestQris | null>(null);
  const [newCardNumber, setNewCardNumber] = useState("");
  const [qrisImage, setQrisImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    refetchCard();
  }, [refetchCard]);

  if (!mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/generate-qris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          LocationCode: selectedCard?.customer_membership_detail.location_id, // kirim rfid lama
          customerNo: selectedCard?.member_customer_no, // kirim rfid baru
          externalStoreId: newCardNumber, // kirim rfid baru
          ProductName: newCardNumber, // kirim rfid baru
          amount: newCardNumber, // kirim rfid baru
          expiry: newCardNumber, // kirim rfid baru
        }),
      });
      const data = await res.json();
      if (data.qrisUrl) {
        setQrisImage(data.qrisUrl);
        setIsModalOpen(true); // buka popup
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  if (isLoadingCardData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <ClipLoader size={50} color="#3b82f6" />
      </div>
    );
  }

  return (
    <div className="mx-auto h-screen max-w-lg rounded bg-white p-6 shadow">
      {/* Pilih kartu lama */}
      <label className="mb-2 block text-sm font-medium">Kartu Hilang</label>
      <select
        value={selectedCard ? JSON.stringify(selectedCard) : ""}
        onChange={(e) => setSelectedCard(JSON.parse(e.target.value))}
        className="mb-4 w-full rounded border p-2"
      >
        <option value="">-- Pilih Kartu --</option>
        {dataCard?.data?.map((card: any, idx: number) => (
          <option key={idx} value={JSON.stringify(card)}>
            {card.rfid} - {card.vehicle_type} (No: {card.member_customer_no})
          </option>
        ))}
      </select>

      {/* Input kartu baru */}
      <label className="mb-2 block text-sm font-medium">Nomor Kartu Baru</label>
      <input
        type="text"
        value={newCardNumber}
        onChange={(e) => setNewCardNumber(e.target.value)}
        placeholder="Masukkan RFID kartu baru"
        className="mb-4 w-full rounded border p-2"
      />

      <button
        onClick={handleSubmit}
        className="w-full rounded bg-blue-600 p-2 text-white hover:bg-blue-700"
      >
        Submit & Generate QRIS
      </button>

      {/* Modal QRIS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-[90%] max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="mb-4 text-center text-lg font-semibold">
              QRIS Pembayaran
            </h2>
            <Image
              src={qrisImage}
              alt="QRIS"
              width={256}
              height={256}
              className="mx-auto"
            />
            <div className="mt-6 flex justify-center">
              <a
                href={qrisImage}
                download="qris.png"
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Download QRIS
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
