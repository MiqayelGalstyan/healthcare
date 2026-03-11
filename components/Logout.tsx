"use client";

import { useState } from "react";
import { LogOut as LogOutIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { useRouter } from "next/navigation";
import { RouteEnum } from "@/types/enums";
import { signOut } from "next-auth/react";

const Logout = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const onLogOut = () => {
    signOut({ callbackUrl: RouteEnum.LOGIN });
    router.push(RouteEnum.LOGIN);
  };

  const onModalOpen = () => {
    setModalOpen(true);
  };

  const onModalClose = () => {
    setModalOpen(false);
  };

  return (
    <AlertDialog open={modalOpen}>
      <AlertDialogTrigger asChild>
        <SidebarMenu className="mt-auto">
          <SidebarMenuItem className="cursor-pointer">
            <SidebarMenuButton
              tooltip={"Logout"}
              className="pl-4 cursor-pointer"
              onClick={onModalOpen}
            >
              <LogOutIcon size={18} />
              <span className="cursor-pointer">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </AlertDialogTrigger>
      <AlertDialogContent className="select-none">
        <AlertDialogHeader className="pb-5">
          <AlertDialogTitle>Do you want to logout?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={onModalClose}>
            {"Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={onLogOut}>
            {"Yes"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Logout;
