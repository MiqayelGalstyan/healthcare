"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Stethoscope,
  User,
  Users,
  Clock9,
} from "lucide-react";
import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

type IconKey = "dashboard" | "stethoscope" | "user" | "users" | "clock9";

type Props = {
  href: string;
  label: string;
  icon: IconKey;
};

const iconMap: Record<IconKey, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  stethoscope: Stethoscope,
  user: User,
  users: Users,
  clock9: Clock9,
};

export function AppSidebarItem({ href, label, icon }: Props) {
  const pathname = usePathname();

  const isActive =
    pathname === href || (pathname?.startsWith(href + "/") ?? false);

  const Icon = iconMap[icon];

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={label}
        isActive={isActive}
        className="flex items-center gap-2 pl-10 group-data-[collapsible=icon]:ml-2"
      >
        <Link
          href={href}
          className="flex items-center gap-2 w-full rounded-lg group-data-[state=expanded]/sidebar-wrapper:rounded-none"
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
