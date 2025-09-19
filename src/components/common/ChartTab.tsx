// ChartTab.tsx
import React from "react";

type ChartTabProps = {
  value: "day" | "month" | "year";
  onChange: (value: "day" | "month" | "year") => void;
};

const ChartTab: React.FC<ChartTabProps> = ({ value, onChange }) => {
  const getButtonClass = (option: "day" | "month" | "year") =>
    value === option
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
      {(["day", "month", "year"] as const).map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          className={`text-theme-sm w-full rounded-md px-3 py-2 font-medium hover:text-gray-900 dark:hover:text-white ${getButtonClass(option)}`}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}ly
        </button>
      ))}
    </div>
  );
};

export default ChartTab;
