import { Metadata } from "next";
import CardHome from "../(ui-elements)/card-home/Page";
import HeaderHome from "../(ui-elements)/header-home/page";
import HistoryHome from "../(ui-elements)/history-home/Page";

export const metadata: Metadata = {
  title: "Home | SKY Membership",
  description: "Aplikasi membership SKY Parking",
};

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-clip bg-slate-50">
      <HeaderHome />
      <CardHome />
      <HistoryHome />
    </main>
  );
}
