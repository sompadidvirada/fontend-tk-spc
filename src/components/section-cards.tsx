"use client";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconTrophy,
  IconAlertTriangle,
  IconBuildingStore,
  IconBread,
  IconChevronRight,
  IconCrown,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateRanges from "./DateRanges";
import { DateRange } from "react-day-picker";
import React, { useState } from "react";
import { getCardBakeryReport } from "@/app/api/client/dashboard";
import { Skeleton } from "./ui/skeleton";
import { useUIStore } from "@/store/ui";
import { Progress } from "./ui/progress";
import {
  BakeryBranchMetric,
  BakeryDetailModal,
} from "@/app/admin/dashboard/(component)/BakeryDetailModal";
import {
  BranchDetailModal,
  TopSellingBranchItem,
} from "@/app/admin/dashboard/(component)/BranchDetailModal";
import BranchPerformance from "@/app/admin/dashboard/(component)/branch-performance";

interface BakeryTotals {
  sellTotal: number;
  sendTotal: number;
  expTotal: number;
  wastePercentage: number;
}

interface DashboardCardData {
  current: BakeryTotals;
  previous: BakeryTotals;
  changes: {
    sell: number;
    send: number;
    exp: number;
  };
}
export interface TopBakeryItem {
  id: string;
  name: string;
  totalRevenue: number;
  topBranch: string;
  branches?: BakeryBranchMetric[];
}

export interface BestPerformingBranchItem {
  id: string;
  branchName: string;
  currentSellTotal: number;
  previousSellTotal: number;
  growthPercentage: number;
}

export interface WorstPerformingBranchItem {
  id: string;
  branchName: string;
  expiredTotal: number;
  sellTotal: number;
  wastePercentage: number;
}

export interface DashboardReportData {
  topBakeries: TopBakeryItem[]; // Top 5
  topSellingBranches: TopSellingBranchItem[]; // Top 5 by sales revenue
  bestPerformingBranches: BestPerformingBranchItem[]; // Top 5 by growth vs. previous period
  worstPerformingBranches: WorstPerformingBranchItem[]; // Top 5 by expiry vs. sales
}

