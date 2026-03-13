"use client";

import { SidebarSeparator, SidebarTrigger } from "./ui/sidebar";
import ThemeSwitcher from "./ThemeSwitcher";
import { useSession } from "next-auth/react";
import { RoleEnum, RouteEnum } from "@/types/enums";
import Logo from "./Logo";
import Logout from "./Logout";
import Link from "next/link";
import { getPublicAvatarUrl } from "@/lib/supabaseStorage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const role = session?.user.role;
  const showSidebar = role === RoleEnum.ADMIN || role === RoleEnum.DOCTOR;

  const imageUrl = getPublicAvatarUrl(session?.user?.photo);

  return (
    <header className="flex h-16 sm:h-20 shrink-0 justify-between items-center gap-2 border-b px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-2">
        {showSidebar && (
          <>
            <SidebarTrigger className="cursor-pointer" />
            <SidebarSeparator orientation="vertical" className="mr-2 h-4" />
          </>
        )}
        <Logo />
      </div>
      {!showSidebar && (
        <Link
          href={RouteEnum.DOCTORS}
          className="hidden xl:block text-sm md:text-base"
        >
          Find Doctors
        </Link>
      )}

      <div className="hidden xl:flex items-center gap-3 sm:gap-5">
        {session?.user?.firstName && session?.user?.lastName && (
          <p className="text-sm md:text-base text-muted-foreground text-nowrap">
            Hi, {session.user.firstName} {session.user.lastName}
          </p>
        )}
        {imageUrl && (
          <img
            src={imageUrl}
            alt={session?.user?.firstName ?? "User"}
            width={35}
            height={35}
            className="rounded-full w-8 h-8 sm:w-9 sm:h-9"
          />
        )}
        <ThemeSwitcher />
        <Logout />
      </div>

      <div className="flex xl:hidden items-center">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-md border bg-background px-2 py-1 text-sm shadow-sm cursor-pointer">
            <MoreHorizontal className="w-5 h-5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {imageUrl && (
              <DropdownMenuItem>
                <div className="flex items-center gap-2">
                  <img
                    src={imageUrl}
                    alt={session?.user?.firstName ?? "User"}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8"
                  />
                </div>
              </DropdownMenuItem>
            )}
            {session?.user?.firstName && session?.user?.lastName && (
              <DropdownMenuLabel className="max-w-[100px] overflow-hidden text-ellipsis whitespace-nowrap">
                Hi, {session.user.firstName} {session.user.lastName}
              </DropdownMenuLabel>
            )}
            {!showSidebar && (
              <DropdownMenuItem asChild>
                <Link href={RouteEnum.DOCTORS}>Find Doctors</Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <ThemeSwitcher />
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Logout />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
