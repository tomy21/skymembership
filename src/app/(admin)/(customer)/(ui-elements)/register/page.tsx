import RegisterPage from "@/components/form/form-elements/RegisterCustomer";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Register | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Vehicle() {
  return (
    <>
      <RegisterPage />
    </>
  );
}
