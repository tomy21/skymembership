import axios from "axios";
import { APIAPPS, APISERVICES } from "../ApiServices";
import { DetailUser } from "./Auth";

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

export const Provider = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await APIAPPS.get(`/v01/member/api/provider`, {
        params: {
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  getAllByType: async (type = "", locationCode = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/provider/byType?type=${type}&locationCode=${locationCode}`,
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },
};

export const Payment = {
  createVaTopup: async (data: TopupPayload) => {
    try {
      const token = await DetailUser.getToken();

      const response = await APISERVICES.post(
        "/v1/productPurchase/TOP_UP",
        data,
        {
          headers: {
            Authorization: `Bearer ${token.token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      // Jika error dari response API
      if (error.response) {
        console.error("API responded with an error:", error.response.data);
        return Promise.reject(error.response.data);
      }

      // Jika request dikirim tapi tidak ada respons (server mati/delay)
      if (error.request) {
        console.error("No response received from server:", error.request);
        return Promise.reject({ message: "No response received from server" });
      }

      // Jika terjadi error dalam setup request (mungkin syntax atau config error)
      console.error("Error setting up the request:", error.message);
      return Promise.reject({ message: error.message });
    }
  },

  createVaPuchase: async ({ idProduct, data }: CreateVaPurchaseParams) => {
    try {
      const token = await DetailUser.getToken();

      const response = await APISERVICES.post(
        `/v1/productPurchase/purchase/${idProduct}`,
        data,
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
  createVaPuchaseByPoint: async ({
    idProduct,
    data,
  }: CreateVaPurchaseParams) => {
    try {
      const token = await DetailUser.getToken();

      const response = await APISERVICES.post(
        `/v1/productPurchase/purchasePoints/${idProduct}`,
        data,
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

  getAllHistoryVa: async (idTrx: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/transaction-byidtrx/${idTrx}`,
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },

  getIdStatus: async (trxId: string) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/history/payment-status?trxId=${trxId}`,
      );

      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  verifikasiPin: async (pinVerifikasi: string) => {
    try {
      const response = await APIAPPS.post(`/v01/member/api/auth/verifikasi`, {
        Pin: pinVerifikasi,
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server merespons dengan status error (misal 400, 401, 500)
          return {
            success: false,
            message:
              error.response.data?.message || "Terjadi kesalahan dari server.",
            status: error.response.status,
          };
        } else if (error.request) {
          // Tidak ada respons dari server
          return {
            success: false,
            message: "Tidak ada respons dari server.",
          };
        } else {
          // Kesalahan dalam konfigurasi permintaan
          return {
            success: false,
            message:
              error.message || "Terjadi kesalahan saat menyiapkan permintaan.",
          };
        }
      } else {
        // Bukan error dari axios
        return {
          success: false,
          message: "Terjadi kesalahan tak terduga.",
        };
      }
    }
  },
};
