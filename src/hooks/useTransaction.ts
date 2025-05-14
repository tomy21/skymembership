import { useQuery } from "@tanstack/react-query";
import { Transaction } from "../../libs/API/Transaction";

export const useHistoryPayment = (page = 1 , limit = 10, search = "") => {
  return useQuery({
    queryKey: ['historyPayment',page,limit,search],
    queryFn: () => Transaction.getAllTransactionByUser(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export const useHistoryParking = (page = 1 , limit = 10, search = "") => {
  return useQuery({
    queryKey: ['historyParking'],
    queryFn: () => Transaction.getHistoryParkingById(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}