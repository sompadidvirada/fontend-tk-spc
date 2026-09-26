"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import DateRanges from "@/components/DateRanges";
import { DateRange } from "react-day-picker";
import { getSaleDataBarChart } from "@/app/api/client/dashboard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplyer } from "../../bakerymanage/(component)/TableBakery";

export const description = "An interactive bar chart";

interface DataProp {
  supllyer: Supplyer[];
}

const chartConfig = {
  total_sale: {
    label: "Total Sale",
    color: "#D4AF37",
  },
} satisfies ChartConfig;

export function BarChartSale({ supllyer }: DataProp) {
  const [dataBar, setDataBar] = React.useState<
    { date: string; total_sale: number }[]
  >([]);
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [supplyerId, setSupplyerId] = React.useState("");

  const start = range?.from?.toLocaleDateString("en-Ca");
  const end = range?.to?.toLocaleDateString("en-Ca");

  React.useEffect(() => {
    const getDataSaleBarChart = async () => {
      if (!start || !end || (!range && !supplyerId)) return;
      try {
        const ress = await getSaleDataBarChart({
          start: start,
          end: end,
          supid: supplyerId,
        });
        setDataBar(ress.data);
      } catch (err) {
        console.log(err);
      }
    };

    getDataSaleBarChart();
  }, [range, supplyerId]);

  return (
    <Card className="@container/card">
      <CardHeader className="font-lao">
        <CardTitle>ກາຟຍອດຂາຍລວມເບເກີລີ້</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            ສຳລັບລາຍງານຍອດຂາຍລວມທັງໝົດຂອງທຸກສາຂາຂອງບໍລິສັດທີເລືອກ
          </span>
        </CardDescription>
        <CardAction className="flex gap-2">
          <Select onValueChange={setSupplyerId} value={supplyerId}>
            <SelectTrigger className="border-slate-200 w-full bg-secondary">
              <SelectValue placeholder="ເລືອກບໍລິສັດ/ຮ້ານ" />
            </SelectTrigger>
            <SelectContent className="font-lao">
              {supllyer &&
                supllyer?.map((item, i) => (
                  <SelectItem key={i} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DateRanges range={range} setRange={setRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={dataBar}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="total_sale"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />

            <Bar dataKey="total_sale" fill="var(--color-total_sale)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
