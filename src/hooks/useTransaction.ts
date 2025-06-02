import { useQuery } from "@tanstack/react-query";
import { Transaction } from "../../libs/API/Transaction";

export const useHistoryPayment = (
  isAuthenticated: boolean,
  page = 1,
  limit = 10,
  search = "",
) => {
  return useQuery({
    queryKey: ["historyPayment", isAuthenticated, page, limit, search],
    queryFn: () => Transaction.getAllTransactionByUser(page, limit, search),
    enabled: isAuthenticated, // query hanya aktif kalau sudah login
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: true,
  });
};

export const useHistoryParking = (
  isAuthenticated: boolean,
  page = 1,
  limit = 10,
  search = "",
) => {
  return useQuery({
    queryKey: ["historyParking", isAuthenticated, page, limit, search],
    queryFn: () => Transaction.getHistoryParkingById(page, limit, search),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: true,
  });
};
