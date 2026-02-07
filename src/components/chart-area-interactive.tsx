"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
import DateRanges from "./DateRanges";
import { DateRange } from "react-day-picker";
import { getBakerySellReport } from "@/app/api/client/dashboard";
import { Branch_type } from "@/app/admin/tracksell/(component)/ParentTable";
import { useUIStore } from "@/store/ui";
export const description = "An interactive area chart";

type DashboardChartData = {
  date: string;
  [branchName: string]: string | number;
};

export function ChartAreaInteractive({ branchs }: { branchs: Branch_type[] }) {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [dataLineChart, setDataLineChart] = React.useState<
    DashboardChartData[]
  >([]);

  const dynamicConfig = React.useMemo(() => {
    const config: ChartConfig = {
      date: { label: "Date" },
    };

    branchs?.forEach((branch, index) => {
      config[branch.name] = {
        label: branch.name,
        // Cycles through shadcn's chart colors (var(--chart-1), etc)
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [branchs]);

  React.useEffect(() => {
    const fecthBakerySell = async () => {
      const start = range?.from?.toLocaleDateString("en-Ca");
      const end = range?.to?.toLocaleDateString("en-Ca");
      try {
        const ress = await getBakerySellReport({
          startDate: start,
          endDate: end,
        });
        const dataFromResponse = ress.data;
        setDataLineChart(dataFromResponse);
      } catch (err) {
        console.log(err);
      }
    };
    if (range?.from && range?.to) {
      fecthBakerySell();
    }
  }, [range]);

  const lang = useUIStore((s) => s.language);

  const t = {
    title:
      lang === "LA" ? "ຍອດຂາຍເບເກີລີ້ຂອງທຸກສາຂາ" : "Bakery Sales by Branch",
    description:
      lang === "LA"
        ? "ຄິດໄລ່ຈຳນວນຈາກມູນຄ່າຂອງລາຄາຂາຍເບເກີລີ້."
        : "Calculated based on the total sales value of bakery items.",
    last3Months: lang === "LA" ? "3 ເດືອນຜ່ານມາ" : "Last 3 months",
    locale: lang === "LA" ? "lo-LA" : "en-US",
  };

  return (
    <Card className="@container/card">
      <CardHeader className="font-lao">
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{t.description}</span>
          <span className="@[540px]/card:hidden">{t.last3Months}</span>
        </CardDescription>
        <CardAction>
          <DateRanges range={range} setRange={setRange} />
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={dynamicConfig}
          className="aspect-auto h-[250px] w-full font-lao"
        >
          <AreaChart data={dataLineChart}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              wrapperStyle={{ zIndex: 9999 }}
              content={(props) => {
                const { active, payload } = props;
                if (active && payload && payload.length) {
                  // 1. Manually Sort Descending by the 'value' property
                  // We also filter out any branches with 0 sales to keep it clean
                  const sortedItems = [...payload].sort(
                    (a, b) => (b.value as number) - (a.value as number),
                  );

                  return (
                    <div className="pointer-events-auto z-[9999] rounded-lg border bg-background p-3 shadow-xl font-lao min-w-[220px]">
                      <div className="mb-2 border-b pb-1 text-[12px] font-bold text-muted-foreground">
                        {new Date(payload[0].payload.date).toLocaleDateString(
                          "lo-LA",
                          {
                            weekday: "short", // This adds "Mon", "Tue", etc.
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </div>

                      <div
                        className="space-y-1.5 h-[300px] overflow-y-auto pr-1"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        {sortedItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between gap-4"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-[12px] text-slate-600">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-[12px] font-mono font-bold text-slate-900">
                              {Number(item.value).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {branchs.map((branch, index) => (
              <Area
                key={branch.id}
                dataKey={branch.name} // This must match the key in your JSON objects
                type="monotone"
                stroke={dynamicConfig[branch.name].color}
                fill={dynamicConfig[branch.name].color}
                fillOpacity={0.4}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
