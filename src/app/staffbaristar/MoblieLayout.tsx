"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Croissant, Camera, CandyOff, User } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Navigation Config for easy maintenance
  const navItems = [
    { label: "Order", icon: Croissant, href: "/staffbaristar/orderbakery" },
    { label: "Image", icon: Camera, href: "/staffbaristar/imagebakery" },
    { label: "Report", icon: CandyOff, href: "/staffbaristar/reportbakery" },
    { label: "Profile", icon: User, href: "/staffbaristar/profile" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {" "}
      {/* pb-20 prevents content hiding behind bar */}
      <main>{children}</main>
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.label === "Profile" && pathname === "/staffbaristar");
            return (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
              >
                <Icon
                  className={cn(
                    "w-5 h-5 mb-1 transition-colors",
                    isActive
                      ? "text-blue-600"
                      : "text-gray-500 group-hover:text-blue-600 opacity-40",
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] transition-colors",
                    isActive
                      ? "text-blue-600 font-bold"
                      : "text-gray-500 group-hover:text-blue-600 opacity-40",
                  )}
                >
                  {item.label}
                </span>
                {/* Active Indicator dot */}
                {isActive && (
                  <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileLayout;