export function SectionCards() {

  const [range, setRange] = React.useState<DateRange | undefined>();
  const [dataCard, setDateCard] = React.useState<DashboardCardData>();
  const [isLoading, setIsLoading] = React.useState(false);
  const lang = useUIStore((s) => s.language);

  // 1. Translation Object
  const t = {
    // Existing KPI cards
    sendTitle:
      lang === "LA" ? "ມູນຄ່າຍອດຈັດສົ່ງທຸກສາຂາ" : "Total Delivery Value",
    sellTitle: lang === "LA" ? "ມູນຄ່າຍອດຂາຍທຸກສາຂາ" : "Total Sales Value",
    expTitle: lang === "LA" ? "ມູນຄ່າໝົດອາຍຸທຸກສາຂາ" : "Total Expired Value",
    wasteTitle: lang === "LA" ? "ເປີເຊັນຍອດສູນເສີຍ" : "Waste Percentage",
    currency: lang === "LA" ? "ກີບ" : "LAK",
    footerSend:
      lang === "LA"
        ? "ຍອດຈັດສົ່ງທັງໝົດພາຍໃນຊ່ວງເວລານີ້"
        : "Total delivery in this period",
    footerSell:
      lang === "LA"
        ? "ຍອດຂາຍເບເກີລີ້ທຸກສາຂາ"
        : "Bakery sales across all branches",
    footerExp:
      lang === "LA" ? "ລວມຍອດໝົດອາຍຸເບເກີລີ້" : "Total bakery expiration",
    footerWaste:
      lang === "LA"
        ? "ຍອດສູນເສຍຂອງເບເກີລີ້ທຸກສາຂາ"
        : "Waste across all branches",

    // Report 1: Top 5 Best-Selling Bakeries
    top5BakeryTitle:
      lang === "LA"
        ? "ຍອດຂາຍ 5 ເບເກີລີ້ທີ່ດີທີສຸດ"
        : "Top 5 Best-Selling Bakeries",
    top5BakeryDesc:
      lang === "LA"
        ? "ລວມຍອດຂາຍ ແລະ ສາຂາທີ່ຂາຍໄດ້ຫຼາຍສຸດ"
        : "Total sales revenue & top-selling branch",
    bakeryName: lang === "LA" ? "ເບເກີລີ້" : "Bakery",
    topBranch: lang === "LA" ? "ສາຂາຂາຍດີສຸດ" : "Top Branch",
    totalSales: lang === "LA" ? "ຍອດຂາຍລວມ" : "Total Sales",

    // Report 2: Top 5 Selling Branches (by Total Price)
    top5BranchTitle:
      lang === "LA"
        ? "5 ສາຂາທີ່ຂາຍເບເກີລີ້ໄດ້ຫຼາຍສຸດ"
        : "Top 5 Highest-Selling Branches",
    top5BranchDesc:
      lang === "LA"
        ? "ຍອດຂາຍລວມ ແລະ ເບເກີລີ້ທີ່ຂາຍດີສຸດຂອງສາຂາ"
        : "Total revenue & #1 bakery in each branch",
    branchName: lang === "LA" ? "ສາຂາ" : "Branch",
    bestItemShort: lang === "LA" ? "ເບເກີລີ້ຂາຍດີ" : "Top Bakery",

    // Report 3: Top 5 Best Performing Branches (vs. Previous Period)
    best5PerfTitle:
      lang === "LA"
        ? "5 ສາຂາທີ່ມີຜົນການດຳເນີນງານດີສຸດ"
        : "Top 5 Best Performing Branches",
    best5PerfDesc:
      lang === "LA"
        ? "ປຽບທຽບຍອດຂາຍກັບຊ່ວງເວລາກ່ອນໜ້າ"
        : "Sales growth vs. previous matching period",
    currentVsPrev: lang === "LA" ? "ປັດຈຸບັນ / ກ່ອນໜ້າ" : "Current / Prev",
    growth: lang === "LA" ? "ການເຕີບໂຕ" : "Growth",

    // Report 4: Top 5 Worst Performing Branches (Expiry vs. Total Sales)
    bad5PerfTitle:
      lang === "LA"
        ? "5 ສາຂາທີ່ມີຜົນການດຳເນີນງານຕ່ຳ"
        : "Top 5 Underperforming Branches",
    bad5PerfDesc:
      lang === "LA"
        ? "ຍອດໝົດອາຍຸ ທຽບກັບ ຍອດຂາຍຂອງສາຂາ"
        : "Expired value vs. total sales per branch",
    expiredCol: lang === "LA" ? "ໝົດອາຍຸ / ຂາຍ" : "Expired / Sales",
    wasteRate: lang === "LA" ? "ອັດຕາສູນເສຍ" : "Waste %",
  };

  React.useEffect(() => {
    if (!range?.from || !range?.to) return;
    const startDate = range?.from?.toLocaleDateString("en-Ca");
    const endDate = range?.to?.toLocaleDateString("en-Ca");
    const fecthCardBakery = async () => {
      setIsLoading(true);
      try {
        const ress = await getCardBakeryReport({ startDate, endDate });
        setDateCard(ress.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fecthCardBakery();
  }, [range]);

  return (
    <div className="flex flex-col gap-2">
      <div className="self-end px-6">
        <DateRanges range={range} setRange={setRange} />
      </div>

      {/* EXISTING TOP 4 KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {/* Card 1: Delivery */}

        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.sendTitle}</CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `${(dataCard?.current.sendTotal || 0).toLocaleString()} ${t.currency}`
              )}
            </CardTitle>

            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.send >= 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}

                {isLoading ? (
                  <Skeleton className="w-12 h-3" />
                ) : (
                  `${dataCard?.changes.send.toFixed(2) || 0} %`
                )}
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerSend} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 2: Sales */}

        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.sellTitle}</CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `${(dataCard?.current.sellTotal || 0).toLocaleString()} ${t.currency}`
              )}
            </CardTitle>

            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.sell >= 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}

                {isLoading ? (
                  <Skeleton className="w-12 h-3" />
                ) : (
                  `${dataCard?.changes.sell.toFixed(2) || 0} %`
                )}
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerSell} <IconTrendingDown className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 3: Expired */}

        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.expTitle}</CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `${(dataCard?.current.expTotal || 0).toLocaleString()} ${t.currency}`
              )}
            </CardTitle>

            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.exp >= 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}

                {isLoading ? (
                  <Skeleton className="w-12 h-3" />
                ) : (
                  `${dataCard?.changes.exp.toFixed(2) || 0} %`
                )}
              </Badge>
            </CardAction>
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerExp} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 4: Waste */}

        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.wasteTitle}</CardDescription>

            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? (
                <Skeleton className="h-8 w-32" />
              ) : (
                `${(dataCard?.current.wastePercentage || 0).toFixed(2)} %`
              )}
            </CardTitle>

            <CardAction />
          </CardHeader>

          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerWaste} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>
      </div>

      <BranchPerformance />
    </div>
  );
}
