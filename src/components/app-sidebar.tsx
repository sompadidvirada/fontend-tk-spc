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
import { useUIStore } from "@/store/ui";

// 2. Define the Props interface
interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: JWTPayload | null;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const staff = useStaffStore((s) =>s.staff)
  const lang = useUIStore((s) => s.language); // Get language state

  // 1. Translation Object
  const t = {
    overview: lang === "LA" ? "ລາຍງານພາບລວມ" : "Overview Report",
    allReports: lang === "LA" ? "ລາຍງານລວມທັງໝົດ" : "General Dashboard",
    bakeryReport: lang === "LA" ? "ລາຍງານເບເກີລີ້" : "Bakery Report",
    materialReport: lang === "LA" ? "ລາຍງານການເບີກວັດຖຸດິບ" : "Material Requisition Report",
    
    procurement: lang === "LA" ? "ຈັດການພະແນກຈັດຊື້" : "Procurement Dept",
    bakery: lang === "LA" ? "ເບເກີລີ້" : "Bakery List",
    trackSell: lang === "LA" ? "ຄີຍອດຂາຍ" : "Track Sales",
    trackSend: lang === "LA" ? "ຄີຍອດຈັດສົ່ງ" : "Track Delivery",
    trackExp: lang === "LA" ? "ຄີຍອດໝົດອາຍຸ" : "Track Expiration",
    orderBakery: lang === "LA" ? "ຈັດການອໍເດີເບເກີລີ້" : "Manage Bakery Orders",
    manageOrders: lang === "LA" ? "ຕິດຕາມອໍເດີເບີເກີລີ້" : "Follow Orders",
    trackImage: lang === "LA" ? "ຕິດຕາມອັປໂຫລດຮູບພາບສາຂາ" : "Branch Image Tracking",
    problemReport: lang === "LA" ? "ຕິດຕາມລາຍງານເບເກີລີ້ມີບັນຫາ" : "Issue Tracking",
    monthlyPlan: lang === "LA" ? "ແຜນຈັດຊຶ້ປະຈຳເດືອນ" : "Monthly Purchase Plan",

    warehouse: lang === "LA" ? "ຈັດການພະແນກສາງ" : "Warehouse Dept",
    manageMaterial: lang === "LA" ? "ຈັດການວັດຖຸດິບ" : "Manage Materials",
    requisition: lang === "LA" ? "ຄີຍອດເບີກວັດຖຸດິບ" : "Material Request Entry",
    
    general: lang === "LA" ? "ຈັດການທົ່ວໄປ" : "General Management",
    staff: lang === "LA" ? "ພະນັກງານ" : "Staff Management",
    branch: lang === "LA" ? "ສາຂາ" : "Branch Management",
  };

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
        title: t.overview,
        url: "#",
        icon: Airplay,
        isActive: true,
        items: [
          { title: t.allReports, url: "/admin/dashboard" },
          { title: t.bakeryReport, url: "/admin/reportbakery" },
        ],
      },
      {
        title: t.procurement,
        url: "/admin/bakerymanage",
        icon: Croissant,
        items: [
          { title: t.bakery, url: "/admin/bakerymanage" },
          { title: t.trackSell, url: "/admin/tracksell" },
          { title: t.trackSend, url: "/admin/tracksend" },
          { title: t.trackExp, url: "/admin/trackexp" },
          { title: t.orderBakery, url: "/admin/orderbakery" },
          { title: t.manageOrders, url: "/admin/manageorderbakery" },
          { title: t.trackImage, url: "/admin/trackimagebranch" },
          { title: t.problemReport, url: "/admin/trackreport" },
          { title: t.monthlyPlan, url: "/admin/calendarorder" },
        ],
      },
      {
        title: t.warehouse,
        url: "/admin/material",
        icon: Warehouse,
        items: [
          { title: t.manageMaterial, url: "/admin/material" },
          { title: t.requisition, url: "/admin/materialrequisition" },
          { title: t.materialReport, url: "/admin/reportstockrequisition" },
        ],
      },
      {
        title: t.general,
        url: "#",
        icon: Settings2,
        items: [
          { title: t.staff, url: "/admin/staffmanage" },
          { title: t.branch, url: "/admin/branchsmanage" },
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
