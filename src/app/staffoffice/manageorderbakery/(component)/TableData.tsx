"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CalendarIcon,
  CheckCircle2,
  Store,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { getTrackingOrderBakery } from "@/app/api/client/order_bakery";
import { useSocket } from "@/socket-io/SocketContext";
import PrintBakery from "./PrintBakery";

interface Track_Order_Branch {
  branchId: number;
  branchName: string;
  changedItemsCount: number;
  totalItemsOrdered: number;
  baristar_confirm_stt: boolean;
  admin_confirm_stt: boolean;
}

const TableData = () => {
  const [date, setDate] = useState<Date>(new Date());
  const selecDate = date ? format(date, "yyyy-MM-dd") : "";
  const [trackOrder, setTrackOrder] = useState<Track_Order_Branch[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fecthTrackingOrder = async () => {
      try {
        const ress = await getTrackingOrderBakery({ track_date: selecDate });
        setTrackOrder(ress.data);
      } catch (err) {
        console.log(err);
        toast.error("ລອງໃໝ່ພາຍຫລັງ");
      }
    };
    if (date) {
      fecthTrackingOrder();
    }
  }, [date]);

  //SOCKET IO

  const socket = useSocket();
  useEffect(() => {
    if (!socket) return;
    const handleUpdateBaristar = (data: any) => {
      if (data.date === selecDate) {
        toast.success(`${data.branchName} ກົດຢືນຢັນອໍເດີ!`);

        setTrackOrder((prev) => {
          const exists = prev.find(
            (item) => item.branchId === data.data.branchId,
          );

          if (exists) {
            return prev.map((item) =>
              item.branchId === data.data.branchId
                ? {
                    ...item,
                    baristar_confirm_stt: data.data.baristar_confirm_stt,
                  }
                : item,
            );
          } else {
            return [...prev, data];
          }
        });
      }
    };
    const handleUpdateAdmin = (data: any) => {
      const socketDateOnly = data.confirm_date.split('T')[0];
      console.log(data);
      if (socketDateOnly === selecDate) {
        setTrackOrder((prev) => {
          const exists = prev.find(
            (item) => item.branchId === data.branchId,
          );

          if (exists) {
            return prev.map((item) =>
              item.branchId === data.branchId
                ? {
                    ...item,
                    admin_confirm_stt: data.admin_confirm_stt,
                  }
                : item,
            );
          } else {
            return [...prev, data];
          }
        });
      }
    };
    socket.on("baristar_confirm_stt", handleUpdateBaristar);
    socket.on("admin_confirm_stt", handleUpdateAdmin);
    return () => {
      socket.off("baristar_confirm_stt", handleUpdateBaristar);
      socket.off("admin_confirm_stt", handleUpdateAdmin);
    };
  }, [socket, date]);

  return (
    <>
      <div className="flex gap-3 my-3 w-full justify-end">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="border-none shadow-sm font-bold"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "dd/MM/yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (!d) return;
                setDate(d);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
       <PrintBakery selecDate={selecDate}/>
      </div>
      {/* --- EXCEPTION TABLE --- */}
      <Card className="border-none shadow-xl shadow-slate-200/60 overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-transparent border-slate-100">
              <TableHead className="py-5 pl-8 text-slate-500 font-bold">
                ຊື່ສາຂາ
              </TableHead>
              <TableHead className="text-center text-slate-500 font-bold">
                ຈຳນວນລາຍການທັງໝົດ
              </TableHead>
              <TableHead className="text-center text-slate-900 font-bold">
                ຈຳນວນທີ່ປ່ຽນແປງ (Changed)
              </TableHead>
              <TableHead className="text-center text-slate-500 font-bold">
                Barista
              </TableHead>
              <TableHead className="text-center text-slate-500 font-bold">
                Admin
              </TableHead>
              <TableHead className="text-right pr-8 text-slate-500 font-bold">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trackOrder.map((row) => (
              <TableRow
                key={row.branchId}
                className="border-slate-50 hover:bg-slate-50/50 transition-colors"
              >
                <TableCell className="py-5 pl-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                      <Store size={18} />
                    </div>
                    <span className="font-bold text-slate-700">
                      {row.branchName}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="text-center text-slate-400 font-medium">
                  {row.totalItemsOrdered} ລາຍການ
                </TableCell>

                <TableCell className="text-center">
                  {row.changedItemsCount > 0 ? (
                    <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-1.5 rounded-full font-black text-sm border border-orange-100">
                      <AlertCircle size={14} />
                      {row.changedItemsCount} ລາຍການ
                    </div>
                  ) : (
                    <span className="text-green-500 font-bold text-sm">
                      ບໍ່ມີການປ່ຽນແປງ
                    </span>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {row.baristar_confirm_stt ? (
                    <div className="flex items-center justify-center gap-1 text-green-600 font-bold text-xs uppercase tracking-tighter">
                      <CheckCircle2 size={14} /> Confirmed
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1 text-slate-300 font-bold text-xs uppercase tracking-tighter">
                      <XCircle size={14} /> Pending
                    </div>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  <Badge
                    className={
                      row.admin_confirm_stt
                        ? "bg-blue-600"
                        : "bg-slate-100 text-slate-400 hover:bg-slate-100 shadow-none border-none"
                    }
                  >
                    {row.admin_confirm_stt ? "Approved" : "Waiting"}
                  </Badge>
                </TableCell>

                <TableCell className="text-right pr-8">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold"
                  >
                    ເບິ່ງລາຍລະອຽດ
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </>
  );
};

export default TableData;
