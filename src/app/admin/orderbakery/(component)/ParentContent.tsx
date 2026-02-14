"use client";
import React from "react";
import {
  getBakerysAvailable,
  getBakerySold,
} from "@/app/api/client/trackingbakery";
import CalendarCompo from "../../tracksell/(component)/Calendar";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import { Button } from "@/components/ui/button";
import { CheckCheck, Loader2, RotateCcw, Wand } from "lucide-react";
import TableBakeryOrder, { BakeryDetail } from "./TableBakeryOrder";
import { Card } from "@/components/ui/card";
import {
  getDataOrderBakery,
  getOrderBakery,
  insertManyOrderBakery,
} from "@/app/api/client/order_bakery";
import { toast } from "sonner";
import { checkConfirmStatus } from "@/app/api/client/baristar";
import ConfirmOrder from "./ConfirmOrder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplyer } from "../../bakerymanage/(component)/TableBakery";

export interface DataBranchProps {
  branchs: Branch_type[];
  supplyer: Supplyer[];
}

export type Branch_type = {
  id: string;
  name: string;
  phonenumber: string;
  province: string;
  available: boolean;
};

export type Data_Order_Bakery = {
  bakery_detailId: number;
  branchId: number;
  L1_Send: number;
  L1_Sell: number;
  L1_Exp: number;
  L2_Send: number;
  L2_Sell: number;
  L2_Exp: number;
  L3_Send: number;
  L3_Sell: number;
  L3_Exp: number;
};

export type Order_Bakery = {
  id: number;
  order_set: number;
  order_want: number;
  order_at: Date;
  bakery_detailId: number;
  branchId: number;
};

const ParentContent = ({ branchs, supplyer }: DataBranchProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [value, setValue] = React.useState("");
  const [supplyerId, setSupplyerId] = React.useState("");
  const [bakerys, setBakerys] = React.useState<BakeryDetail[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);
  const [checkOrderBakery, setCheckOrderBakery] = React.useState<
    Order_Bakery[]
  >([]);
  const [checkDataOrder, setCheckDataOrder] = React.useState<
    Data_Order_Bakery[]
  >([]);
  const [previousOrder, setPreviousOrder] = React.useState<Order_Bakery[]>([]);

  const result = React.useMemo(() => {
    const dayName = date?.toLocaleDateString("en-US", { weekday: "long" });

    return (
      checkDataOrder?.map((item) => {
        const bake = bakerys.find((b) => b.id === item.bakery_detailId);
        if (!bake) return null;

        const totalSell = item.L1_Sell + item.L2_Sell + item.L3_Sell;
        const totalSend = item.L1_Send + item.L2_Send + item.L3_Send;

        let orderRec = 0;
        let highlight = false;
        let valueadd = 0;

        const baseDivisor = dayName === "Saturday" ? 10 : 11;
        const baseMultiplier = dayName === "Saturday" ? 3 : 4;
        orderRec = (totalSell / baseDivisor) * baseMultiplier;
        orderRec = Math.round(orderRec);
        
        const isAStatus = bake?.status === "A";
        const isBStatus = bake?.status === "B";
        const isWednesday = dayName === "Wednesday";

        if (
          totalSell >= totalSend &&
          item.L1_Sell >= item.L1_Send &&
          item.L2_Sell >= item.L2_Send &&
          item.L1_Exp <= 0
        ) {
          if (isAStatus) valueadd = isWednesday ? 3 : 2;
          else if (isBStatus) valueadd = isWednesday ? 2 : 1;
          else valueadd = 1;

          orderRec += valueadd;
          highlight = true;
          const decimal = orderRec - Math.floor(orderRec);
          if (decimal >= 0.5) orderRec = Math.floor(orderRec);
        }

        return { ...item, orderRec, highlight, valueadd, name: bake?.name };
      }) || []
    ).filter((item): item is any => item !== null);
  }, [checkDataOrder, bakerys, date]);

  const handleAutoSaveAll = async () => {
    const ordersToSave = result.map((item) => ({
      bakery_detailId: item.bakery_detailId,
      order_at: date?.toLocaleDateString("en-CA"),
      branchId: Number(value),
      order_set: Math.max(1, Math.round(item.orderRec)),
    }));

    if (ordersToSave.length === 0) return;

    startTransition(async () => {
      try {
        await insertManyOrderBakery({ orders: ordersToSave });

        // OPTIONAL: Re-fetch or update checkOrderBakery state here to reflect changes
        const updatedOrder = await getOrderBakery({
          branchId: Number(value),
          order_at: date?.toLocaleDateString("en-CA"),
        });
        setCheckOrderBakery(updatedOrder.data.current);

        toast.success("ບັນທຶກອໍເດີແນະນຳທັງໝົດສຳເລັດ!");
      } catch (err) {
        toast.error("ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກ");
      }
    });
  };

  React.useEffect(() => {
    const fecthData = async () => {
      setLoading(true);
      try {
        const dateTo = date?.toLocaleDateString("en-CA");
        const [bakerysRes, DataOrderRes, orderBakery] = await Promise.all([
          getBakerysAvailable({
            branchId: Number(value),
            supplyerId: Number(supplyerId),
          }),
          getDataOrderBakery({
            branchId: Number(value),
            order_at: dateTo,
            supplyerId: Number(supplyerId),
          }),
          getOrderBakery({ branchId: Number(value), order_at: dateTo }),
        ]);

        setBakerys(bakerysRes.data.data);
        setCheckDataOrder(DataOrderRes.data);
        setCheckOrderBakery(orderBakery.data.current);
        setPreviousOrder(orderBakery.data.previous);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (date && value && supplyerId) {
      fecthData();
    }
  }, [date, value, supplyerId]);

  return (
    <>
      {" "}
      <div className="flex flex-col lg:flex-row mb-5 justify-between gap-4">
        {/* Buttons: Stacked on mobile, row on desktop */}
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10 font-lao">
          <CalendarCompo
            selectedDate={date}
            onDateChange={setDate}
            forOrder={true}
          />
          <SelectBranch
            branchs={branchs}
            value={value}
            setValue={setValue}
            isForReport={false}
          />
          {/* 2. Controlled Select component */}
          <Select onValueChange={setSupplyerId} value={supplyerId}>
            <SelectTrigger className="border-slate-200 w-full bg-secondary">
              <SelectValue placeholder="ເລືອກບໍລິສັດ/ຮ້ານ" />
            </SelectTrigger>
            <SelectContent className="font-lao">
              {supplyer &&
                supplyer?.map((item, i) => (
                  <SelectItem key={i} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <ConfirmOrder selectDate={date} value={value} />
          <>
            <Button variant="outline" className="font-lao">
              <RotateCcw className="mr-1 h-4 w-4" />
              ລົບອໍເດີທັງຫມົດ
            </Button>
          </>
          <>
            <Button
              variant="outline"
              className="font-lao"
              onClick={handleAutoSaveAll}
              disabled={isPending || !date || !value}
            >
              {isPending ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Wand className="mr-1 h-4 w-4" />
              )}
              ໃຊ້ຈຳນວນແນະນຳ
            </Button>
          </>
        </div>
      </div>
      <Card className="@container/card bg-gray-200 border-none shadow-none">
        {/** TABLE ORDER BAKERY */}
        <TableBakeryOrder
          data={bakerys}
          selectedDate={date}
          value={value}
          checkDataOrder={checkDataOrder}
          checkOrderBakery={checkOrderBakery}
          setCheckOrderBakery={setCheckOrderBakery}
          previousOrder={previousOrder}
          result={result}
          loading={loading}
        />
      </Card>
    </>
  );
};

export default ParentContent;
