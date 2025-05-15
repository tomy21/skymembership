import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalenderIcon } from "../../icons";
import Label from "./Label";

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range"; // react-datepicker tidak dukung "time" sebagai mode, tapi bisa diatur khusus
  onChange?: (date: Date | Date[] | null) => void;
  defaultDate?: Date | Date[] | null;
  label?: string;
  placeholder?: string;
};

export default function CustomDatePicker({
  id,
  mode = "single",
  onChange,
  defaultDate,
  label,
  placeholder,
}: PropsType) {
  const [selectedDate, setSelectedDate] = useState<Date | Date[] | null>(
    defaultDate ?? null,
  );

  useEffect(() => {
    setSelectedDate(defaultDate ?? null);
  }, [defaultDate]);

  const handleChange = (date: Date | Date[] | null) => {
    setSelectedDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <div className="space-y-1">
      {label && <Label htmlFor={id}>{label}</Label>}

      <div className="relative w-full rounded-lg border border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-900">
        <DatePicker
          id={id}
          selected={
            mode === "single" && !Array.isArray(selectedDate)
              ? (selectedDate as Date)
              : null
          }
          onChange={handleChange}
          startDate={
            mode === "range" && Array.isArray(selectedDate)
              ? selectedDate[0]
              : undefined
          }
          endDate={
            mode === "range" && Array.isArray(selectedDate)
              ? selectedDate[1]
              : undefined
          }
          dateFormat="yyyy-MM-dd"
          className="w-full border-none bg-transparent px-4 py-2.5 pr-12 text-sm text-gray-800 placeholder-gray-400 focus:outline-none dark:text-white"
          placeholderText={placeholder}
        />

        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 dark:text-gray-400">
          <CalenderIcon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
