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
import {
  IconTrendingDown,
  IconTrendingUp,
  IconTrophy,
} from "@tabler/icons-react";
import { BestPerformingBranchItem } from "./branch-performance";



interface BestBranchesModalProps {
  branches: BestPerformingBranchItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  lang?: string;
}

export function BestBranchesModal({
  branches,
  open,
  onOpenChange,
  currency,
  lang = "EN",
}: BestBranchesModalProps) {

  const isLa = lang === "LA";
  const totalCurrent = branches.reduce(
    (sum, b) => sum + b.current_sell_total,
    0
  );

  const totalPrevious = branches.reduce(
    (sum, b) => sum + b.previous_sell_total,
    0
  );

  const netDifference = totalCurrent - totalPrevious;
  const overallGrowth =
    totalPrevious > 0
      ? ((totalCurrent - totalPrevious) / totalPrevious) * 100
      : 0;

  const isOverallPositive = overallGrowth >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-lao min-w-7xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <IconTrophy className="size-5 text-amber-500" />
              {isLa
                ? "ລາຍການສາຂາທີ່ມີຜົນການດຳເນີນງານດີທີ່ສຸດທັງໝົດ"
                : "All Best Performing Branches (vs. Previous Period)"}
            </DialogTitle>
            <Badge variant="secondary" className="tabular-nums">
              {branches.length} {isLa ? "ສາຂາ" : "Branches"}
            </Badge>
          </div>
          <DialogDescription>
            {isLa
              ? "ປຽບທຽບຍອດຂາຍໃນຊ່ວງເວລາປັດຈຸບັນ ທຽບກັບ ໄລຍະເວລາດຽວກັນກ່ອນໜ້ານີ້"
              : "Current period sales compared against the exact same timeframe prior to selection"}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ຍອດຂາຍຊ່ວງປັດຈຸບັນ" : "Current Period Sales"}
              </p>
              <p className="text-base font-bold tabular-nums mt-0.5">
                {totalCurrent.toLocaleString()} {currency}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ຍອດຂາຍຊ່ວງກ່ອນໜ້າ" : "Previous Period Sales"}
              </p>
              <p className="text-base font-bold tabular-nums mt-0.5">
                {totalPrevious.toLocaleString()} {currency}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ການເຕີບໂຕລວມ" : "Overall Growth"}
              </p>
              <p
                className={`text-base font-bold tabular-nums mt-0.5 ${
                  isOverallPositive ? "text-emerald-600" : "text-destructive"
                }`}
              >
                {isOverallPositive ? "+" : ""}
                {overallGrowth.toFixed(2)}%{" "}
                <span className="text-xs font-medium">
                  ({netDifference >= 0 ? "+" : ""}
                  {netDifference.toLocaleString()} {currency})
                </span>
              </p>
            </div>
          </div>

          {/* Full Branch Table */}
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-[580px]">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>{isLa ? "ສາຂາ" : "Branch"}</TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ຍອດຂາຍປັດຈຸບັນ" : "Current Sales"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ຍອດຂາຍກ່ອນໜ້າ" : "Previous Sales"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ສ່ວນຕ່າງ" : "Difference"}
                  </TableHead>
                  <TableHead className="text-right">
                    {isLa ? "ການເຕີບໂຕ" : "Growth"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((branch, idx) => {
                  const isPositive = branch.growth_percentage >= 0;
                  const diff = branch.current_sell_total - branch.previous_sell_total;
                  return (
                    <TableRow key={branch.branch_id}>
                      <TableCell className="text-muted-foreground font-medium tabular-nums">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {branch.branch_name}
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {branch.current_sell_total.toLocaleString()} {currency}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground tabular-nums">
                        {branch.previous_sell_total.toLocaleString()} {currency}
                      </TableCell>
                      <TableCell
                        className={`text-right font-medium tabular-nums ${
                          diff >= 0 ? "text-emerald-600" : "text-destructive"
                        }`}
                      >
                        {diff >= 0 ? "+" : ""}
                        {diff.toLocaleString()} {currency}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            isPositive
                              ? "gap-1 text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-950/30 tabular-nums"
                              : "gap-1 text-destructive border-destructive/30 tabular-nums"
                          }
                        >
                          {isPositive ? (
                            <IconTrendingUp className="size-3.5" />
                          ) : (
                            <IconTrendingDown className="size-3.5" />
                          )}
                          {isPositive ? "+" : ""}
                          {branch.growth_percentage.toFixed(2)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}