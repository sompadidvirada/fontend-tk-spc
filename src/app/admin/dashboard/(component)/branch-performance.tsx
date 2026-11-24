"use client";

import { DateRange } from "react-day-picker";
import React, { useState } from "react";
import {
  getBestBakeryAPI,
  getBestBranchPerformAPI,
  getBestBranchSellAPI,
  getBranchLowPerformAPI,
} from "@/app/api/client/dashboard";
import { useUIStore } from "@/store/ui";
import {
  BakeryBranchMetric,
  BakeryDetailModal,
} from "@/app/admin/dashboard/(component)/BakeryDetailModal";
import {
  BranchDetailModal,
  TopSellingBranchItem,
} from "@/app/admin/dashboard/(component)/BranchDetailModal";
import DateRanges from "@/components/DateRanges";
import CardBestBakerySell from "./(compo)/card-best-bakery-sell";
import CardBesetBranchSell from "./(compo)/card-best-branch-sell";
import CardBestBranchPerform from "./(compo)/card-best-branch-perform";
import CardBranchLowPerform from "./(compo)/card-branch-low-perform";

export interface TopBakeryItem {
  bakery_id: string;
  bakery_name: string;
  image?: string | null;
  total_sell: number;
  best_branch_name: string;
  best_branch_sell: number;
  branches?: BakeryBranchMetric[];
}

export interface BestPerformingBranchItem {
  branch_id: string;
  branch_name: string;
  current_sell_total: number;
  previous_sell_total: number;
  growth_percentage: number;
}

export interface WorstPerformingBranchItem {
  branch_id: string;
  branch_name: string;
  total_exp_revenue: number;
  total_send_revenue: number;
  percentage: number;
}

export interface DashboardReportData {
  topBakeries: TopBakeryItem[]; // Top 5
  topSellingBranches: TopSellingBranchItem[]; // Top 5 by sales revenue
  bestPerformingBranches: BestPerformingBranchItem[]; // Top 5 by growth vs. previous period
  worstPerformingBranches: WorstPerformingBranchItem[]; // Top 5 by expiry vs. sales
}

const BranchPerformance = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const startdate = new Date(yesterday);
  startdate.setDate(startdate.getDate() - 29);
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: startdate,
    to: yesterday,
  });
  const [bestBakerys, setBestBakerys] = React.useState<TopBakeryItem[]>([]);
  const [bestBranch, setBestBranch] = useState<TopSellingBranchItem[]>([]);
  const [bestBranchPerform, setBestBranchPerform] = useState<
    BestPerformingBranchItem[]
  >([]);
  const [branchLowPerform, setBranchLowPerform] = useState<WorstPerformingBranchItem[]>([])
  const [isLoading, setIsLoading] = React.useState(false);
  const lang = useUIStore((s) => s.language);

  const reportData: DashboardReportData = {
    topBakeries: bestBakerys ?? [],
    topSellingBranches: bestBranch,
    bestPerformingBranches: [],

    // 4. Top 5 Worst Performing Branches (High Expiry vs. Total Sales)
    worstPerformingBranches: [],
  };

  const [selectedBakery, setSelectedBakery] = useState<TopBakeryItem | null>(
    null,
  );
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] =
    useState<TopSellingBranchItem | null>(null);
  const [isBranchDetailOpen, setIsBranchDetailOpen] = useState(false);

  // 1. Translation Object
  const t = {
    // Existing KPI cards
    sendTitle:
      lang === "LA" ? "ມູນຄ່າຍອດຈັດສົ່ງທຸກສາຂາ" : "Total Delivery Value",
    viewMore: lang === "LA" ? "ເບິ່ງເພີ່ມເຕີມ" : "View more",
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
    expiredCol: lang === "LA" ? "ໝົດອາຍຸ / ສົ່ງ" : "Expired / Sales",
    wasteRate: lang === "LA" ? "ອັດຕາສູນເສຍ" : "Waste %",
  };

  React.useEffect(() => {
    if (!range?.from || !range?.to) return;
    const startDate = range?.from?.toLocaleDateString("en-Ca");
    const endDate = range?.to?.toLocaleDateString("en-Ca");
    const fecthCardBakery = async () => {
      setIsLoading(true);
      try {
        const [getBestBake, getBestBranch, getBestPerform, getBranchLow] = await Promise.all([
          getBestBakeryAPI({ start: startDate, end: endDate }),
          getBestBranchSellAPI({ start: startDate, end: endDate }),
          getBestBranchPerformAPI({ start: startDate, end: endDate }),
          getBranchLowPerformAPI({start: startDate, end: endDate})
        ]);

        setBestBakerys(getBestBake.data);
        setBestBranch(getBestBranch.data);
        setBestBranchPerform(getBestPerform.data);
        setBranchLowPerform(getBranchLow.data)
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fecthCardBakery();
  }, [range]);


  console.log(branchLowPerform)
  const worstBranches = reportData?.worstPerformingBranches ?? [];

  return (
    <div className="flex flex-col gap-2 mt-5">
      <div className="self-end px-6">
        <DateRanges range={range} setRange={setRange} />
      </div>
      {/* NEW 4 ANALYTICAL REPORT CARDS (Single 2x2 Grid) */}
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @3xl/main:grid-cols-2">
        {/* REPORT 1: Top 5 Best-Selling Bakeries */}

        <CardBestBakerySell
          setSelectedBakery={setSelectedBakery}
          setIsDetailOpen={setIsDetailOpen}
          isLoading={isLoading}
          t={t}
          start_date={(range?.from ?? new Date()).toLocaleDateString("en-Ca")}
          end_date={(range?.to ?? new Date()).toLocaleDateString("en-Ca")}
          bestBakerys={bestBakerys}
        />
        {/* REPORT 2: Top 5 Selling Branches (by Total Price) */}

        <CardBesetBranchSell
          t={t}
          isLoading={isLoading}
          bestBranch={bestBranch}
          start_date={(range?.from ?? new Date()).toLocaleDateString("en-Ca")}
          end_date={(range?.to ?? new Date()).toLocaleDateString("en-Ca")}
          setSelectedBranch={setSelectedBranch}
          setIsBranchDetailOpen={setIsBranchDetailOpen}
        />
        {/* REPORT 3: Top 5 Best Performing Branches (vs. Previous Period) */}
        <CardBestBranchPerform
          t={t}
          isLoading={isLoading}
          bestBranchesPerform={bestBranchPerform}
          start_date={(range?.from ?? new Date()).toLocaleDateString("en-Ca")}
          end_date={(range?.to ?? new Date()).toLocaleDateString("en-Ca")}
        />

        {/* REPORT 4: Top 5 Worst Performing Branches (Expiry vs. Total Sales) */}

        <CardBranchLowPerform
          t={t}
          isLoading={isLoading}
          worstBranches={branchLowPerform}
        />
      </div>

      <BakeryDetailModal
        bakery={selectedBakery}
        open={isDetailOpen}
        start_date={(range?.from ?? new Date()).toLocaleDateString("en-Ca")}
        end_date={(range?.to ?? new Date()).toLocaleDateString("en-Ca")}
        onOpenChange={setIsDetailOpen}
        currency={t.currency}
        lang={lang}
      />
      <BranchDetailModal
        branch={selectedBranch}
        open={isBranchDetailOpen}
        onOpenChange={setIsBranchDetailOpen}
        currency={t.currency}
        lang={lang}
        start_date={(range?.from ?? new Date()).toLocaleDateString("en-Ca")}
        end_date={(range?.to ?? new Date()).toLocaleDateString("en-Ca")}
      />
    </div>
  );
};

export default BranchPerformance;
