import HeaderPage from "@/components/header-page/page";
import UserInfoCard from "@/components/user-profile/UserInfoCard";
import UserMetaCard from "@/components/user-profile/UserMetaCard";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | SKY Parking",
  description:
    "Parking Membership SKY PARKING",
};

export default function Profile() {
  return (
    <div className='bg-white w-full min-h-screen'>
      <HeaderPage title="Profile" />
      <UserMetaCard />
      <UserInfoCard />
    </div>
  );
}
