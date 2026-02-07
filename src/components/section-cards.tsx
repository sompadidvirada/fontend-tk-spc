"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DateRanges from "./DateRanges";
import { DateRange } from "react-day-picker";
import React from "react";
import { getCardBakeryReport } from "@/app/api/client/dashboard";
import { Skeleton } from "./ui/skeleton";
import { useUIStore } from "@/store/ui";

interface BakeryTotals {
  sellTotal: number;
  sendTotal: number;
  expTotal: number;
  wastePercentage: number;
}

interface DashboardCardData {
  current: BakeryTotals;
  previous: BakeryTotals;
  changes: {
    sell: number;
    send: number;
    exp: number;
  };
}

export function SectionCards() {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [dataCard, setDateCard] = React.useState<DashboardCardData>();
  const [isLoading, setIsLoading] = React.useState(false);
  const lang = useUIStore((s) => s.language);

  // 1. Translation Object
  const t = {
    sendTitle: lang === "LA" ? "ມູນຄ່າຍອດຈັດສົ່ງທຸກສາຂາ" : "Total Delivery Value",
    sellTitle: lang === "LA" ? "ມູນຄ່າຍອດຂາຍທຸກສາຂາ" : "Total Sales Value",
    expTitle: lang === "LA" ? "ມູນຄ່າໝົດອາຍຸທຸກສາຂາ" : "Total Expired Value",
    wasteTitle: lang === "LA" ? "ເປີເຊັນຍອດສູນເສີຍ" : "Waste Percentage",
    currency: lang === "LA" ? "ກີບ" : "LAK",
    footerSend: lang === "LA" ? "ຍອດຈັດສົ່ງທັງໝົດພາຍໃນຊ່ວງເວລານີ້" : "Total delivery in this period",
    footerSell: lang === "LA" ? "ຍອດຂາຍເບເກີລີ້ທຸກສາຂາ" : "Bakery sales across all branches",
    footerExp: lang === "LA" ? "ລວມຍອດໝົດອາຍຸເບເກີລີ້" : "Total bakery expiration",
    footerWaste: lang === "LA" ? "ຍອດສູນເສຍຂອງເບເກີລີ້ທຸກສາຂາ" : "Waste across all branches",
  };

  React.useEffect(() => {
    if (!range?.from || !range?.to) return;
    const startDate = range?.from?.toLocaleDateString("en-Ca");
    const endDate = range?.to?.toLocaleDateString("en-Ca");
    const fecthCardBakery = async () => {
      setIsLoading(true);
      try {
        const ress = await getCardBakeryReport({ startDate, endDate });
        setDateCard(ress.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fecthCardBakery();
  }, [range]);

  return (
    <>
      <div className="self-end px-6">
        <DateRanges range={range} setRange={setRange} />
      </div>
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        
        {/* Card 1: Delivery */}
        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.sendTitle}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? <Skeleton className="h-8 w-32" /> : 
                `${(dataCard?.current.sendTotal || 0).toLocaleString()} ${t.currency}`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.send >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {isLoading ? <Skeleton className="w-12 h-3" /> : `${dataCard?.changes.send.toFixed(2) || 0} %`}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerSend} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 2: Sales */}
        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.sellTitle}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? <Skeleton className="h-8 w-32" /> : 
                `${(dataCard?.current.sellTotal || 0).toLocaleString()} ${t.currency}`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.sell >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {isLoading ? <Skeleton className="w-12 h-3" /> : `${dataCard?.changes.sell.toFixed(2) || 0} %`}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerSell} <IconTrendingDown className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 3: Expired */}
        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.expTitle}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? <Skeleton className="h-8 w-32" /> : 
                `${(dataCard?.current.expTotal || 0).toLocaleString()} ${t.currency}`}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                {dataCard && dataCard.changes.exp >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {isLoading ? <Skeleton className="w-12 h-3" /> : `${dataCard?.changes.exp || 0} %`}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerExp} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>

        {/* Card 4: Waste */}
        <Card className="@container/card font-lao">
          <CardHeader>
            <CardDescription>{t.wasteTitle}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-xl">
              {isLoading ? <Skeleton className="h-8 w-32" /> : 
                `${(dataCard?.current.wastePercentage || 0).toFixed(2)} %`}
            </CardTitle>
            <CardAction />
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {t.footerWaste} <IconTrendingUp className="size-4" />
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
