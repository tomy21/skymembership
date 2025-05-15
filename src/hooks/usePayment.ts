import { useMutation, useQuery } from "@tanstack/react-query";
import { Payment, Provider } from "../../libs/API/Payment";
import { AxiosError } from "axios";

type TopupPayload = {
  bank_id: string;
  amount: number;
};
type PurcasePayload = {
  bank_id: string;
  plate_number: string;
};

type CreateVaPurchaseParams = {
  idProduct: string;
  data: PurcasePayload;
};

export const useHistoryPayment = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["allProvider"],
    queryFn: () => Provider.getAll(page, limit),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useProviderByType = (type = "", locationCode = "") => {
  return useQuery({
    queryKey: ["providerByType", type, locationCode],
    queryFn: () => Provider.getAllByType(type, locationCode),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    enabled: !!type,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useCreateVaTopup = () => {
  return useMutation({
    mutationFn: (data: TopupPayload) => Payment.createVaTopup(data),
    onError: (error: AxiosError) => {
      console.error("Topup Error:", error.response?.data || error.message);
    },
  });
};

export const useCreateVaPurchase = () => {
  return useMutation({
    mutationFn: async ({ idProduct, data }: CreateVaPurchaseParams) => {
      return await Payment.createVaPuchase({ idProduct, data });
    },
    // onError: (error: AxiosError) => {
    //   return error.response?.data || error.message;
    // },
  });
};
export const useCreatePurchaseByPoint = () => {
  return useMutation({
    mutationFn: async ({ idProduct, data }: CreateVaPurchaseParams) => {
      return await Payment.createVaPuchaseByPoint({ idProduct, data });
    },
    // onError: (error: AxiosError) => {
    //   return error.response?.data || error.message;
    // },
  });
};

export const usePaymentByVA = (VA: string) => {
  return useQuery({
    queryKey: ["historyTransacton", VA],
    queryFn: () => Payment.getAllHistoryVa(VA),
    enabled: !!VA,
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useHistoryTransaction = (trxId: string) => {
  return useQuery({
    queryKey: ["historyTransactonByTrx", trxId],
    queryFn: () => Payment.getIdStatus(trxId),
    enabled: !!trxId,
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: true,
  });
};
