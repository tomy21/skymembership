// context/TopupContext.tsx
"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Option {
  id: string;
  code_bank: string;
  gateway_partner: string;
}

interface TopupData {
  nominal: number;
  method: string;
  type: string;
  provider: Option | null;
}

interface TopupContextType {
  topupData: TopupData;
  setTopupData: (data: Partial<TopupData>) => void;
}

const TopupContext = createContext<TopupContextType | undefined>(undefined);

export const TopupProvider = ({ children }: { children: ReactNode }) => {
  const [topupData, setTopupState] = useState<TopupData>({
    nominal: 0,
    method: "",
    type: "",
    provider: null,
  });

  const setTopupData = (data: Partial<TopupData>) => {
    setTopupState((prev) => ({ ...prev, ...data }));
  };

  return (
    <TopupContext.Provider value={{ topupData, setTopupData }}>
      {children}
    </TopupContext.Provider>
  );
};

export const useTopupContext = () => {
  const context = useContext(TopupContext);
  if (!context) {
    throw new Error("useTopupContext must be used within TopupProvider");
  }
  return context;
};
