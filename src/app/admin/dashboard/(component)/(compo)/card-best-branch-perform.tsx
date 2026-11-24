"use client";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconTrophy,
  IconChevronRight,
  IconChevronDown,
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
import { Button } from "@/components/ui/button";
import { BestPerformingBranchItem } from "../branch-performance";
import { useState } from "react";
import { Calendar } from "lucide-react";

interface Dataprp {
  t: any;
  isLoading: boolean;
  bestBranchesPerform: BestPerformingBranchItem[];
  start_date: string;
  end_date: string;
}

const CardBestBranchPerform = ({
  t,
  isLoading,
  bestBranchesPerform,
  start_date,
  end_date,
}: Dataprp) => {
  const [isScrollUnlocked, setIsScrollUnlocked] = useState(false);
  const handleCardClickCapture = () => {
    if (!isScrollUnlocked) {
      setIsScrollUnlocked(true);
    }
  };
  return (
    <Card
      onClickCapture={handleCardClickCapture}
      onMouseLeave={() => setIsScrollUnlocked(false)}
      className="font-lao flex flex-col overflow-hidden border-border/70 shadow-xs"
    >
      <CardHeader className="border-b bg-muted/20 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <IconTrophy className="size-4" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold tracking-tight">
                {t.best5PerfTitle}
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                {t.best5PerfDesc}
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
      <CardContent className="p-0 flex-1 flex flex-col">
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
                  <TableHead>{t.branchName}</TableHead>
                  <TableHead>{t.currentVsPrev}</TableHead>
                  <TableHead className="text-right">{t.growth}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-x-auto">
                {bestBranchesPerform.map((branch, idx) => {
                  const isPositive = branch.growth_percentage >= 0;
                  return (
                    <TableRow
                      key={branch.branch_id}
                      className="group transition-colors hover:bg-muted/50 cursor-pointer"
                    >
                      <TableCell className="text-muted-foreground font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="font-medium">
                        {branch.branch_name}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs font-semibold tabular-nums">
                          {branch.current_sell_total.toLocaleString()}{" "}
                          {t.currency}
                        </div>
                        <div className="text-xs text-muted-foreground tabular-nums">
                          vs. {branch.previous_sell_total.toLocaleString()}{" "}
                          {t.currency}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
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
                            {branch.growth_percentage?.toFixed(2)}%
                          </Badge>
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
        <button
          type="button"
          disabled={isScrollUnlocked}
          onClick={() => setIsScrollUnlocked(true)}
          className="w-full py-1.5 text-center text-xs text-muted-foreground bg-gradient-to-t from-background via-background/90 to-transparent hover:text-foreground transition-colors"
        >
          Click card to enable table scrolling
        </button>
      </CardFooter>
    </Card>
  );
};

export default CardBestBranchPerform;
