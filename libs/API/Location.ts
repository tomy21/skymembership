import { APIAPPS } from "../ApiServices";

export const Location = {
  getAllLocation: async (page = 1, limit = 10, search = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/location-master/getAll`,
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
      return error;
    }
  },

  getLocationByCode: async (idLocation: number) => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/location-master/getByCode?locationCode=${idLocation}`,
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
