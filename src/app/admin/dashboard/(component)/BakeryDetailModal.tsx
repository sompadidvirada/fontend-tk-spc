"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { getDetailBestBakeryAPI } from "@/app/api/client/dashboard";
import { IconBread } from "@tabler/icons-react";
import { Calendar } from "lucide-react";

// In BakeryDetailModal.tsx
export interface BakeryBranchMetric {
  branch_id: string;
  branch_name: string;
  total_sell: number;
  total_send: number;
  total_exp: number;
  sell_pieces: number;
  send_pieces: number;
  exp_pieces: number;
}

export interface TopBakeryItem {
  bakery_id: string;
  bakery_name: string;
  image?: string | null;
  total_sell: number;
  best_branch_name: string;
  best_branch_sell: number;
  branches?: BakeryBranchMetric[];
}

interface BakeryDetailModalProps {
  bakery: TopBakeryItem | null;
  open: boolean;

  start_date?: string;
  end_date?: string;
  onOpenChange: (open: boolean) => void;
  currency: string;
  lang?: string;
}

interface CustomTooltipPayloadItem {
  payload: BakeryBranchMetric;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  currency: string;
  lang: string;
}

function BranchSalesTooltip({
  active,
  payload,
  currency,
  lang,
}: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const row = payload[0].payload;

  return (
    <div className="font-lao rounded-lg border bg-background p-3 text-xs shadow-md min-w-[200px]">
      <div className="font-semibold text-sm mb-2 pb-1.5 border-b">
        {row.branch_name}
      </div>
      <div className="space-y-1.5">
        {/* Number 1 in tooltip: Total Price Sold */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[var(--color-sellRevenue)]" />
            {lang === "LA" ? "ລາຄາຂາຍລວມ" : "Total Price Sold"}:
          </span>
          <span className="font-bold tabular-nums text-foreground">
            {row.total_sell.toLocaleString()} {currency}
          </span>
        </div>

        {/* Number 2 in tooltip: Total Pieces Sold */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            {lang === "LA" ? "ຈຳນວນຊິ້ນທີ່ຂາຍ" : "Total Pieces Sold"}:
          </span>
          <span className="font-semibold tabular-nums text-primary">
            {row.sell_pieces.toLocaleString()} {lang === "LA" ? "ຊິ້ນ" : "pcs"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BakeryDetailModal({
  bakery,
  open,
  start_date,
  end_date,
  onOpenChange,
  currency,
  lang = "EN",
}: BakeryDetailModalProps) {
  const chartConfig = {
    sellRevenue: {
      label: lang === "LA" ? "ລາຄາຂາຍລວມ" : "Total Price Sold",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const isLa = lang === "LA";

  const [branches, setBranches] = useState<BakeryBranchMetric[]>([]);

  const getData = async () => {
    if (!bakery) return null;

    try {
      const ress = await getDetailBestBakeryAPI({
        start: start_date ?? "",
        end: end_date ?? "",
        bakery_id: Number(bakery.bakery_id),
      });
      setBranches(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [bakery]);

  const totalSellRevenue = branches.reduce((sum, b) => sum + b.total_sell, 0);
  const totalSendRevenue = branches.reduce((sum, b) => sum + b.total_send, 0);
  const totalExpRevenue = branches.reduce((sum, b) => sum + b.total_exp, 0);

  const totalSellPieces = branches.reduce((sum, b) => sum + b.sell_pieces, 0);
  const totalSendPieces = branches.reduce((sum, b) => sum + b.send_pieces, 0);
  const totalExpirePieces = branches.reduce((sum, b) => sum + b.exp_pieces, 0);
  if (!bakery) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-lao min-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className=" pt-6 pb-4 border-b shrink-0">
          <div className="flex items-start gap-3.5 pr-6">
            {/* Bakery Image Thumbnail with Fallback */}
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl border bg-muted flex items-center justify-center shadow-2xs">
              {bakery.image ? (
                <img
                  src={bakery.image}
                  alt={bakery.bakery_name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <IconBread className="size-6 text-muted-foreground" />
              )}
            </div>

            {/* Title, Top Branch Badge & Description */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <DialogTitle className="text-xl font-bold leading-tight truncate">
                  {bakery.bakery_name}
                </DialogTitle>
                <Badge variant="secondary" className="shrink-0">
                  {lang === "LA" ? "ສາຂາຂາຍດີສຸດ:" : "Top Branch:"}{" "}
                  {bakery.best_branch_name}
                </Badge>
              </div>

              <DialogDescription className="text-xs sm:text-sm">
                {lang === "LA"
                  ? "ລາຍລະອຽດຍອດຂາຍ, ການຈັດສົ່ງ ແລະ ຍອດໝົດອາຍຸແຍກຕາມສາຂາ"
                  : "Branch-level sales revenue, pieces sold, deliveries, and expirations"}
              </DialogDescription>
            </div>
          </div>
          {/* Date Range Indicator */}
          {start_date && (
            <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {isLa ? "ຊ່ວງວັນທີ:" : "Date Range:"}{" "}
                <span className="font-medium text-foreground">
                  {start_date} {end_date ? `– ${end_date}` : ""}
                </span>
              </span>
            </div>
          )}
        </DialogHeader>

        {/* Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Total Price Sold */}
          <div className="rounded-lg border border border-green-400/80 bg-green-500/30 p-3">
            <p className="text-xs text-green-700">
              {isLa ? "ລາຄາຂາຍລວມ" : "Total Price Sold"}
            </p>
            <p className="text-base font-bold tabular-nums mt-0.5 text-green-700">
              {totalSellRevenue.toLocaleString()} {currency}
            </p>
            <p className="text-xs text-green-700 tabular-nums mt-1">
              {totalSellPieces.toLocaleString()} {isLa ? "ຊິ້ນ" : "pcs"}
            </p>
          </div>

          {/* Total Send Revenue */}
          <div className="rounded-lg border border-blue-400/80 bg-blue-500/30 p-3">
            <p className="text-xs text-blue-700">
              {isLa ? "ມູນຄ່າຈັດສົ່ງລວມ" : "Total Send Revenue"}
            </p>
            <p className="text-base font-bold tabular-nums mt-0.5 text-blue-700">
              {totalSendRevenue.toLocaleString()} {currency}
            </p>
            <p className="text-xs tabular-nums mt-1 text-blue-700">
              {totalSendPieces.toLocaleString()} {isLa ? "ຊິ້ນ" : "pcs"}
            </p>
          </div>

          {/* Total Expired Revenue */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-xs text-muted-foreground">
              {isLa ? "ມູນຄ່າໝົດອາຍຸລວມ" : "Total Expired Revenue"}
            </p>
            <p className="text-base font-bold tabular-nums text-destructive mt-0.5">
              {totalExpRevenue.toLocaleString()} {currency}
            </p>
            <p className="text-xs text-destructive/80 tabular-nums mt-1">
              {totalExpirePieces.toLocaleString()} {isLa ? "ຊິ້ນ" : "pcs"}
            </p>
          </div>
        </div>

        {/* Bar Chart: Value = Total Price Sold (sellRevenue), Tooltip = Price + Pieces */}
        <div className="rounded-lg border p-4">
          <div className="mb-3">
            <h4 className="text-sm font-semibold">
              {lang === "LA"
                ? "ກຣາຟລາຄາຂາຍລວມແຍກຕາມສາຂາ"
                : "Total Price Sold by Branch"}
            </h4>
            <p className="text-xs text-muted-foreground">
              {lang === "LA"
                ? "ວາງເມົ້າເທິງແທ່ງກຣາຟເພື່ອເບິ່ງລາຄາຂາຍ ແລະ ຈຳນວນຊິ້ນທີ່ຂາຍໄດ້"
                : "Hover a bar to view total price sold and total pieces sold"}
            </p>
          </div>

          <ChartContainer config={chartConfig} className="h-[240px] w-full">
            <BarChart
              data={branches}
              margin={{ top: 10, right: 12, left: 12, bottom: 5 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="branch_name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={75}
                className="text-xs tabular-nums"
                tickFormatter={(value: number) =>
                  value >= 1_000_000
                    ? `${(value / 1_000_000).toFixed(1)}M`
                    : value >= 1_000
                      ? `${(value / 1_000).toFixed(0)}K`
                      : `${value}`
                }
              />
              <ChartTooltip
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
                content={<BranchSalesTooltip currency={currency} lang={lang} />}
              />
              <Bar
                dataKey="total_sell"
                fill="var(--color-green-400)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Full Branch Breakdown Table: Price Sold, Pieces Sold, Sent, Expired */}
        <div className="rounded-lg border overflow-x-auto">
          <Table className="min-w-[680px]">
            <TableHeader>
              <TableRow>
                <TableHead>{isLa ? "ສາຂາ" : "Branch"}</TableHead>
                <TableHead className="text-right">
                  {isLa ? "ຍອດຂາຍ" : "Total Sold"}
                </TableHead>
                <TableHead className="text-right">
                  {isLa ? "ຍອດຈັດສົ່ງ" : "Total Sent"}
                </TableHead>
                <TableHead className="text-right">
                  {isLa ? "ຍອດໝົດອາຍຸ" : "Total Expired"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.branch_id}>
                  <TableCell className="font-medium">
                    {branch.branch_name}
                  </TableCell>

                  {/* Sell Revenue + Sell Pieces */}
                  <TableCell className="text-right tabular-nums text-green-700">
                    <div className="font-semibold">
                      {branch.total_sell.toLocaleString()} {currency}
                    </div>
                    <div className="text-xs">
                      {branch.sell_pieces.toLocaleString()}{" "}
                      {isLa ? "ຊິ້ນ" : "pcs"}
                    </div>
                  </TableCell>

                  {/* Send Revenue + Send Pieces */}
                  <TableCell className="text-right tabular-nums text-blue-700">
                    <div className="font-semibold">
                      {branch.total_send.toLocaleString()} {currency}
                    </div>
                    <div className="text-xs">
                      {branch.send_pieces.toLocaleString()}{" "}
                      {isLa ? "ຊິ້ນ" : "pcs"}
                    </div>
                  </TableCell>

                  {/* Exp Revenue + Expire Pieces */}
                  <TableCell className="text-right tabular-nums">
                    <div className="font-semibold text-destructive">
                      {branch.total_exp.toLocaleString()} {currency}
                    </div>
                    <div className="text-xs text-destructive/80">
                      {branch.exp_pieces.toLocaleString()}{" "}
                      {isLa ? "ຊິ້ນ" : "pcs"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
