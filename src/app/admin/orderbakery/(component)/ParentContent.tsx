"use client";
import React from "react";
import { getBakerysAvailable } from "@/app/api/client/trackingbakery";
import CalendarCompo from "../../tracksell/(component)/Calendar";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import { Button } from "@/components/ui/button";
import { Loader2, Maximize2, RotateCcw, Wand } from "lucide-react";
import TableBakeryOrder, { BakeryDetail } from "./TableBakeryOrder";
import { Card } from "@/components/ui/card";
import {
  deleteAllOrderBakery,
  getDataOrderBakery,
  getImagesToOrderBakery,
  getOrderBakery,
  insertManyOrderBakery,
} from "@/app/api/client/order_bakery";
import { toast } from "sonner";
import ConfirmOrder from "./ConfirmOrder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplyer } from "../../bakerymanage/(component)/TableBakery";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

export interface BakeryImageItem {
  id: string;
  url: string;
}

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
const ImageGalleryItem = ({
  src,
  index,
  onSelect,
}: {
  src: string;
  index: number;
  onSelect: () => void;
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);

  return (
    <div
      onClick={onSelect}
      className="relative cursor-zoom-in shrink-0 w-28 h-28 rounded-lg overflow-hidden border border-slate-200 shadow-xs group bg-slate-100"
    >
      {/* Skeleton shown while individual image file is downloading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse" />
      )}

      <img
        src={src}
        alt="Bakery upload"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Hover Overlay */}
      {isLoaded && (
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
          <span className="text-[10px] text-white font-medium">
            #{index + 1}
          </span>
          <button
            type="button"
            className="p-1 bg-white/80 hover:bg-white text-slate-800 rounded transition-colors"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export const ParentContent = ({ branchs, supplyer }: DataBranchProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [value, setValue] = React.useState("");
  const [supplyerId, setSupplyerId] = React.useState("");
  const [bakerys, setBakerys] = React.useState<BakeryDetail[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [loading, setLoading] = React.useState(false);
  const [checkOrderBakery, setCheckOrderBakery] = React.useState<
    Order_Bakery[]
  >([]);
  const [imageTrack, setImageTrack] = React.useState<BakeryImageItem[]>([]);
  const [selectedViewImage, setSelectedViewImage] = React.useState<
    string | null
  >(null);
  const [isImageLoading, setIsImageLoading] = React.useState(true);
  const [checkDataOrder, setCheckDataOrder] = React.useState<
    Data_Order_Bakery[]
  >([]);
  const [previousOrder, setPreviousOrder] = React.useState<Order_Bakery[]>([]);
  const router = useRouter();

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
    const fetchData = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const dateTo = date?.toLocaleDateString("en-CA");
        const [bakerysRes, DataOrderRes, orderBakery, imageTrackres] =
          await Promise.all([
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
            getImagesToOrderBakery({ branch_id: Number(value), date: dateTo }),
          ]);

        setBakerys(bakerysRes.data);
        setCheckDataOrder(DataOrderRes.data);
        setCheckOrderBakery(orderBakery.data.current);
        setPreviousOrder(orderBakery.data.previous);
        setImageTrack(imageTrackres.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (date && value && supplyerId) {
      fetchData();
    }
  }, [date, value, supplyerId]);

  const handleDelteALL = async () => {
    try {
      await deleteAllOrderBakery({
        order_at: date?.toLocaleDateString("en-CA"),
        branchId: Number(value),
      });
      setCheckOrderBakery([]);
      setPreviousOrder([]);
      toast.success("delete all order success");
    } catch (err) {
      console.error(err);
      toast.error("try again later");
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row mb-5 justify-between gap-4">
        {/* Buttons: Stacked on mobile, row on desktop */}
        <div className="grid grid-cols-1 md:flex md:flex-row gap-3 h-6 md:h-10 font-lao">
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

          <ConfirmOrder
            selectDate={date}
            value={value}
            supplyerId={supplyerId}
          />
          <Button
            variant="outline"
            className="font-lao"
            onClick={handleDelteALL}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            ລົບອໍເດີທັງຫມົດ
          </Button>
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
        </div>
      </div>

      {/** Image bakery upload from barista */}
      <div className="w-full bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm my-4 font-lao">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-700">
            ຮູບພາບຈາກບາຣິສຕ້າ ({loading ? "..." : imageTrack.length})
          </span>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200">
          {/* 1. Global API Loading: Show Skeletons */}
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="shrink-0 w-28 h-28 rounded-lg border border-slate-200 bg-slate-200 animate-pulse"
              />
            ))
          ) : imageTrack.length > 0 ? (
            /* 2. Success State: Render Images with double-buffered loaders */
            imageTrack.map((src, index) => (
              <ImageGalleryItem
                key={index}
                src={src.url}
                index={index}
                onSelect={() => setSelectedViewImage(src.url)}
              />
            ))
          ) : (
            /* 3. Empty State */
            <p className="text-xs text-slate-400 py-2">ບໍ່ມີຮູບພາບ</p>
          )}
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

      {/** DIALOG MODAL FOR IMAGE */}
      <Dialog
        open={!!selectedViewImage}
        onOpenChange={() => {
          setSelectedViewImage(null);
          setIsImageLoading(true);
        }}
      >
        <DialogContent className="max-w-3xl border-none bg-transparent p-0 shadow-none flex items-center justify-center">
          <DialogHeader className="hidden">
            <DialogTitle>Staff Preview</DialogTitle>
          </DialogHeader>

          <div className="relative h-[80vh] w-full flex items-center justify-center">
            {isImageLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 rounded-lg">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground font-lao">
                  ກຳລັງໂຫລດຮູບ...
                </p>
              </div>
            )}

            {selectedViewImage && (
              <Image
                src={selectedViewImage}
                alt="Full size staff image"
                fill
                className={`object-contain transition-opacity duration-500 ${
                  isImageLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoadingComplete={() => setIsImageLoading(false)}
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ParentContent;
