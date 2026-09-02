/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { CheckCircleIcon, ChevronDownIcon } from "@/icons";
import { useProviderByType } from "@/hooks/usePayment";
import { bankInstructions } from "@/utils/bank";

interface Provider {
  id: string;
  code_bank: string;
  type_payment: string;
  is_show: number;
  gateway_partner: string;
}

interface PaymentOption {
  id: string;
  name: string;
  logo: string;
  raw: Provider;
}

interface PaymentGroup {
  category: string;
  value: string;
  options: PaymentOption[];
}

interface SelectedState {
  category: string | null;
  option: PaymentOption | null;
}

interface PaymentCardProps {
  onSelect: (selected: any) => void; // callback ke parent
  disabled?: boolean;
  isVA?: boolean;
}

export default function PaymentCard({
  onSelect,
  disabled = false,
}: PaymentCardProps) {
  const [selected, setSelected] = useState<SelectedState>({
    category: null,
    option: null,
  });
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const { data: providerData = [] } = useProviderByType(openCategory || "");

  // 🔹 Base category mandatory
  const baseCategories: Omit<PaymentGroup, "options">[] = [
    { category: "Transfer Virtual Account", value: "VIRTUAL_ACCOUNT" },
  ];

  const getBankLogo = (gateway: string) => {

    switch (gateway) {
      case "BCA":
        return "/images/company/bank/bca_logo.png";
      case "NATIONALNOBU":
        return "/images/company/bank/nobu_logo.png";
      // Tambahkan yang lain jika perlu
      default:
        return "/images/company/bank/logo.png";
    }
  };

  // 🔹 Inject options dari provider API ke dalam baseCategories
  const paymentMethods: PaymentGroup[] = useMemo(() => {

    return baseCategories.map((cat) => {
      const options = providerData
        .filter(
          (item: Provider) => item.type_payment === cat.value && item.is_show,
        )
        .map((item: Provider) => ({
          id: item.id,
          name: item.code_bank === "NATIONALNOBU" ? "NOBU" : item.code_bank,
          logo: getBankLogo(item.code_bank),
          raw: item,
        }));

      return { ...cat, options };
    });
  }, [providerData]);

  const handleSelect = (categoryValue: string, option: PaymentOption) => {
    // toggle: kalau klik yang sama, hapus seleksi
    if (
      selected.option?.id === option.id &&
      selected.category === categoryValue
    ) {
      setSelected({ category: null, option: null });
      onSelect(null); // reset callback ke parent kalau perlu
    } else {
      setSelected({ category: categoryValue, option });
      onSelect(option.raw);
    }
  };

  const handleToggle = (categoryValue: string) => {
    setOpenCategory(openCategory === categoryValue ? null : categoryValue);
  };

  return (
    <div className="w-full space-y-4">
      {paymentMethods.map((group) => (
        <div key={group.value} className="rounded-lg border bg-white shadow">
          {/* Header category */}
          <button
            onClick={() => handleToggle(group.value)}
            className="flex w-full items-center justify-between p-4 text-left"
          >
            <span className="font-semibold">{group.category}</span>
            <ChevronDownIcon
              className={`h-5 w-5 transform transition ${openCategory === group.value ? "rotate-180" : ""
                }`}
            />
          </button>

          {/* Options */}
          {openCategory === group.value && group.options.length > 0 && (
            <div className="flex flex-col border-t">
              {group.options.map((opt) => {
                const isSelected =
                  selected.option?.id === opt.id &&
                  selected.category === group.value;

                return (
                  <div
                    key={opt.id}
                    className={`border-b transition last:border-none ${isSelected ? "border-yellow-400 bg-yellow-50" : "bg-white"
                      }`}
                  >
                    {/* 🔹 Header baris logo + nama + checklist */}
                    <div
                      className="flex cursor-pointer items-center justify-between p-5"
                      onClick={() =>
                        !disabled && handleSelect(group.value, opt)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Image
                          src={opt.logo}
                          alt={opt.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {opt.name}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircleIcon className="h-7 w-7 text-yellow-400" />
                      )}
                    </div>

                    {/* 🔹 Instruksi tampil di bawah header */}
                    {isSelected && bankInstructions[opt.name] && (
                      <div className="space-y-4 bg-gray-50 px-5 pb-4 text-sm text-gray-600">
                        <h4 className="mb-2 font-semibold">
                          Tata Cara Pembayaran Virtual Account (VA) {opt.name}
                        </h4>
                        <div className="max-h-[20vh] overflow-auto">
                          {bankInstructions[opt.name].map((section, idx) => (
                            <div key={idx}>
                              <h5 className="mb-1 font-medium">
                                {section.title}
                              </h5>
                              <ol className="list-decimal space-y-1 pl-5">
                                {section.steps.map((step, sidx) => (
                                  <li key={sidx}>{step}</li>
                                ))}
                              </ol>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
