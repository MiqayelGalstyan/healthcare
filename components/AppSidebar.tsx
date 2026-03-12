import { ComponentProps } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RoleEnum, RouteEnum } from "@/types/enums";
import { Sidebar, SidebarContent, SidebarMenu } from "@/components/ui/sidebar";
import { AppSidebarItem } from "@/components/AppSidebarItem";

const AppSidebar = async ({ ...props }: ComponentProps<typeof Sidebar>) => {
  const session = await getServerSession(authOptions);
  const role = session?.user.role as RoleEnum | undefined;

  const items: {
    href: string;
    label: string;
    icon: "dashboard" | "stethoscope" | "user" | "users" | "clock9";
  }[] =
    role === RoleEnum.ADMIN
      ? [
          {
            href: RouteEnum.DASHBOARD,
            label: "Dashboard",
            icon: "dashboard",
          },
          {
            href: `${RouteEnum.ADMIN}/doctors`,
            label: "Doctors",
            icon: "stethoscope",
          },
          {
            href: `${RouteEnum.ADMIN}/patients`,
            label: "Patients",
            icon: "users",
          },
        ]
      : role === RoleEnum.DOCTOR
        ? [
            {
              href: RouteEnum.DASHBOARD,
              label: "Dashboard",
              icon: "dashboard",
            },
            { href: RouteEnum.DOCTOR, label: "Working hours (timeslots)", icon: "clock9" },
          ]
        : role === RoleEnum.PATIENT
          ? [
              { href: RouteEnum.PATIENT, label: "Profile", icon: "user" },
              {
                href: `${RouteEnum.PATIENT}/doctors`,
                label: "Doctors",
                icon: "stethoscope",
              },
            ]
          : [];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarMenu className="mt-6">
          {items.map((item) => (
            <AppSidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
            />
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
