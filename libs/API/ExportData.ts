import axios from "axios";
import { APIAPPS } from "../ApiServices";

export const dataCustomer = {
  exportDataPayment: async (startDate = "", endDate = "") => {
    try {
      const response = await APIAPPS.get(
        `/v01/member/api/export-data-payment-byuser`,
        {
          params: { startDate, endDate },
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
    } catch (error: unknown) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response?.data) {
        let message = "Terjadi kesalahan saat ekspor.";

        try {
          // Decode arraybuffer to string
          const text = new TextDecoder().decode(error.response.data);
          const json = JSON.parse(text);
          if (json?.message) message = json.message;
        } catch (parseErr) {
          console.error("Gagal parsing error response:", parseErr);
        }

        return {
          error: true,
          message,
        };
      }

      return {
        error: true,
        message: "Terjadi kesalahan yang tidak diketahui.",
      };
    }
  },
};
