import type { Metadata } from "next";
import React from "react";
import SignIn from "@/app/(full-width-pages)/(auth)/signin/page";

export const metadata: Metadata = {
  title: "Dashboard | Admin - SKY Membership",
  description: "Ad",
};

export default function Page() {
  return <SignIn />;
}
