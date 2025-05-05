import { useQuery } from "@tanstack/react-query";
import { Product } from "../../libs/API/Product";


export const useTypeVehicle = (locationCode = "") => {
  return useQuery({
    queryKey: ['TypeVehicle', locationCode],
    queryFn: () => Product.getProductByLicense(locationCode),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
export const usePeriode = (locationCode = "", type = "") => {
  return useQuery({
    queryKey: ['PeriodeProduct',type, locationCode],
    queryFn: () => Product.getPeriode(type, locationCode),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
export const useProduct = (locationCode = "", type = "", period = "") => {
  return useQuery({
    queryKey: ['PeriodeProduct', locationCode,type, period],
    queryFn: () => Product.getProduct(locationCode ,type, period),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}