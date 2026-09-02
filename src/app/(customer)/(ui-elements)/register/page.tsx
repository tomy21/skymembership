import RegisterPage from "@/components/form/form-elements/RegisterCustomer";
import Loading from "@/components/Loading/Loading";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Register | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Vehicle() {
  return (
    <Suspense fallback={<Loading />}>
      <RegisterPage />
    </Suspense>
  );
}
