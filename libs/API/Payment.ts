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
            console.log(error);
            return error;
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
        // console.log(response.data)
        return response.data.data;
        } catch (error) {
            throw error;
        }
    },
}