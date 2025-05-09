"use client";
import React, { useEffect, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopupContext } from "@/context/TopupContext";
import { useCreateVaPurchase, useCreateVaTopup } from "@/hooks/usePayment";
import { usePaymentContext } from "@/context/PaymentContext";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseContext } from "@/context/PurchaseContext";
import HeaderPage from "@/components/header-page/page";
// import { CheckCircleIcon } from "@/icons";
import { FiAlertCircle } from "react-icons/fi";
import { Payment } from "../../../../../../libs/API/Payment";
import { toast } from "sonner";

type TopupPayload = {
  bank_id: string;
  amount: number;
};

type PurchaseType = {
  idProduct: string;
  data: {
    bank_id: string;
    plate_number: string;
  };
};

export default function PinVerify() {
  const length = 6;
  const [pin, setPin] = useState<string[]>(Array(length).fill(""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();
  const queryClient = useQueryClient();

  const { topupData } = useTopupContext();
  const {purchaseData} = usePurchaseContext();
  const { setPaymentData, setAdminFee } = usePaymentContext();
  const {mutate: createVaTopup} = useCreateVaTopup();
  const {mutate: createPurchase} = useCreateVaPurchase();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || '';

  const handleKeyPress = (key: string) => {
    // Handling backspace
    if (key === "backspace") {
      if (activeIndex === 0 && pin[0] === "") return; // Jika input pertama kosong, jangan apa-apa

      // Mengubah activeIndex ke input sebelumnya
      const newIndex = activeIndex === 0 ? 0 : activeIndex - 1;
      const newPin = [...pin];
      newPin[newIndex] = ""; // Mengosongkan nilai input yang sedang aktif
      setPin(newPin);
      setActiveIndex(newIndex);
      return;
    }

    // Handling input selain backspace
    if (activeIndex < length) {
      const newPin = [...pin];
      newPin[activeIndex] = key; // Mengupdate input yang sedang aktif
      setPin(newPin);

      // Pindah ke input berikutnya jika ada
      if (activeIndex < length - 1) {
        setActiveIndex(activeIndex + 1);
      }
    }
  };


    useEffect(() => {
      const handleVerification = async () => {
        const isComplete = pin.every((val) => val !== "");
        if (!isComplete) return;

        try {
          const result = await Payment.verifikasiPin(String(pin.join("")));

          // Jika gagal verifikasi PIN
          if (result?.status === "fail" || result?.success === false) {
            toast.error(result.message || "PIN salah");
            setPin(Array(length).fill(""));
            setActiveIndex(0);
            setTimeout(() => {
              const input = document.getElementById("pin-0");
              if (input) input.focus();
            }, 100);
            return;
          }

          if (type === "purchase") {
            const bankId = purchaseData.bank_id;
            if (!bankId) {
              console.error("Bank ID is missing");
              return;
            }

            const data: PurchaseType = {
              idProduct: String(purchaseData.idProduct),
              data: {
                bank_id: bankId,
                plate_number: purchaseData.plate_number,
              },
            };

            setIsLoading(true);
            createPurchase(data, {
              onSuccess: (response) => {
                const trx = response.data.transaction_data;
                const paymentDetails = {
                  Id: trx.Id,
                  createdAt: trx.createdAt,
                  expired_date: trx.expired_date,
                  invoice_id: trx.invoice_id,
                  periode: trx.periode,
                  price: Number(trx.price),
                  product_name: trx.product_name,
                  purchase_type: trx.purchase_type,
                  statusPayment: trx.statusPayment,
                  timestamp: trx.timestamp,
                  transactionType: trx.transactionType,
                  trxId: trx.trxId,
                  updatedAt: trx.updatedAt,
                  user_id: trx.user_id,
                  virtual_account: trx.virtual_account,
                  rfid: trx.rfid ?? undefined,
                };

                setAdminFee(response.data.admin_fee);
                setPaymentData(paymentDetails);
                queryClient.invalidateQueries({ queryKey: ["userById"] });
                router.push("/payment");
                localStorage.removeItem("purchaseData");
              },
              onError: (error) => {
                setIsModal(true);
                setMessage(error.message);
              },
              onSettled: () => {
                setIsLoading(false);
              },
            });
          } else {
            const bank_id = topupData.provider?.id;
            if (!bank_id) {
              console.error("Bank ID is missing");
              return;
            }

            const data: TopupPayload = {
              bank_id,
              amount: topupData.nominal,
            };

            setIsLoading(true);
            createVaTopup(data, {
              onSuccess: (response) => {
                const trx = response.data.transaction_data;
                const paymentDetails = {
                  Id: trx.Id,
                  createdAt: trx.createdAt,
                  expired_date: trx.expired_date,
                  invoice_id: trx.invoice_id,
                  periode: trx.periode,
                  price: Number(trx.price),
                  product_name: trx.product_name,
                  purchase_type: trx.purchase_type,
                  statusPayment: trx.statusPayment,
                  timestamp: trx.timestamp,
                  transactionType: trx.transactionType,
                  trxId: trx.trxId,
                  updatedAt: trx.updatedAt,
                  user_id: trx.user_id,
                  virtual_account: trx.virtual_account,
                  rfid: trx.rfid ?? undefined,
                };

                setAdminFee(response.data.admin_fee);
                setPaymentData(paymentDetails);
                queryClient.invalidateQueries({ queryKey: ["userById"] });
                router.push("/payment");
                localStorage.removeItem("purchaseData");
              },
              onError: (error) => {
                setIsModal(true);
                setMessage(error.message);
                setPin(Array(length).fill(""));
                setActiveIndex(0);
              },
              onSettled: () => {
                setIsLoading(false);
              },
            });
          }
        } catch (error) {
          console.error("Verifikasi PIN error:", error);
          setPin(Array(length).fill(""));
          setActiveIndex(0);
          toast.error("Terjadi kesalah mohon ulangi kembali");
        }
      };

      handleVerification();
    }, [createPurchase, createVaTopup, pin, purchaseData.bank_id, purchaseData.idProduct, purchaseData.plate_number, queryClient, router, setAdminFee, setPaymentData, topupData.nominal, topupData.provider?.id, type]);



  const keypad = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "*", "0", "backspace",
  ];

  return (
      <>
          <div className="w-full min-h-screen overflow-y-auto bg-white">
            <HeaderPage title="Verifikasi Pin"/>
            <div className="w-full flex flex-col items-center px-5 mt-10">
                <h1 className="text-xl font-semibold text-gray-700 mb-6">
                    Masukkan PIN
                </h1>

                <div className="flex space-x-3 justify-center mb-5">
                    {pin.map((val, idx) => (
                    <div
                        key={idx}
                        className={`w-10 h-10 sm:w-14 sm:h-14 border rounded-full text-center text-2xl font-bold flex items-center justify-center ${
                        idx === activeIndex ? "border-blue-500" : "border-gray-300"
                        }`}
                    >
                        {val ? "•" : ""}
                    </div>
                    ))}
                </div>

                <h1 className="text-md underline text-blue-500">Lupa pin</h1>

                <div className="grid grid-cols-3 gap-x-12 gap-y-5 mt-7 mx-auto">
                    {keypad.map((key, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleKeyPress(key)}
                        className="text-lg font-semibold border border-gray-300 rounded-full w-16 h-16 flex items-center justify-center hover:bg-gray-100 active:bg-gray-200"
                    >
                        {key === "backspace" ? "⌫" : key}
                    </button>
                    ))}
                </div>
            </div>

            {isLoading && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-blue-600 text-sm font-medium">
                    Process transaction . . . . . 
                  </p>
                </div>
              </div>
            )}
        </div>

        {isModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center justify-center space-y-3">
              <FiAlertCircle className="w-8 h-8 text-green-500" />
              <p className="text-blue-600 text-sm font-medium">
                Transaksi Gagal !
              </p>
              <h1 className="text-sm font-medium text-center">{message}</h1>
            </div>
          </div>
        )}
        </>
  );
}
