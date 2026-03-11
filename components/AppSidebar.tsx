import { ComponentProps } from "react";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RoleEnum, RouteEnum } from "@/types/enums";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Stethoscope, User, Users } from "lucide-react";

const AppSidebar = async ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const session = await getServerSession(authOptions);
  const role = session?.user.role as RoleEnum | undefined;

  const items: {
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] =
    role === RoleEnum.ADMIN
      ? [
          {
            href: RouteEnum.DASHBOARD,
            label: "Dashboard",
            icon: LayoutDashboard,
          },
          {
            href: `${RouteEnum.ADMIN}/doctors`,
            label: "Doctors",
            icon: Stethoscope,
          },
          {
            href: `${RouteEnum.ADMIN}/patients`,
            label: "Patients",
            icon: Users,
          },
        ]
      : role === RoleEnum.DOCTOR
        ? [
            {
              href: RouteEnum.DASHBOARD,
              label: "Dashboard",
              icon: LayoutDashboard,
            },
            { href: RouteEnum.DOCTOR, label: "Profile", icon: User },
          ]
        : role === RoleEnum.PATIENT
          ? [
              { href: RouteEnum.PATIENT, label: "Profile", icon: User },
              {
                href: `${RouteEnum.PATIENT}/doctors`,
                label: "Doctors",
                icon: Stethoscope,
              },
            ]
          : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarMenu className="mt-6">
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link
                  href={item.href}
                  className="flex items-center gap-2 pl-10 group-data-[collapsible=icon]:ml-2 "
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
