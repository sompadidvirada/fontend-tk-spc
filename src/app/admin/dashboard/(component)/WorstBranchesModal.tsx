"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { IconAlertTriangle } from "@tabler/icons-react";

export interface WorstPerformingBranchItem {
  id: string;
  branchName: string;
  expiredTotal: number;
  sellTotal: number;
  wastePercentage: number;
}

interface WorstBranchesModalProps {
  branches: WorstPerformingBranchItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  lang?: string;
}

export function WorstBranchesModal({
  branches,
  open,
  onOpenChange,
  currency,
  lang = "EN",
}: WorstBranchesModalProps) {
  const isLa = lang === "LA";

  const totalExpired = branches.reduce((sum, b) => sum + b.expiredTotal, 0);
  const totalSales = branches.reduce((sum, b) => sum + b.sellTotal, 0);
  const overallWasteRate =
    totalSales + totalExpired > 0
      ? (totalExpired / (totalSales + totalExpired)) * 100
      : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-lao min-w-7xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <IconAlertTriangle className="size-5 text-destructive" />
              {isLa
                ? "ລາຍການສາຂາທີ່ມີຜົນການດຳເນີນງານຕ່ຳທັງໝົດ"
                : "All Underperforming Branches (Expiry vs. Sales)"}
            </DialogTitle>
            <Badge variant="destructive" className="tabular-nums">
              {branches.length} {isLa ? "ສາຂາ" : "Branches"}
            </Badge>
          </div>
          <DialogDescription>
            {isLa
              ? "ປຽບທຽບມູນຄ່າເບເກີລີ່ໝົດອາຍຸ ທຽບກັບ ຍອດຂາຍລວມຂອງທຸກສາຂາ"
              : "Expired bakery value compared against total sales across all branches"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ມູນຄ່າໝົດອາຍຸລວມ" : "Total Expired Value"}
              </p>
              <p className="text-base font-bold tabular-nums text-destructive mt-0.5">
                {totalExpired.toLocaleString()} {currency}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ຍອດຂາຍລວມ" : "Total Sales Value"}
              </p>
              <p className="text-base font-bold tabular-nums mt-0.5">
                {totalSales.toLocaleString()} {currency}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ອັດຕາສູນເສຍລວມ" : "Overall Waste Rate"}
              </p>
              <p className="text-base font-bold tabular-nums text-destructive mt-0.5">
                {overallWasteRate.toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Full Branch Table */}
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-[540px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{isLa ? "ສາຂາ" : "Branch"}</TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ຍອດໝົດອາຍຸ" : "Total Expired"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ຍອດຂາຍລວມ" : "Total Sales"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ອັດຕາສູນເສຍ" : "Waste %"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch, idx) => (
                  <TableRow key={branch.id}>
                    <TableCell className="text-muted-foreground font-medium tabular-nums">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {branch.branchName}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-destructive tabular-nums">
                      {branch.expiredTotal.toLocaleString()} {currency}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">
                      {branch.sellTotal.toLocaleString()} {currency}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive" className="tabular-nums">
                        {branch.wastePercentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}