// context/TopupContext.tsx
"use client";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface Option {
  id: string;
  code_bank: string;
  gateway_partner: string;
}

interface PurchaseData {
  idProduct: number;
  bank_id: string;
  plate_number: string;
  type: string;
  provider: Option | null;
}

interface PurchaseContextType {
  purchaseData: PurchaseData;
  setPurchaseData: (data: Partial<PurchaseData>) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(
  undefined,
);

const defaultData: PurchaseData = {
  idProduct: 0,
  bank_id: "",
  plate_number: "",
  type: "",
  provider: null,
};

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [purchaseData, setPurchaseState] = useState<PurchaseData>(defaultData);

  // Ambil dari localStorage saat awal load
  useEffect(() => {
    const stored = localStorage.getItem("purchaseData");
    if (stored) {
      setPurchaseState(JSON.parse(stored));
    }
  }, []);

  // Simpan ke localStorage setiap kali berubah
  useEffect(() => {
    localStorage.setItem("purchaseData", JSON.stringify(purchaseData));
  }, [purchaseData]);

  const setPurchaseData = (data: Partial<PurchaseData>) => {
    setPurchaseState((prev) => ({ ...prev, ...data }));
  };

  return (
    <PurchaseContext.Provider value={{ purchaseData, setPurchaseData }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchaseContext = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchaseContext must be used within PurchaseProvider");
  }
  return context;
};
