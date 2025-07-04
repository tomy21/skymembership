"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useCreatePurchaseByPoint,
  useCreateVaExtend,
  useCreateVaPurchase,
  useCreateVaTopup,
  useExtendByPoint,
} from "@/hooks/usePayment";
import { usePaymentContext } from "@/context/PaymentContext";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseContext } from "@/context/PurchaseContext";
// import { CheckCircleIcon } from "@/icons";
import { FiAlertCircle } from "react-icons/fi";
import { Payment } from "../../../../../../libs/API/Payment";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { useForgotPin } from "@/hooks/useAuth";
import Loading from "@/components/Loading/Loading";

type TopupPayload = {
  bank_id: string;
  amount: number;
};

type payloadLocalStorage = {
  method: string;
  nominal: number;
  type: string;
  provider: {
    id: string;
    bank_id: string;
    code_bank: string;
    gateway_partner: string;
  };
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
  const [message, setMessage] = useState("");
  const [isModalLupaPin, setIsModalLupaPin] = useState(false);
  // const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmittingReset, setIsSubmittingReset] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  // const { topupData } = useTopupContext();
  const { purchaseData } = usePurchaseContext();
  const { setPaymentData, setAdminFee } = usePaymentContext();
  const { mutate: createVaTopup } = useCreateVaTopup();
  const { mutate: createPurchase } = useCreateVaPurchase();
  const { mutate: createExtend } = useCreateVaExtend();
  const { mutate: createPurchasePoint } = useCreatePurchaseByPoint();
  const { mutate: extendProductPoint } = useExtendByPoint();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "";
  const [dataTopup, setDataTopup] = useState<payloadLocalStorage | null>(null);
  const forgotPin = useForgotPin();

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
    const stored = localStorage.getItem("topupData");
    if (stored) {
      setDataTopup(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleVerification = async () => {
      const isComplete = pin.every((val) => val !== "");
      if (!isComplete) return;

      try {
        setIsLoading(true);
        const result = await Payment.verifikasiPin(String(pin.join("")));

        if (result?.status === "fail" || result?.success === false) {
          toast.error(result.message || "PIN salah");
          setPin(Array(length).fill(""));
          setActiveIndex(0);
          setTimeout(() => {
            const input = document.getElementById("pin-0");
            if (input) input.focus();
          }, 100);
          setIsLoading(false);
          return;
        }

        if (type === "VIRTUAL_ACCOUNT") {
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

          const submitType =
            purchaseData.type === "Extend" ? createExtend : createPurchase;

          submitType(data, {
            onSuccess: (response) => {
              const trx = response.data.transaction_data ?? response.data;

              const paymentDetails = {
                Id: Number(trx.Id),
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
                admin_fee: response.data.admin_fee,
              };

              setAdminFee(response.data.admin_fee);
              setPaymentData(paymentDetails);
              queryClient.invalidateQueries({ queryKey: ["userById"] });
              router.push("/payment");
              sessionStorage.setItem(
                "transactionData",
                JSON.stringify(paymentDetails),
              );
            },

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              setIsModal(true);
              const errorMessage =
                error?.message ||
                error?.error ||
                "Terjadi kesalahan, silakan coba lagi.";
              setMessage(errorMessage);
              setPin(Array(length).fill(""));
              setActiveIndex(0);
              setTimeout(() => {
                const input = document.getElementById("pin-0");
                if (input) input.focus();
                setIsModal(false);
              }, 1000);
              setIsLoading(false);
            },
            onSettled: () => {
              setIsLoading(false);
            },
          });
        }

        if (type === "POINT") {
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

          const submitType =
            purchaseData.type === "Extend"
              ? extendProductPoint
              : createPurchasePoint;

          submitType(data, {
            onSuccess: (response) => {
              const trx = response.data.transaction_data;
              if (!trx) {
                console.error("Transaction data is undefined", response.data);
                return;
              }
              const paymentDetails = {
                Id: trx.Id ?? "-",
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
                virtual_account: trx.virtual_account ?? "-",
                rfid: trx.rfid ?? undefined,
              };

              setAdminFee(response.data.admin_fee);
              setPaymentData(paymentDetails);
              queryClient.invalidateQueries({ queryKey: ["userById"] });
              queryClient.invalidateQueries({ queryKey: ["list-card_user"] });

              router.push(`/home`);
              toast.success("Pembayaran berhasil");

              localStorage.removeItem("purchaseData");
            },
            onError: (error) => {
              setIsModal(true);
              setMessage(error.message);
              setInterval(() => {
                setIsModal(false);
              }, 1000);
              setPin(Array(length).fill(""));
              setActiveIndex(0);
            },
            onSettled: () => {
              setIsLoading(false);
            },
          });
        }

        if (type === "topup") {
          const bank_id = dataTopup?.provider?.id;
          if (!bank_id) {
            console.error("Bank ID is missing");
            return;
          }

          const data: TopupPayload = {
            bank_id,
            amount: dataTopup?.nominal,
          };

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
                admin_fee: response.data.admin_fee,
              };

              setAdminFee(response.data.admin_fee);
              setPaymentData(paymentDetails);
              queryClient.invalidateQueries({ queryKey: ["userById"] });
              router.push("/payment");
              sessionStorage.setItem(
                "transactionData",
                JSON.stringify(paymentDetails),
              );
              // localStorage.removeItem("topupData");
              setIsLoading(false);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
              setIsModal(true);

              const errorMessage =
                error?.message ||
                error?.error ||
                "Terjadi kesalahan, silakan coba lagi.";
              setMessage(errorMessage);

              setInterval(() => {
                setIsLoading(false);
                setPin(Array(length).fill(""));
                setActiveIndex(0);
                setIsModal(false);
              }, 1000);

              setActiveIndex(0);
            },
            onSettled: () => {
              setIsLoading(false);
            },
          });
        }

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Verifikasi PIN error:", error);
        setPin(Array(length).fill(""));
        setTimeout(() => {
          setIsModal(false);
          setActiveIndex(0);
          const input = document.getElementById("pin-0");
          if (input) input.focus();
        }, 100);
        setActiveIndex(0);
        toast.error("Terjadi kesalah mohon ulangi kembali");
      }
    };

    handleVerification();
  }, [
    createExtend,
    createPurchase,
    createPurchasePoint,
    createVaTopup,
    dataTopup,
    extendProductPoint,
    pin,
    purchaseData.bank_id,
    purchaseData.idProduct,
    purchaseData.plate_number,
    purchaseData.type,
    queryClient,
    router,
    setAdminFee,
    setPaymentData,
    type,
  ]);

  const keypad = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "*",
    "0",
    "backspace",
  ];

  const modalLupaPin = () => {
    setIsModalLupaPin(true);
  };

  const modalLupaPinClose = () => {
    setIsModalLupaPin(false);
    setActiveIndex(0);
    setPin(Array(length).fill(""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const referralUrl = window.location.origin;
    setIsSubmittingReset(true);

    try {
      forgotPin.mutate(
        { referralUrl },
        {
          onSuccess: () => {
            setSubmitted(true);
          },
          onError: (err) => {
            toast.error("Gagal mengirim reset PIN. Silakan coba lagi.");
            console.error("Reset PIN error", err);
          },
          onSettled: () => {
            setIsSubmittingReset(false);
          },
        },
      );
    } catch (error) {
      console.log(error);
      setIsSubmittingReset(false);
    }
  };

  return (
    <>
      <div className="min-h-screen w-full overflow-y-auto bg-white">
        <div className="mt-10 flex w-full flex-col items-center px-5">
          <h1 className="mb-6 text-xl font-semibold text-gray-700">
            Masukkan PIN
          </h1>

          <div className="mb-5 flex w-sm justify-center space-x-3">
            {pin.map((val, idx) => (
              <div
                key={idx}
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-center text-2xl font-bold sm:h-14 sm:w-14 ${
                  idx === activeIndex ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {val ? "•" : ""}
              </div>
            ))}
          </div>

          <h1
            onClick={modalLupaPin}
            className="text-md text-blue-500 underline"
          >
            Lupa pin
          </h1>

          <div className="mx-auto mt-7 grid grid-cols-3 gap-x-12 gap-y-5">
            {keypad.map((key, idx) => (
              <button
                key={idx}
                onClick={() => handleKeyPress(key)}
                className="flex h-16 w-16 items-center justify-center rounded-full border border-gray-300 text-lg font-semibold hover:bg-gray-100 active:bg-gray-200"
              >
                {key === "backspace" ? "⌫" : key}
              </button>
            ))}
          </div>
        </div>

        {isLoading && <Loading />}
      </div>

      {isModal && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/50 p-5">
          <div className="flex flex-col items-center justify-center space-y-3 rounded-xl bg-white px-6 py-4 shadow-lg">
            <FiAlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-sm font-medium text-blue-600">
              Transaksi Gagal !
            </p>
            <h1 className="text-center text-sm font-medium">{message}</h1>
          </div>
        </div>
      )}

      <AnimatePresence>
        {isModalLupaPin && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50"
              onClick={modalLupaPinClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="z-10 w-full space-y-3 rounded-2xl bg-white p-6 text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              {submitted ? (
                <div className="w-full p-5 text-center font-medium text-green-600">
                  Link reset telah dikirim ke email anda.
                </div>
              ) : (
                <>
                  <div className="w-full">
                    <h1 className="mb-7 text-xl font-medium">
                      Anda yakin untuk reset PIN ?
                    </h1>
                    <div className="flex w-full justify-center space-x-3">
                      <button
                        onClick={modalLupaPinClose}
                        className="w-1/2 rounded bg-red-500 p-3 text-sm font-medium text-white"
                      >
                        Tidak
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex w-1/2 items-center justify-center rounded bg-blue-500 p-3 text-sm font-medium text-white"
                        disabled={isSubmittingReset}
                      >
                        {isSubmittingReset ? (
                          <svg
                            className="h-4 w-4 animate-spin text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                        ) : (
                          "Ya"
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
