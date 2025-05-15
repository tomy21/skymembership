import { Metadata } from "next";
import React, { Suspense } from "react";
import ChangePassword from "../../(customer)/(ui-elements)/ChangePassword/ChangePassword";
import Loading from "@/components/Loading/Loading";

export const metadata: Metadata = {
  title: "Change Password | SKY Membership",
  description: "Membership Parking SKY PARKING",
};
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ChangePassword />
    </Suspense>
  );
}
