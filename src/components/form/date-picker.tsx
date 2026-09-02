import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Label from "./Label";
import CalenderIcon from "@/icons/CalenderIcon";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range"; // react-datepicker tidak dukung "time" sebagai mode, tapi bisa diatur khusus
  onChange: (date: Date | [Date | null, Date | null] | null) => void;
  defaultDate?: Date | Date[] | null;
  label?: string;
  placeholder?: string;
};

type DateValue = Date | [Date | null, Date | null] | null;

export default function CustomDatePicker({
  id,
  mode = "single",
  onChange,
  defaultDate,
  label,
  placeholder,
}: PropsType) {
  const [selectedDate, setSelectedDate] = useState<DateValue>(null);

  useEffect(() => {
    setSelectedDate((defaultDate ?? null) as DateValue);
  }, [defaultDate]);

  const handleChange = (date: DateValue) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        {mode === "range" ? (
          <DatePicker
            id={id}
            onChange={handleChange}
            startDate={
              Array.isArray(selectedDate) ? selectedDate[0] : undefined
            }
            endDate={Array.isArray(selectedDate) ? selectedDate[1] : undefined}
            selectsRange
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="w-full border-none bg-transparent px-4 py-2.5 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-white"
            placeholderText={placeholder}
          />
        ) : mode === "multiple" ? (
          <DatePicker
            id={id}
            onChange={handleChange}
            // Cast sebagai array jika tipe sesuai
            selected={undefined} // required to remove TS error
            // selectsMultiple={true} // jika versi react-datepicker mendukung ini (pastikan)
            // includeDates={Array.isArray(selectedDate) ? selectedDate : undefined}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="w-full border-none bg-transparent px-4 py-2.5 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-white"
            placeholderText={placeholder}
          />
        ) : (
          <DatePicker
            id={id}
            selected={selectedDate instanceof Date ? selectedDate : undefined}
            onChange={handleChange}
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            className="w-full border-none bg-transparent px-4 py-2.5 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-white"
            placeholderText={placeholder}
          />
        )}

        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <CalenderIcon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
