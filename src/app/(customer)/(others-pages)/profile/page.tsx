import HeaderPage from "@/components/header-page/page";
import Loading from "@/components/Loading/Loading";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Profile | SKY Parking",
  description: "Parking Membership SKY PARKING",
};

export default function Profile() {
  return (
    <div className="mx-auto min-h-screen w-full space-y-2 bg-white sm:w-sm">
      <Suspense fallback={<Loading />}>
        <HeaderPage title="Profile" />
        <UserMetaCard />
        <UserInfoCard />
      </Suspense>
    </div>
  );
}
