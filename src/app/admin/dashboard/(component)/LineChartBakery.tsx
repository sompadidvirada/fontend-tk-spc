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
import { DateRange } from "react-day-picker";
import { getBakerysReportLine } from "@/app/api/client/dashboard";
import { Bakery_Detail } from "../../bakerymanage/(component)/TableBakery";
import DateRanges from "@/components/DateRanges";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui";
export const description = "An interactive area chart";

type DashboardChartData = {
  date: string;
  [branchName: string]: string | number;
};

const LineChartBakery = ({ bakerys }: { bakerys: Bakery_Detail[] }) => {
  const lang = useUIStore((s) => s.language);
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [dataLineChart, setDataLineChart] = React.useState<
    DashboardChartData[]
  >([]);

  // 1. State for selected bakery names (empty by default)
  const [selectedNames, setSelectedNames] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  // Toggle function for selection
  const toggleBakery = (name: string) => {
    setSelectedNames((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name],
    );
  };

  const dynamicConfig = React.useMemo(() => {
    const config: ChartConfig = {
      date: { label: "Date" },
    };

    bakerys?.forEach((bake, index) => {
      config[bake.name] = {
        label: bake.name,
        // Cycles through shadcn's chart colors (var(--chart-1), etc)
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });

    return config;
  }, [bakerys]);

  React.useEffect(() => {
    const fecthBakerySell = async () => {
      const start = range?.from?.toLocaleDateString("en-Ca");
      const end = range?.to?.toLocaleDateString("en-Ca");
      try {
        const ress = await getBakerysReportLine({
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

  const t = {
    title:
      lang === "LA"
        ? "ຍອດຂາຍເບເກີລີ້ຂອງທຸກສາຂາ"
        : "Bakery Sales Across All Branches",
    description:
      lang === "LA"
        ? "ຄິດໄລ່ຈຳນວນຈາກຈຳນວນຂອງເບເກີລີ້ທຸກສາຂາລວມກັນ."
        : "Calculated based on total bakery units across all branches.",
    last3Months: lang === "LA" ? "3 ເດືອນຜ່ານມາ" : "Last 3 months",
    selectBakery: lang === "LA" ? "ເລືອກເບເກີລີ້..." : "Select bakery...",
    selected: lang === "LA" ? "ເລືອກແລ້ວ" : "Selected",
    items: lang === "LA" ? "ຢ່າງ" : "items",
    search: lang === "LA" ? "ຄົ້ນຫາເບເກີລີ້..." : "Search bakery...",
    notFound: lang === "LA" ? "ບໍ່ພົບລາຍການ." : "No results found.",
    placeholder:
      lang === "LA"
        ? "ກະລຸນາເລືອກເບເກີລີ້ເພື່ອສະແດງຂໍ້ມູນ"
        : "Please select a bakery to display data",
    locale: lang === "LA" ? "lo-LA" : "en-US",
  };

  return (
    <Card className="@container/card">
      <CardHeader className="font-lao">
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">{t.description}</span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>

        <CardAction className="flex items-center gap-2">
          {" "}
          <div>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[250px] justify-between font-lao"
                >
                  {selectedNames.length > 0
                    ? `${t.selected} ${selectedNames.length} ${t.items}`
                    : t.selectBakery}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-0 font-lao">
                <Command>
                  <CommandInput placeholder={t.search} />
                  <CommandList>
                    <CommandEmpty>{t.notFound}</CommandEmpty>
                    <CommandGroup>
                      {bakerys.map((bake) => (
                        <CommandItem
                          key={bake.id}
                          value={bake.name}
                          onSelect={() => toggleBakery(bake.name)}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedNames.includes(bake.name)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {bake.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
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
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      weekday: "short", // This adds "Mon", "Tue", etc.
                      month: "short",
                      day: "numeric",
                      year: "numeric", // Optional: adds the year if you want it
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            {bakerys
              .filter((bake) => selectedNames.includes(bake.name))
              .map((bake) => (
                <Area
                  key={bake.id}
                  dataKey={bake.name}
                  type="monotone"
                  stroke={dynamicConfig[bake.name].color}
                  fill={dynamicConfig[bake.name].color}
                  fillOpacity={0.4}
                />
              ))}

            {/* Show a placeholder if nothing is selected */}
            {selectedNames.length === 0 && (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-muted-foreground text-sm font-lao"
              >
               {t.placeholder}
              </text>
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
export default LineChartBakery;
