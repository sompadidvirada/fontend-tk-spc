"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import EditUserForm from "./EditUserForm";
import { LogoutItem } from "@/app/admin/LogoutItem";
import { useUIStore } from "@/store/ui";

export function NavUser({
  user,
}: {
  user: {
    id: string;
    name: string;
    phonenumber: string;
    role: string;
    image: string;
    birth_date: string;
  };
}) {
  const { isMobile } = useSidebar();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const lang = useUIStore((s)=>s.language)


 const  t = {
    profileDetail: lang === "LA" ? "ແກ້ໄຂຂໍ້ມູນໂປຮຟາຍ" : "Profile Detail",
    changePassword: lang === "LA" ? "ແກ້ໄຂລະຫັດຜ່ານ" : "Change password"
  }

  const userAvatar =
    user.image && user.image.trim() !== "" ? user.image : undefined;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-full">
                  {/* FIX 1: Pass undefined instead of "" */}
                  <AvatarImage src={userAvatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-red-400 font-bold opacity-70">
                    {user.role}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 rounded-full">
                    {/* FIX 2: Apply the same safe check here */}
                    <AvatarImage src={userAvatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs text-red-400 font-bold opacity-70">
                      {user.phonenumber}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="font-lao">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(e) => {
                    e.preventDefault();
                    setShowEditDialog(true);
                  }}
                >
                  <BadgeCheck />
                  {t.profileDetail}
                </DropdownMenuItem>
                <DropdownMenuItem disabled={true} className="cursor-pointer">
                  <CreditCard />
                  {t.changePassword}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <LogoutItem lang={lang}/>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="font-lao">
          <DialogHeader>
            <DialogTitle>{t.profileDetail}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          <EditUserForm
            user={user}
            onSuccess={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
