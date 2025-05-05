import { useMutation, useQuery } from "@tanstack/react-query";
import { vehicleAdd, VehicleListUser } from "../../libs/API/VehicleListUser";
import { AxiosError } from "axios";

export type CardHistoryProps = {
  member_customer_no: string;
  vehicle_type: "MOBIL" | "MOTOR";
  createdAt: string;
  plate_number: string;
  rfid: string;
};

interface VehicleAddPayload {
  vehicle_type: string;
  plate_number: string;
  plate_number_image: File | null;
  stnk_image: File | null;
}

export const useVehicle = (page = 1 , limit = 10, search = "") => {
  return useQuery({
    queryKey: ['vehicleData'],
    queryFn: () => VehicleListUser.getVehicle(page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export const useVehicleActive = (
        type = "",
        locationCode = "",
        page = 1,
        limit = 10,
        search = "") => {
  return useQuery({
    queryKey: ['vehicleDataActive',type, location],
    queryFn: () => VehicleListUser.getVehicleUnActiveLocation(type, locationCode, page, limit, search),
    staleTime: 1000 * 60 * 5, // 5 menit, biar gak fetch terus
    retry: 1,
    refetchOnWindowFocus: false,
  });
}

export const useAddVehicle = () => {
  return useMutation({
    mutationFn: async (data: VehicleAddPayload) => {
      const formData = new FormData();
      formData.append("vehicle_type", data.vehicle_type);
      formData.append("plate_number", data.plate_number.toUpperCase());

      if (data.plate_number_image) {
        formData.append("plate_number_image", data.plate_number_image);
      }

      if (data.stnk_image) {
        formData.append("stnk_image", data.stnk_image);
      }

      return vehicleAdd.addVehicle(formData);
    },
    onError: (error: AxiosError) => {
      console.error("❌ Add Vehicle Error:", error.response?.data || error.message);
    },
  });
};

export const useUpdateRFID = () => {
  return useMutation({
    mutationFn: async ({plate_number, RFID_Number}: {plate_number: string, RFID_Number: string}) => {
      return vehicleAdd.udpatedRFID(plate_number, RFID_Number);
    },
    onError: (error: AxiosError) => {
      console.error("❌ Update RFID Error:", error.response?.data || error.message);
    },
  });
};