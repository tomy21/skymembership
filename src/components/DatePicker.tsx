import { useState } from "react";
import DatePicker from "react-datepicker";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import "react-datepicker/dist/react-datepicker.css";

export default function RangePicker() {
  const [range, setRange] = useState<[Date | null, Date | null]>([null, null]);

  const [startDate, endDate] = range;

  return (
    <div className="flex">
      <DatePicker
        selectsRange={true}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          setRange(update);
        }}
        isClearable={true}
        className="focus:border-brand-500 focus:ring-brand-200/50 mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring"
      />
    </div>
  );
}
