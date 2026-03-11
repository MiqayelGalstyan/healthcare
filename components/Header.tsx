"use client";

import { SidebarSeparator, SidebarTrigger } from "./ui/sidebar";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import { RoleEnum, RouteEnum } from "@/types/enums";
import Logo from "./Logo";
import Logout from "./Logout";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const showSidebar = role === RoleEnum.ADMIN || role === RoleEnum.DOCTOR;

  return (
    <header className="flex h-20 shrink-0 justify-between items-center gap-2 border-b pr-10">
      <div className="flex items-center gap-2 px-3">
        {showSidebar && (
          <>
            <SidebarTrigger className="cursor-pointer" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        <Logo />
      </div>
      {!showSidebar && <Link href={RouteEnum.DOCTORS}>Find Doctors</Link>}
      <div className="flex justify-start items-center gap-5">
        {session?.user?.firstName && (
          <p className="text-muted-foreground text-nowrap">
            Hi, {session?.user.firstName}
          </p>
        )}
        <ThemeSwitcher />
        <Logout />
      </div>
    </header>
  );
};

export default Header;
