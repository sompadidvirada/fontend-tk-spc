"use client";
import { IconAlertTriangle, IconChevronDown } from "@tabler/icons-react";
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
import { useState } from "react";
import { WorstPerformingBranchItem } from "../branch-performance";

interface Dataprp {
  t: any;
  isLoading: boolean;
  worstBranches: WorstPerformingBranchItem[];
}

const CardBranchLowPerform = ({ t, isLoading, worstBranches }: Dataprp) => {
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
      {" "}
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <IconAlertTriangle className="size-5 text-destructive" />
          {t.bad5PerfTitle}
        </CardTitle>
        <CardDescription>{t.bad5PerfDesc}</CardDescription>
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
                  <TableHead className="w-8">#</TableHead>
                  <TableHead>{t.branchName}</TableHead>
                  <TableHead>{t.expiredCol}</TableHead>
                  <TableHead className="text-right">{t.wasteRate}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worstBranches.map((branch, idx) => (
                  <TableRow key={branch.branch_id} className="group cursor-pointer">
                    <TableCell className="text-muted-foreground font-medium">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {branch.branch_name}
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-semibold text-destructive tabular-nums">
                        {branch.total_exp_revenue.toLocaleString()} {t.currency}
                      </div>
                      <div className="text-xs text-muted-foreground tabular-nums">
                        / {branch.total_send_revenue.toLocaleString()} {t.currency}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive" className="tabular-nums">
                        {branch.percentage.toFixed(2)}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
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

export default CardBranchLowPerform;
