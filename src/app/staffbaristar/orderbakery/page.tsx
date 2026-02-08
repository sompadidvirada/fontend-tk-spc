"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  BadgeCheck,
  Calendar as CalendarIcon,
  Check,
  CircleCheckBig,
  Edit,
  Info,
  Package,
  Save,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { addDays, format, getDay } from "date-fns";
import { toast } from "sonner";
import Image from "next/image";
import { useSession } from "../SessionProvider";
import { getOrderBakery } from "@/app/api/client/order_bakery";
import {
  checkConfirmStatus,
  updateConfirmOrder,
  updateOrderWant,
} from "@/app/api/client/baristar";

interface BakeryDetail {
  name: string;
  image: string;
}

interface OrderItem {
  id: number;
  order_set: number;
  order_want: number;
  order_at: string;
  bakery_detailId: number;
  branchId: number;
  bakery_detail: BakeryDetail;
}

interface ConfirmOrder {
  id: number;
  baristar_confirm_stt: boolean;
  admin_confirm_stt: boolean;
  branchId: number;
}

const OrderBakery = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const staff_detail = useSession();
  const [confirmOrder, setConfirmOrder] = useState<ConfirmOrder>();
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const dateString = date ? format(date, "yyyy-MM-dd") : "";
  const dateToSend = (() => {
    if (!date) return "";

    // getDay() returns 3 for Wednesday
    const isWednesday = getDay(date) === 3;

    // Jump 3 days if Wednesday, otherwise 4 days
    const jumpingDays = isWednesday ? 3 : 4;

    const targetDate = addDays(date, jumpingDays);

    return format(targetDate, "yyyy-MM-dd");
  })();

  useEffect(() => {
    const fecthOrderBakery = async () => {
      startTransition(async () => {
        try {
          const [orderBakery, confirmStt] = await Promise.all([
            getOrderBakery({
              branchId: Number(staff_detail.branchId),
              order_at: dateString,
            }),
            checkConfirmStatus({
              confirm_date: dateString,
              branchId: Number(staff_detail.branchId),
            }),
          ]);
          setOrders(orderBakery.data.current);
          setConfirmOrder(confirmStt.data);
        } catch (err) {
          console.log(err);
          toast.error("ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້");
        }
      });
    };
    if (date && staff_detail.branchId) {
      fecthOrderBakery();
    }
  }, [date]);

  const handleConfirmOrder = async () => {
    setIsConfirming(true);
    try {
      const ress = await updateConfirmOrder({
        branchId: Number(staff_detail.branchId),
        confirm_date: dateString,
        barista_confirm_stt: true,
      });
      setConfirmOrder(ress.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsConfirming(false);
    }
  };

  const handleUpdateSingleOrder = async (id: number) => {
    const inputElement = document.getElementsByName(
      `order_want_${id}`,
    )[0] as HTMLInputElement;

    const newValue = Number(inputElement?.value);
    if (isNaN(newValue)) return;

    setUpdatingId(id);
    try {
      const ress = await updateOrderWant({ order_want: newValue }, Number(id));
      const updatedOrder = ress.data;

      setOrders((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, ...updatedOrder };
          }
          return item;
        }),
      );
      toast.success("ອັບເດດລາຍການນີ້ສຳເລັດ!");
    } catch (err) {
      toast.error("ເກີດຂໍ້ຜິດພາດ");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleResetOrder = (id: number) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, order_want: 0 } : o)),
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pb-32 font-lao">
      {/* 1. TOP SECTION: Header & Date Picker */}
      <div className="bg-[#402f22] px-6 pt-12 pb-6 border-b rounded-b-[30px] shadow-sm top-0 z-10">
        <h1 className="text-xl font-black text-gray-100 mb-4">
          ຈັດການອໍເບເກີລີ້
        </h1>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full h-12 justify-start text-left font-normal rounded-2xl border-slate-200"
            >
              <CalendarIcon className="mr-2 h-5 w-5 text-blue-600" />
              {date ? format(date, "PPP") : <span>ເລືອກວັນທີ</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {isPending ? (
        // SPINNER SECTION
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="h-12 w-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse">
            ກຳລັງໂຫຼດຂໍ້ມູນ...
          </p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* 2. CONDITIONAL RENDERING: Empty State or Order List */}
          {orders?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <div className="p-6 bg-slate-100 rounded-full">
                <Search size={40} />
              </div>
              <p className="text-sm font-bold">ບໍ່ມີລາຍການສັ່ງຊື້ໃນວັນທີນີ້</p>
            </div>
          ) : (
            orders?.map((item) => (
              <Card
                key={item.id}
                className="border-none shadow-lg overflow-hidden rounded-[2.5rem] bg-white mb-4"
              >
                <CardContent className="p-0">
                  {/* 1. Large Image Section - Focused */}
                  <div className="relative h-56 w-full bg-slate-100">
                    <Image
                      src={item?.bakery_detail?.image}
                      alt={item?.bakery_detail?.name}
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Admin Set Badge Overlay */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                      <p className="text-[13px] font-black text-slate-700 uppercase leading-none">
                        ຈຳນວນສັັ່ງລົງ
                      </p>
                      <p className="text-xl font-black text-blue-700 text-center">
                        {item.order_set}
                      </p>
                    </div>
                  </div>

                  {/* 2. Content Section */}
                  <div className="p-5 space-y-4">
                    <div>
                      {/* TEXT WRAPPING FIX: whitespace-normal and break-words */}
                      <h3 className="text-2xl font-bold text-slate-800 leading-tight whitespace-normal break-words">
                        {item.bakery_detail.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-slate-500">
                        <Package size={16} />
                        <span className="text-xs font-medium uppercase tracking-wider">
                          Bakery Item Order
                        </span>
                      </div>
                    </div>

                    {/* 3. Input Section - Modern & Clean */}
                    <div className="bg-slate-50 rounded-[2rem] p-4 flex items-center justify-between border border-slate-100">
                      <div className="flex flex-col">
                        <label className="text-[15px] font-black text-slate-700 uppercase">
                          ຈຳນວນທີຕ້ອງການ
                        </label>
                        <span className="text-[12px] text-slate-700 italic">
                          Enter amount
                        </span>
                      </div>

                      {item.order_want > 0 ? (
                        <div className="flex items-center gap-2">
                          {" "}
                          <Input
                            type="number"
                            defaultValue={item.order_want}
                            disabled
                            className="w-20 h-12 text-center text-xl font-black rounded-2xl border-none bg-white shadow-inner focus-visible:ring-blue-600"
                          />
                          {!confirmOrder?.baristar_confirm_stt && (
                            <Button
                              variant="outline"
                              type="button"
                              onClick={() => handleResetOrder(item.id)}
                              className="h-12 w-12 rounded-2xl border-none bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-green-100 transition-all active:scale-95"
                            >
                              <Edit size={24} strokeWidth={3} />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {" "}
                          <Input
                            type="number"
                            disabled={
                              updatingId === item.id ||
                              confirmOrder?.baristar_confirm_stt
                            }
                            onKeyDown={(e) => {
                              if (
                                e.key === "ArrowUp" ||
                                e.key === "ArrowDown"
                              ) {
                                e.preventDefault();
                              }
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleUpdateSingleOrder(item.id);
                              }
                            }}
                            name={`order_want_${item.id}`}
                            className="w-20 h-12 text-center text-xl font-black rounded-2xl border-none bg-white shadow-inner focus-visible:ring-blue-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          {!confirmOrder?.baristar_confirm_stt && (
                            <Button
                              variant="outline"
                              type="button"
                              disabled={updatingId === item.id}
                              onClick={() => handleUpdateSingleOrder(item.id)}
                              className="h-12 w-12 rounded-2xl border-none bg-green-500 hover:bg-green-600 text-white shadow-md shadow-green-100 transition-all active:scale-95"
                            >
                              {updatingId === item.id ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <Check size={24} strokeWidth={3} />
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          {confirmOrder?.baristar_confirm_stt && (
            <div className="flex gap-3 p-4 bg-green-200 rounded-3xl border border-green-100">
              <BadgeCheck className="text-green-600 shrink-0" size={40} />
              <div className="space-y-1">
                <p className="text-[14px] font-bold uppercase tracking-wider">
                  ຢືນຢັນອໍເດີເບເກີລີ້ປະຈຳວັນທີ {dateString} ສຳເລັດ
                </p>
                <p className="text-[12px] opacity-90 leading-relaxed">
                  ອໍເດີຮອບນີ້ຈະຖືກຈັດສົ່ງວັນທີ {dateToSend}{" "}
                  "ກໍລະນີຕ້ອງການປ່ຽນແປງອໍເດີເພີ່ມເຕີມໃຫ້ຕິດຕໍພະແນກຈັດຊຶ້ທຮີຄອຟ."
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {!isPending &&
        !confirmOrder?.baristar_confirm_stt &&
        orders.length > 0 && (
          <div className="fixed bottom-20 left-0 w-full px-4 pb-4 z-20">
            <Button
              disabled={isConfirming}
              onClick={handleConfirmOrder}
              className="w-full h-16 rounded-[2rem] bg-slate-900 shadow-xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-3 text-white text-lg font-bold"
            >
              {isConfirming ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <CircleCheckBig size={22} />
              )}
              ຢືນຢັນອໍເດີທັງຫມົດ
            </Button>
          </div>
        )}
    </div>
  );
};

export default OrderBakery;
