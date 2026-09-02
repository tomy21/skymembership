"use client";

import React, { useState, FC } from "react";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

interface AccordionItemProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: FC<AccordionItemProps> = ({
  title,
  content,
  isOpen,
  onClick,
}) => {
  return (
    <div className="mb-2 rounded-md border border-gray-200">
      <button
        className="flex w-full items-center justify-between bg-white px-6 py-4 text-left"
        onClick={onClick}
      >
        <span className="font-medium">{title}</span>
        <span>{isOpen ? <IoIosArrowDropup /> : <IoIosArrowDropdown />}</span>
      </button>
      {isOpen && (
        <div className="bg-gray-50 px-6 py-4 text-gray-600">{content}</div>
      )}
    </div>
  );
};

const Accordion: FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const items = [
    {
      title: "Cara Pembayaran via ATM",
      content: (
        <ul className="list-disc pl-5 text-start">
          <li>Masukkan kartu ATM dan PIN Anda.</li>
          <li>Pilih menu Transaksi Lainnya atau Transfer.</li>
          <li>Masukkan nomor Virtual Account dan jumlah pembayaran.</li>
          <li>Konfirmasi pembayaran dan simpan bukti transaksi.</li>
        </ul>
      ),
    },
    {
      title: "Cara Pembayaran via Mobile Banking",
      content: (
        <ul className="list-disc pl-5 text-start">
          <li>Masuk ke aplikasi mobile banking Anda.</li>
          <li>Pilih menu Pembayaran atau Transfer.</li>
          <li>Masukkan nomor Virtual Account dan jumlah pembayaran.</li>
          <li>Konfirmasi pembayaran dan simpan bukti transaksi.</li>
        </ul>
      ),
    },
    {
      title: "Cara Pembayaran via Internet Banking",
      content: (
        <ul className="list-disc pl-5 text-start">
          <li>Masuk ke situs internet banking bank Anda.</li>
          <li>Pilih menu Pembayaran atau Transfer.</li>
          <li>Masukkan nomor Virtual Account dan jumlah pembayaran.</li>
          <li>Konfirmasi pembayaran dan simpan bukti transaksi.</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="mx-auto mt-4 w-full max-w-md text-sm text-gray-500">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => toggleAccordion(index)}
        />
      ))}
    </div>
  );
};

export default Accordion;
