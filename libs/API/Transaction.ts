import { APIAPPS, APISERVICES } from "../ApiServices";

export const Transaction = {
  submitPayment: async (id = null) => {
    try {
      const response = await APISERVICES.post(
        `/v1/productPurchase/purchase/${id}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getHistoryParkingById: async (page = 1, limit = 1, search = "") => {
    try {
      console.log(page, limit, search);
      const response = await APIAPPS.get(`/v01/member/api/history-post`, {
        params: { page, limit, search },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllTransactionByUser: async (page = 1, limit = 5, search = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/transaction-byuser`,
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
  getAllHistoryVa: async (VA = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/transaction-virtualaccount/${VA}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },

  getAllTransaction: async (page = 1, limit = 10, status = "", search = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/transaction`,
        {
          params: {
            page,
            limit,
            status,
            search,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  getAllTransactionTopup: async (
    page = 1,
    limit = 10,
    status = "",
    search = "",
  ) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/transaction-topup`,
        {
          params: {
            page,
            limit,
            status,
            search,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAllPayment: async (page = 1, limit = 10, status = "", search = "") => {
    try {
      const response = await APIAPPS.get(`/v01/member/api/history/payments`, {
        params: {
          page,
          limit,
          status,
          search,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  exportDataPayment: async (
    startDate = "",
    endDate = "",
    locationCode = "",
  ) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/export-data-payment`,
        {
          params: { startDate, endDate, locationCode },
          responseType: "arraybuffer",
        },
      );
      const fileName = `History_Payment_${startDate} sd ${endDate}.xlsx`;

      return {
        blob: new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }),
        fileName,
      };
    } catch (error) {
      throw error;
    }
  },

  getHistoryByLocation: async (month = "", year = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/get-history-location`,
        {
          params: {
            month,
            year,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
