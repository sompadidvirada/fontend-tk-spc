"use client";

import * as React from "react";
import { Airplay, Coffee, Croissant, Settings2, Warehouse } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// 1. Import your JWTPayload type (or define it)
import { JWTPayload } from "jose";
import { useStaffStore } from "@/store/staff";

// 2. Define the Props interface
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: JWTPayload | null;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const staff = useStaffStore((s) => s.staff);

  const data = {
    user: {
      id: staff?.id as string,
      name: staff?.name as string,
      phonenumber: staff?.phonenumber as string,
      role: staff?.role as string,
      image: staff?.image as string,
      birth_date: staff?.birthdate as string,
    },
    navMain: [
      {
        title: "ຈັດການພະແນກຈັດຊື້",
        url: "/staffoffice/bakerymanage",
        icon: Croissant,
        items: [
          ...(staff?.role === "STAFF_SPC"
            ? [
                {
                  title: "ເບເກີລີ້",
                  url: "/staffoffice/bakerymanage",
                },
                {
                  title: "ຄີຍອດຂາຍ",
                  url: "/staffoffice/tracksell",
                },
                {
                  title: "ຄີຍອດໝົດອາຍຸ",
                  url: "/staffoffice/trackexp",
                },
                {
                  title: "ຕິດຕາມອໍເດີເບີເກີລີ້",
                  url: "/staffoffice/manageorderbakery",
                },
                {
                  title: "ຕິດຕາມອັປໂຫລດຮູບພາບສາຂາ",
                  url: "/staffoffice/trackimagebranch",
                },
                {
                  title: "ຕິດຕາມລາຍງານເບເກີລີ້ມີບັນຫາ",
                  url: "/staffoffice/trackreport",
                },
              ]
            : []),

          {
            title: "ຄີຍອດຈັດສົ່ງ",
            url: "/staffoffice/tracksend",
          },
          {
            title: "ແຜນຈັດຊຶ້ປະຈຳເດືອນ",
            url: "/staffoffice/calendarorder",
          },
        ],
      },
      {
        title: "ຈັດການພະແນກສາງ",
        url: "/staffoffice/material",
        icon: Warehouse,
        items: [
          {
            title: "ຈັດການວັດຖຸດິບ",
            url: "/staffoffice/material",
          },
          {
            title: "ຄີຍອດເບີກວັດຖຸດິບ",
            url: "/staffoffice/materialrequisition",
          },
          {
            title: "ລາຍງານການເບີກວັດຖຸດິບ",
            url: "/staffoffice/reportstockrequisition",
          },
        ],
      },

      {
        title: "ຈັດການທົ່ວໄປ",
        url: "#",
        icon: Settings2,
        items: [
          ...(staff.role === "STAFF_SPC"
            ? [
                {
                  title: "ພະນັກງານ",
                  url: "/staffoffice/staffmanage",
                },
              ]
            : []),
          {
            title: "ສາຂາ",
            url: "/staffoffice/branchsmanage",
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
