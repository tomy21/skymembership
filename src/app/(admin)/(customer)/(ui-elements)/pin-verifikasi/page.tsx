"use client";
import React, { useEffect, useState} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTopupContext } from "@/context/TopupContext";
import { useCreateVaPurchase, useCreateVaTopup } from "@/hooks/usePayment";
import { usePaymentContext } from "@/context/PaymentContext";
import { useQueryClient } from "@tanstack/react-query";
import { usePurchaseContext } from "@/context/PurchaseContext";
import HeaderPage from "@/components/header-page/page";

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
    if (key === "backspace") {
      if (activeIndex === 0 && pin[0] === "") return;
      const newIndex = activeIndex === 0 ? 0 : activeIndex - 1;
      const newPin = [...pin];
      newPin[newIndex] = "";
      setPin(newPin);
      setActiveIndex(newIndex);
      return;
    }

    if (activeIndex < length) {
      const newPin = [...pin];
      newPin[activeIndex] = key;
      setPin(newPin);
      setActiveIndex(activeIndex + 1);
    }
  };

    useEffect(() => {
      const isComplete = pin.every((val) => val !== "");

      if(type === "purchase"){
        if(isComplete){
          const bankId = purchaseData.bank_id;

          if(!bankId){
            console.error("Bank ID is missing");
          }

          const data : PurchaseType = {
            idProduct: String(purchaseData.idProduct),
            data: {
              bank_id: bankId,
              plate_number: purchaseData.plate_number
            }
          }

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
            },
            onError: (error) => {
              console.error("Topup error:", error);
            },
            onSettled: () => {
              setIsLoading(false);
            },
          });
        }
      }else{
        if (isComplete) {
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
            const paymentDetails = {
              Id: response.data.transaction_data.Id,
              createdAt: response.data.transaction_data.createdAt,
              expired_date: response.data.transaction_data.expired_date,
              invoice_id: response.data.transaction_data.invoice_id,
              periode: response.data.transaction_data.periode,
              price: Number(response.data.transaction_data.price),
              product_name: response.data.transaction_data.product_name,
              purchase_type: response.data.transaction_data.purchase_type,
              statusPayment: response.data.transaction_data.statusPayment,
              timestamp: response.data.transaction_data.timestamp,
              transactionType: response.data.transaction_data.transactionType,
              trxId: response.data.transaction_data.trxId,
              updatedAt: response.data.transaction_data.updatedAt,
              user_id: response.data.transaction_data.user_id,
              virtual_account: response.data.transaction_data.virtual_account,
              rfid: response.data.transaction_data.rfid ?? undefined,
            };
            setAdminFee(response.data.admin_fee);
            setPaymentData(paymentDetails); 
            queryClient.invalidateQueries({ queryKey: ["userById"] });
            router.push("/payment");

          },
          onError: (error) => {
            console.error("Topup error:", error);
          },
          onSettled: () => {
            setIsLoading(false);
          },
        });
      }
      }
    }, [pin, router, createVaTopup, topupData.provider, topupData.nominal, setPaymentData, setAdminFee, queryClient, createPurchase, type, purchaseData.bank_id, purchaseData.idProduct, purchaseData.plate_number]);


  const keypad = [
    "1", "2", "3",
    "4", "5", "6",
    "7", "8", "9",
    "*", "0", "backspace",
  ];

  return (
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
  );
}
