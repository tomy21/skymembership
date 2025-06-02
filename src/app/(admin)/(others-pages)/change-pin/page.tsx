import { Metadata } from "next";
import React, { Suspense } from "react";
import Loading from "@/components/Loading/Loading";
import ChangePin from "../../(customer)/(ui-elements)/ChangePin/changePin";

export const metadata: Metadata = {
  title: "Change PIN | SKY Membership",
  description: "Membership Parking SKY PARKING",
};
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ChangePin />
    </Suspense>
  );
}
