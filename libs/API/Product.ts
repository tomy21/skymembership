import { APIAPPS } from "../ApiServices";

export const Product = {
  getProductAll: async () => {
    try {
      const response = await APIAPPS.get(`/v01/member/api/product/getAll`);
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getProductByLicense: async (locationCode: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/product-byLocation/${locationCode}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getPeriode: async (locationCode: string, type: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/product-byVehicle/${type}/${locationCode}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getProduct: async (locationCode: string, type: string, period: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/product-periode?locationCode=${locationCode}&type=${type}&periode=${period}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
