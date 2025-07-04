import Loading from "@/components/Loading/Loading";
import { Metadata } from "next";
import React, { Suspense } from "react";
import HomePage from "./HomePage";

export const metadata: Metadata = {
  title: "Home Page | SKY Membership",
  description: "SKY PARKING Membership System",
};

export default function page() {
  return (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  );
}
