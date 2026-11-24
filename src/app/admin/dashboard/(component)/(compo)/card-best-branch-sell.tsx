"use client";
import {
  IconBuildingStore,
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
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TopSellingBranchItem } from "../BranchDetailModal";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface DataProp {
  t: any;
  isLoading: boolean;
  bestBranch: TopSellingBranchItem[];
  setSelectedBranch: any;
  setIsBranchDetailOpen: any;
  start_date: string
  end_date: string
}

const CardBesetBranchSell = ({
  t,
  isLoading,
  bestBranch,
  setSelectedBranch,
  setIsBranchDetailOpen,
  start_date,
  end_date
}: DataProp) => {
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);
  const handleCardClickCapture = () => {
    if (!isScrollUnlocked) {
      setIsScrollUnlocked(true);
    }
  };
  const maxBranchRevenue = Math.max(
    1,
    ...bestBranch.map((b) => b.total_sell_branch),
  );
  const handleSelectBranch = (branch: TopSellingBranchItem) => {
    setSelectedBranch(branch);
    setIsBranchDetailOpen(true);
  };
  const rankBadgeStyle = (idx: number) => {
    if (idx === 0) {
      return "bg-green-500/15 text-green-700 dark:text-green-400 border border-green-500/30 font-bold";
    }
    if (idx === 1) {
      return "bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-400/30 font-semibold";
    }
    if (idx === 2) {
      return "bg-orange-500/15 text-orange-700 dark:text-orange-400 border border-orange-500/30 font-semibold";
    }
    return "bg-muted text-muted-foreground font-medium";
  };
  return (
    <Card
      onClickCapture={handleCardClickCapture}
      onMouseLeave={() => setIsScrollUnlocked(false)}
      className="font-lao flex flex-col overflow-hidden border-border/70 shadow-xs"
    >
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background text-primary shadow-2xs">
              <IconBuildingStore className="size-5" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                {t.top5BranchTitle}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {t.top5BranchDesc}
              </CardDescription>
            </div>
          </div>
          {(start_date || end_date) && (
            <div className="inline-flex items-center gap-1.5 rounded-full border bg-background px-2.5 py-1 text-[11px] text-muted-foreground shadow-2xs shrink-0">
              <Calendar className="size-3.5 text-muted-foreground/80" />
              <span className="font-medium text-foreground tabular-nums">
                {start_date}
                {start_date && end_date ? ` – ${end_date}` : ""}
              </span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-11 w-full rounded-md" />
            ))}
          </div>
        ) : (
          <div
            className={`relative flex-1 transition-all duration-300 ${
              isScrollUnlocked
                ? "max-h-[410px] overflow-y-auto"
                : "max-h-[350px] overflow-y-hidden"
            }`}
          >
            <Table className="table-fixed w-full">
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-12 pl-4 text-xs">#</TableHead>
                  <TableHead className="text-xs">{t.branchName}</TableHead>
                  <TableHead className="text-xs">{t.bestItemShort}</TableHead>
                  <TableHead className="text-right pr-4 text-xs">
                    {t.totalSales}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bestBranch.map((branch, idx) => {
                  const sharePct = Math.round(
                    (branch.total_sell_branch / maxBranchRevenue) * 100,
                  );
                  return (
                    <TableRow
                      key={branch.branch_id}
                      onClick={() => handleSelectBranch(branch)}
                      className="group cursor-pointer transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="pl-4 py-2.5 align-middle">
                        <span
                          className={`inline-flex size-6 items-center justify-center rounded-md text-xs tabular-nums ${rankBadgeStyle(
                            idx,
                          )}`}
                        >
                          {idx + 1}
                        </span>
                      </TableCell>

                      <TableCell className="py-2.5 align-middle">
                        <div className="flex items-center gap-1.5 font-medium text-sm group-hover:text-primary transition-colors">
                          {idx === 0 && (
                            <IconCrown className="size-3.5 text-amber-500 shrink-0" />
                          )}
                          <span className="line-clamp-1">
                            {branch.branch_name}
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="py-2.5 align-middle">
                        <div className="text-xs font-medium text-foreground line-clamp-1">
                          {branch.bakery_name}
                        </div>
                        <div className="text-[11px] text-muted-foreground tabular-nums mt-0.5">
                          {branch.total_sell_bakery.toLocaleString()}{" "}
                          {t.currency}
                        </div>
                      </TableCell>

                      <TableCell className="pr-4 py-2.5 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-semibold text-sm tabular-nums">
                            {branch.total_sell_branch.toLocaleString()}{" "}
                            {t.currency}
                          </span>
                          <IconChevronRight className="size-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                        </div>
                        <div className="mt-1 ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary/75 transition-all duration-300"
                            style={{ width: `${sharePct}%` }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      <CardFooter
        className={`p-0 transition-all duration-300 overflow-hidden ${
          isScrollUnlocked
            ? "opacity-0 max-h-0 pointer-events-none"
            : "opacity-100 max-h-14 py-2 px-4"
        }`}
      >
        {" "}
        {
          <button
            type="button"
            disabled={isScrollUnlocked}
            onClick={() => setIsScrollUnlocked(true)}
            className={`${
              isScrollUnlocked ? "invisible" : ""
            } w-full py-2 text-center text-xs text-muted-foreground bg-gradient-to-t from-background via-background/90 to-transparent hover:text-foreground transition-colors`}
          >
            Click card to enable table scrolling
          </button>
        }
      </CardFooter>
    </Card>
  );
};

export default CardBesetBranchSell;
