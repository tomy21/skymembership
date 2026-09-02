import { addHours } from "date-fns";
import { format } from "date-fns-tz";

export const formatToWIB = (isoDate: string) => {
  const date = new Date(isoDate);
  const wibDate = addHours(date, 7); // tambahkan 7 jam manual
  return format(wibDate, "dd MMM yyyy HH:mm:ss");
};
