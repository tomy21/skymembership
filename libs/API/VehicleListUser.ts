import { APIAPPS, APISERVICES } from "../ApiServices";
import { DetailUser } from "./Auth";

export const VehicleListUser = {
  getVehicle: async (page = 1, limit = 1, search = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/vehicle-list/by-userid`,
        {
          params: {
            page,
            limit,
            search,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVehicleUnActiveLocation: async (
    type = "",
    locationCode = "",
    page = 1,
    limit = 10,
    search = "",
  ) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/vehicle-list/by-userid/vehicle-unactive`,
        {
          params: {
            page,
            limit,
            search,
            locationCode,
            type,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export const vehicleAdd = {
  addVehicle: async (data: FormData) => {
    try {
      const token = await DetailUser.getToken();

      const response = await APISERVICES.post(
        `/v1/productPurchase/register-vehicle`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getById: async (id: number) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/vehicle-list/by-id/${id}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  udpatedRFID: async (plate_number: string, rfid: string) => {
    try {
      const token = await DetailUser.getToken();
      const response = await APISERVICES.post(
        `/v1/customer/update-rfid`,
        {
          plate_number: plate_number,
          RFID_Number: rfid,
        },
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getDetailVehicle: async (id: string) => {
    const token = await DetailUser.getToken();
    try {
      const response = await APISERVICES.get(
        `/v1/customer/members-vehicle/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCardDetails: async () => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/auth/list-card-members`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getCardLocationActive: async (rfid: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/auth//list-card-members/${rfid}`,
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
