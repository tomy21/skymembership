"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FaChevronDown } from "react-icons/fa";

interface Option {
  id: string;
  code_bank: string;
  gateway_partner: string;
}

interface CustomSelectWithImageProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: Option) => void;
  defaultValue?: string;
}

const CustomSelectWithImage: React.FC<CustomSelectWithImageProps> = ({
  options,
  placeholder = "Pilih Provider",
  onChange,
  defaultValue = "",
}) => {
  const [selected, setSelected] = useState<Option | null>(
    options.find((o) => o.id === defaultValue) || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange(option);
    setIsOpen(false);
  };
  
  const getBankLogo = (gateway: string) => {
    switch (gateway) {
      case "BAYARIND":
        return "/images/company/bank/bca_logo.png";
      case "NOBU":
        return "/images/company/bank/nobu_logo.png";
      // Tambahkan yang lain jika perlu
      default:
        return "/images/company/bank/logo.png";
    }
  };

  return (
    <div className="relative w-full">
      {/* Selected */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center justify-between border px-4 py-2 rounded-lg cursor-pointer h-11 bg-white"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <Image
              src={getBankLogo(selected.gateway_partner)}
              alt={selected.gateway_partner}
              width={24}
              height={24}
            />
            <span className="text-sm">{selected.gateway_partner === "BAYARIND" ? "BCA" : selected.gateway_partner}</span>
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
              key={option.id}
              onClick={() => handleSelect(option)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              <Image
                src={getBankLogo(option.gateway_partner)}
                alt={option.gateway_partner}
                width={24}
                height={24}
              />
              <span className="text-sm">{option.gateway_partner === "BAYARIND" ? "BCA" : option.gateway_partner}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelectWithImage;
