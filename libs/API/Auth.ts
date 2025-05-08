import { APIAPPS, APISERVICES } from "../ApiServices";
import { AxiosError } from 'axios';


export const login = async (data: string) => {
  const response = await APIAPPS.post(`/v01/member/api/auth/login`,{
    data
  });
  
  return response.data;
};
export const logout = async () => {
  const response = await APIAPPS.get(`/v01/member/api/auth/logout`);
  
  return response.data;
};

export const Users = {
    getAllUser: async (page = 1, limit = 10, search = "") => {
        try {
            const response = await APIAPPS.get(`/v01/member/api/auth/user`, {
                params: {
                    page,
                    limit,
                    search,
                },
            });
            return response.data;
        } catch (error) {
            return error;
        }
    },

    requestTokenAktivasion: async (email = "", referralUrl ="") => {
        try {
            const response = await APIAPPS.post(
                `/v01/member/api/auth/request-email-verification`,
                {
                    email,
                    referralUrl,
                }
            );
            return response.data;
        } catch (error) {
            const serverError = error || {
                message: 'Unknown error',
            };
            console.warn('Server validation error:', serverError);
            return serverError;
        }
    },

    requestResetPassword: async (email = "", referralUrl ="") => {
        try {
            const response = await APIAPPS.post(
                `/v01/member/api/auth/request-reset-password`,
                {
                    email,
                    referralUrl,
                }
            );
            return response.data;
        } catch (error) {
            const serverError = error || {
                message: 'Unknown error',
            };
            console.warn('Server validation error:', serverError);
            return serverError;
        }
    },

    requestChangePassword: async (password = "", confirmPassword = "", token ="") => {
        try {
            const response = await APIAPPS.post(
                `/v01/member/api/auth//request-change-password`,
                {
                    password,
                    confirmPassword,
                    token,
                }
            );
            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            const message = err.response?.data?.message || 'Unknown error';
            throw new Error(message);
        }
    },

    getByUserId: async () => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/auth/userById`
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getByUserIdCMS: async () => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/auth/cms-userById`
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getVehicle: async (page = 1, limit = 10, search = "") => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/vehicle-list/by-userid`,
                {
                    params: {
                        page,
                        limit,
                        search,
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getVehicleByType: async (type = "", page = 1, limit = 10, search = "") => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/vehicle-list/${type}`,
                {
                    params: {
                        page,
                        limit,
                        search,
                    },
                }
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
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getCardLocation: async () => {
        try {
            const token = await DetailUser.getToken();
            const response = await APISERVICES.get(
                `/v1/customer/members-vehicle`,
                {
                    headers: {
                        Authorization: `Bearer ${token.token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData = {}) => {
        try {
            const response = await APIAPPS.post(
                'v01/member/api/auth/register',
                userData
            );

            return response.data;
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;

            const message = err.response?.data?.message || 'Unknown error';
            throw new Error(message);
        }
    },
};

export const DetailUser =  {
  getUserId: async () => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/auth/user/byId`
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    getToken: async () => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/auth/protected`
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    verifyToken: async () => {
        try {
            const response = await APIAPPS.get(
                '/v01/member/api/auth/protected'
            );
            return response.data;
        } catch (error) {
            const serverError = error || {
                message: 'Unknown error',
            };
            console.warn('Server validation error:', serverError);
            return serverError;
        }
    },

    updateUserById: async (idUser = "", data = {}) => {
        try {
            const response = await APIAPPS.patch(
                `/v01/member/api/auth/usersDetail/${idUser}`,
                data
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    

    resetPassword: async (email="") => {
        try {
            const response = await APIAPPS.post(
                'v01/member/api/auth/request-password-reset',
                {
                    email: email,
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    newPassword: async (token = "", newPassword = "") => {
        try {
            const response = await APIAPPS.post(
                'v01/member/api/auth/reset-password',
                {
                    token: token,
                    newPassword: newPassword,
                }
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },

    vehicleType: async () => {
        try {
            const response = await APIAPPS.get(
                `/v01/member/api/vehicle-list/by-userid`
            );
            return response.data;
        } catch (error) {
            return error;
        }
    },
}


export async function selfdestroy() {

    try {
        
        
    } catch (error) {
        return error;
    }

}