"use client";

import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectWithImageProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const CustomSelectWithImage: React.FC<CustomSelectWithImageProps> = ({
  options,
  placeholder = "Pilih Provider",
  onChange,
  defaultValue = "",
}) => {
  const [selected, setSelected] = useState<Option | null>(
    options.find((o) => o.value === defaultValue) || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full">
      {/* Selected */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between border px-4 py-2 rounded-lg cursor-pointer h-11 bg-white dark:bg-dark-900"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <span className="text-sm">{selected.label}</span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}
        <FaChevronDown className="text-gray-500 text-sm" />
      </div>

      {/* Options */}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <span className="text-sm">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelectWithImage;
