import { Metadata } from "next";
import HistoryAll from "../history-all/page";

export const metadata: Metadata = {
  title: "History | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Lokasi() {
  return (
    <div className="relative min-h-screen w-full bg-white">
      <HistoryAll />
    </div>
  );
}
