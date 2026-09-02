// context/TransactionContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the TransactionPayload interface
interface TransactionPayload {
  Id: number;
  createdAt: string;
  expired_date: string;
  invoice_id: string;
  periode?: string;
  price: number;
  product_name: string;
  purchase_type: string;
  statusPayment: string;
  timestamp: string;
  transactionType: string;
  trxId: string;
  updatedAt: string;
  user_id: number;
  virtual_account: string;
  rfid?: string;
}

// Define the context type for transaction data
interface TransactionContextType {
  admin_fee: number;
  paymentData: TransactionPayload | null; // Can be null initially
  setPaymentData: (data: TransactionPayload) => void;
  setAdminFee: (fee: number) => void;
}

// Define the props for the provider, which includes `children` of type ReactNode
interface TransactionProviderProps {
  children: ReactNode;
}

// Create context
const PaymentContext = createContext<TransactionContextType | undefined>(
  undefined,
);

// Custom hook to access context
export const usePaymentContext = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error(
      "useTransactionContext must be used within a TransactionProvider",
    );
  }
  return context;
};

// Context Provider Component
export const PaymentProvider: React.FC<TransactionProviderProps> = ({
  children,
}) => {
  // Initialize state with null instead of undefined
  const [paymentData, setPaymentData] = useState<TransactionPayload | null>(
    null,
  );
  const [admin_fee, setAdminFee] = useState<number>(0); // Optional, if you want to manage the fee

  return (
    <PaymentContext.Provider
      value={{ paymentData, setPaymentData, admin_fee, setAdminFee }}
    >
      {children}
    </PaymentContext.Provider>
  );
};
