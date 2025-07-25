import { SidebarTennantProvider } from "@/context/SidebarTennantContext";
import TennantLayout from "../TennantLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarTennantProvider>
      {/* seluruh layoutmu */}
      <TennantLayout>{children}</TennantLayout>
    </SidebarTennantProvider>
  );
}
