/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/useTransaction.ts
"use client";
import {
  useCreatePurchaseByPoint,
  useCreateVaExtend,
  useCreateVaPurchase,
  useExtendByPoint,
} from "@/hooks/usePayment";
import { toast } from "sonner";
import { usePaymentContext } from "@/context/PaymentContext";
import { useRouter } from "next/navigation";
import { queryClient } from "@/components/user-profile/ProfilDropdown";

interface Params {
  type: string;
  provider: string;
  bank_id: string;
  amount: number;
  code_bank: string;
  idProduct: number;
  plate_number: string;
  methode_purchase: string;
}

export function useTransaction() {
  const { mutate: createPurchase } = useCreateVaPurchase();
  const { mutate: createExtend } = useCreateVaExtend();
  const { mutate: createPurchasePoint } = useCreatePurchaseByPoint();
  const { mutate: extendProductPoint } = useExtendByPoint();
  const { setPaymentData, setAdminFee } = usePaymentContext();
  const router = useRouter();

  const transaction = (data: Params) => {
    return new Promise((resolve, reject) => {
      const submitType = data.type === "Extend" ? createExtend : createPurchase;
      const submitTypeByPoint =
        data.type === "Extend" ? extendProductPoint : createPurchasePoint;

      if (data.methode_purchase === "POINT") {
        submitTypeByPoint(
          {
            idProduct: String(data.idProduct),
            data: {
              bank_id: data.bank_id,
              plate_number: data.plate_number,
            },
          },
          {
            onSuccess: (response: any) => {
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
              sessionStorage.setItem(
                "transactionData",
                JSON.stringify(paymentDetails),
              );

              toast.success("Pembelian berhasil");
              router.push("/payment");

              resolve({ status: "success", data: paymentDetails });
            },
            onError: (error: any) => {
              toast.error(error?.message || "Transaksi gagal");
              reject(error);
            },
          },
        );
      }

      if (data.methode_purchase === "VIRTUAL_ACCOUNT") {
        submitType(
          {
            idProduct: String(data.idProduct),
            data: {
              bank_id: data.bank_id,
              plate_number: data.plate_number,
            },
          },
          {
            onSuccess: (response: any) => {
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
              sessionStorage.setItem(
                "transactionData",
                JSON.stringify(paymentDetails),
              );

              toast.success("Pembelian berhasil");
              router.push("/payment");

              resolve({ status: "success", data: paymentDetails });
            },
            onError: (error: any) => {
              toast.error(error?.message || "Transaksi gagal");
              reject(error);
            },
          },
        );
      }
    });
  };

  return { transaction };
}
