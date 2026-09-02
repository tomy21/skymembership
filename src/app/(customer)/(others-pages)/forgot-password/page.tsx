import { Metadata } from "next";
import React, { Suspense } from "react";
import ForgotePassword from "../../(ui-elements)/ForgotePassword/page";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Reset Password | SKY Membership",
  description: "Membership Parking SKY PARKING",
  // other metadata
};
export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <ForgotePassword />
    </Suspense>
  );
}
