import { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import ChangePassword from "../../(ui-elements)/ChangePassword/ChangePassword";

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
