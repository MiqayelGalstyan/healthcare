import AppSidebar from "@/components/AppSidebar";
import Header from "@/components/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { authOptions } from "@/lib/auth";
import { RoleEnum } from "@/types/enums";
import { getServerSession } from "next-auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  const showSidebar = role === RoleEnum.ADMIN || role === RoleEnum.DOCTOR;

  return (
    <SidebarProvider defaultOpen>
      {showSidebar && <AppSidebar />}
      <SidebarInset>
        <Header />
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
