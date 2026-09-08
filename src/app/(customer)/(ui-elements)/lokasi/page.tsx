import CardLocation from "@/components/CardLocation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kartu  | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Lokasi() {
  return (
    <div className="relative min-h-screen w-full bg-white sm:w-sm">
      {/* <HeaderPage title="Lokasi Member" /> */}
      <CardLocation />
    </div>
  );
}
