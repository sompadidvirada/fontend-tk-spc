"use client";

import * as React from "react";
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {/* We use a div instead of SidebarMenuButton to remove button styles */}
        <div 
          className="flex items-center gap-2 px-2 py-4 h-20"
        >
          <div
            className={cn(
              "flex items-center justify-center transition-all",
              "size-17",
              "group-data-[collapsible=icon]:size-9"
            )}
          >
            <div
              className={cn(
                "overflow-hidden rounded-full bg-sidebar-accent transition-all",
                "h-15 w-15",
                "group-data-[collapsible=icon]:h-7",
                "group-data-[collapsible=icon]:w-7"
              )}
            >
              <Image
                src="/small_logo.png"
                alt="Treekoff logo"
                width={60}
                height={60}
                className="object-cover"
              />
            </div>
          </div>

          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-bold text-[20px]">TREEKOFF</span>
            <span className="truncate text-[9px] opacity-50">
              BOLAVEN PLATEAU - SINCE 2021
            </span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}