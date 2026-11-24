"use client";
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
import { getBestBakeryInBranchAPI } from "@/app/api/client/dashboard";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

export interface BranchBakeryMetric {
  bakery_id: string;
  bakery_name: string;
  sell_revenue: number;
  send_revenue: number;
  exp_revenue: number;
  sell_pieces: number;
  send_pieces: number;
  exp_pieces: number;
}

export interface TopSellingBranchItem {
  branch_id: string;
  branch_name: string;
  total_sell_branch: number;
  total_send_branch: number;
  total_exp_branch: number;
  total_sell_pieces_branch: number;
  total_send_pieces_branch: number;
  total_exp_pieces_branch: number;
  bakery_name: string;
  total_sell_bakery: number;
  bakeries?: BranchBakeryMetric[];
}

interface BranchDetailModalProps {
  branch: TopSellingBranchItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currency: string;
  lang?: string;
  start_date?: string;
  end_date?: string;
}

interface BakeryTooltipPayloadItem {
  payload?: BranchBakeryMetric;
}

interface BakerySalesTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<BakeryTooltipPayloadItem>;
  currency: string;
  isLa: boolean;
}

function BakerySalesTooltip({
  active,
  payload,
  currency,
  isLa,
}: BakerySalesTooltipProps) {
  const row = payload?.[0]?.payload;
  if (!active || !row) {
    return null;
  }

  return (
    <div className="font-lao rounded-lg border bg-background p-3 text-xs shadow-md min-w-[210px]">
      <div className="font-semibold text-sm mb-2 pb-1.5 border-b">
        {row.bakery_name}
      </div>
      <div className="space-y-1.5">
        {/* Tooltip Value 1: Total Price Sold */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-xs bg-[var(--color-sell_revenue)]" />
            {isLa ? "ລາຄາຂາຍລວມ" : "Total Price Sold"}:
          </span>
          <span className="font-bold tabular-nums text-foreground">
            {row.sell_revenue.toLocaleString()} {currency}
          </span>
        </div>

        {/* Tooltip Value 2: Total Pieces Sold */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            {isLa ? "ຈຳນວນຊິ້ນທີ່ຂາຍ" : "Total Pieces Sold"}:
          </span>
          <span className="font-semibold tabular-nums text-primary">
            {row.sell_pieces.toLocaleString()} {isLa ? "ຊິ້ນ" : "pcs"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function BranchDetailModal({
  branch,
  open,
  onOpenChange,
  currency,
  lang = "EN",
  start_date,
  end_date,
}: BranchDetailModalProps) {
  const isLa = lang === "LA";
  const [detail, setDetail] = useState<BranchBakeryMetric[]>([]);

  const chartConfig = {
    sell_revenue: {
      label: isLa ? "ລາຄາຂາຍລວມ" : "Total Price Sold",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  const getData = async () => {
    if (!branch) return null;

    try {
      const ress = await getBestBakeryInBranchAPI({
        start: start_date ?? "",
        end: end_date ?? "",
        branch_id: Number(branch.branch_id),
      });
      console.log(ress.data);
      setDetail(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, [branch]);

  if (!branch) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="font-lao min-w-7xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        {/* Fixed Header */}
        <DialogHeader className="px-6 pt-6 pb-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2 pr-6">
            <DialogTitle className="text-xl font-bold">
              {branch.branch_name}
            </DialogTitle>
            <Badge variant="secondary">
              {isLa ? "ເບເກີລີ້ຂາຍດີສຸດ:" : "Top Bakery:"} {branch.bakery_name}
            </Badge>
          </div>

          <DialogDescription>
            {isLa
              ? "ລາຍລະອຽດຍອດຂາຍ, ການຈັດສົ່ງ ແລະ ຍອດໝົດອາຍຸຂອງເບເກີລີ້ແຕ່ລະລາຍການໃນສາຂານີ້"
              : "Bakery-level sales revenue, deliveries, and expirations for this branch"}
          </DialogDescription>

          {/* Date Range Indicator */}
          {(start_date) && (
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

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {/* Summary Cards Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ລາຄາຂາຍລວມ" : "Total Price Sold"}
              </p>
              <p className="text-base font-bold tabular-nums mt-0.5">
                {branch.total_sell_branch.toLocaleString()} {currency}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums mt-1">
                {branch.total_sell_pieces_branch.toLocaleString()}{" "}
                {isLa ? "ຊິ້ນ" : "pcs"}
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ມູນຄ່າຈັດສົ່ງລວມ" : "Total Send Revenue"}
              </p>
              <p className="text-base font-bold tabular-nums mt-0.5">
                {branch.total_send_branch.toLocaleString()} {currency}
              </p>
              <p className="text-xs text-muted-foreground tabular-nums mt-1">
                {branch.total_send_pieces_branch.toLocaleString()}{" "}
                {isLa ? "ຊິ້ນ" : "pcs"}
              </p>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
              <p className="text-xs text-muted-foreground">
                {isLa ? "ມູນຄ່າໝົດອາຍຸລວມ" : "Total Expired Revenue"}
              </p>
              <p className="text-base font-bold tabular-nums text-destructive mt-0.5">
                {branch.total_exp_branch.toLocaleString()} {currency}
              </p>
              <p className="text-xs text-destructive/80 tabular-nums mt-1">
                {branch.total_exp_pieces_branch.toLocaleString()}{" "}
                {isLa ? "ຊິ້ນ" : "pcs"}
              </p>
            </div>
          </div>

          {/* Bar Chart: Value = Total Price Sold (sell_revenue) per Bakery */}
          <div className="rounded-lg border p-4">
            <div className="mb-3">
              <h4 className="text-sm font-semibold">
                {isLa
                  ? "ກຣາຟລາຄາຂາຍລວມແຍກຕາມເບເກີລີ້"
                  : "Total Price Sold by Bakery"}
              </h4>
              <p className="text-xs text-muted-foreground">
                {isLa
                  ? "ວາງເມົ້າເທິງແທ່ງກຣາຟເພື່ອເບິ່ງລາຄາຂາຍ ແລະ ຈຳນວນຊິ້ນທີ່ຂາຍໄດ້"
                  : "Hover a bar to view total price sold and total pieces sold"}
              </p>
            </div>

            <ChartContainer config={chartConfig} className="h-[240px] w-full">
              <BarChart
                data={detail}
                margin={{ top: 10, right: 12, left: 12, bottom: 5 }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="bakery_name"
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
                  content={
                    <BakerySalesTooltip currency={currency} isLa={isLa} />
                  }
                />
                <Bar
                  dataKey="sell_revenue"
                  fill="var(--color-sell_revenue)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>

          {/* Bakery Breakdown Table for This Branch */}
          <div className="rounded-lg border overflow-x-auto">
            <Table className="min-w-[680px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{isLa ? "ເບເກີລີ້" : "Bakery"}</TableHead>
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
                {detail.map((item) => (
                  <TableRow key={item.bakery_id}>
                    <TableCell className="font-medium">
                      {item.bakery_name}
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      <div className="font-semibold">
                        {item.sell_revenue.toLocaleString()} {currency}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.sell_pieces.toLocaleString()}{" "}
                        {isLa ? "ຊິ້ນ" : "pcs"}
                      </div>
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      <div className="font-semibold">
                        {item.send_revenue.toLocaleString()} {currency}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.send_pieces.toLocaleString()}{" "}
                        {isLa ? "ຊິ້ນ" : "pcs"}
                      </div>
                    </TableCell>

                    <TableCell className="text-right tabular-nums">
                      <div className="font-semibold text-destructive">
                        {item.exp_revenue.toLocaleString()} {currency}
                      </div>
                      <div className="text-xs text-destructive/80">
                        {item.exp_pieces.toLocaleString()}{" "}
                        {isLa ? "ຊິ້ນ" : "pcs"}
                      </div>
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
