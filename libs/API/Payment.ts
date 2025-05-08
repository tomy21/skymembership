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
                `/v01/member/api/provider/byType?type=${type}&locationCode=${locationCode}`
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
                '/v1/productPurchase/TOP_UP',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            if (error) {
                console.error('Error response:', error);
                return error;
            } else if (error) {
                console.error('Error request:', error);
                return new Error('No response received from server');
            } else {
                console.error('Error message:', error);
                return new Error('Error occurred during request setup');
            }
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
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            
            throw  error;
        }
    },

    getAllHistoryVa: async (idTrx: string) => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/history/transaction-byidtrx/${idTrx}`
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getIdStatus: async (trxId: string) => {
        try {
        const response = await APIAPPS.get(
            `/v01/member/api/history/payment-status?trxId=${trxId}`
        );
        
        return response.data.data;
        } catch (error) {
            throw error;
        }
    },

    verifikasiPin: async (pinVerifikasi: string ) => {
        try {
            const response = await APIAPPS.post(
                `/v01/member/api/auth/verifikasi`,
                {
                    Pin: pinVerifikasi,
                }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    // Server merespons dengan status error (misal 400, 401, 500)
                    return {
                    success: false,
                    message: error.response.data?.message || 'Terjadi kesalahan dari server.',
                    status: error.response.status
                    };
                } else if (error.request) {
                    // Tidak ada respons dari server
                    return {
                    success: false,
                    message: 'Tidak ada respons dari server.',
                    };
                } else {
                    // Kesalahan dalam konfigurasi permintaan
                    return {
                    success: false,
                    message: error.message || 'Terjadi kesalahan saat menyiapkan permintaan.',
                    };
                }
                } else {
                // Bukan error dari axios
                return {
                    success: false,
                    message: 'Terjadi kesalahan tak terduga.',
                };
            }
        }
    },
}