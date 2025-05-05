import { useQuery } from "@tanstack/react-query";
import { Location } from "../../libs/API/Location";

export const useAllLocation = (page = 1 , limit = 10, search = "") => {
  return useQuery({
    queryKey: ['AllLocation', page, limit, search],
    queryFn: () => Location.getAllLocation(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export const useLocationByCode = (idLocation: number) => {
  return useQuery({
    queryKey: ['LocationByCode',  idLocation],
    queryFn: () => Location.getLocationByCode(idLocation),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}