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
  Printer,
  Store,
  XCircle,
} from "lucide-react";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import { toast } from "sonner";
import { getTrackingOrderBakery } from "@/app/api/client/order_bakery";
import { useSocket } from "@/socket-io/SocketContext";
import PrintBakery from "./PrintBakery";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplyer } from "../../bakerymanage/(component)/TableBakery";

interface Track_Order_Branch {
  branchId: number;
  branchName: string;
  changedItemsCount: number;
  totalItemsOrdered: number;
  baristar_confirm_stt: boolean;
  admin_confirm_stt: boolean;
}

const TableData = ({ supllyers }: { supllyers: Supplyer[] }) => {
  const [date, setDate] = useState<Date>(new Date());
  const selecDate = date ? format(date, "yyyy-MM-dd") : "";
  const [trackOrder, setTrackOrder] = useState<Track_Order_Branch[]>([]);
  const [open, setOpen] = useState(false);
  const [supplyerId, setSupplyerId] = React.useState("");

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
    if (!socket) return console.log("socket is not connect");

    const handleMessage = (event: MessageEvent) => {
      const msg = JSON.parse(event.data);

      // msg.event comes from your Go Hub (e.g., eventType string)
      switch (msg.event) {
        case "baristar_confirm_stt":
          const baristarData = msg.data;
          if (baristarData.date === selecDate) {
            toast.success(`${baristarData.branchName} ກົດຢືນຢັນອໍເດີ!`);

            setTrackOrder((prev) => {
              const exists = prev.find(
                (item) => item.branchId === baristarData.data.branchId,
              );
              if (exists) {
                return prev.map((item) =>
                  item.branchId === baristarData.data.branchId
                    ? {
                        ...item,
                        baristar_confirm_stt:
                          baristarData.data.baristar_confirm_stt,
                      }
                    : item,
                );
              }
              return [...prev, baristarData];
            });
          }
          break;

        case "admin_confirm_stt":
          const adminData = msg.data;
          const socketDateOnly = adminData.confirm_date.split("T")[0];
          if (socketDateOnly === selecDate) {
            setTrackOrder((prev) => {
              const exists = prev.find(
                (item) => item.branchId === adminData.branchId,
              );
              if (exists) {
                return prev.map((item) =>
                  item.branchId === adminData.branchId
                    ? {
                        ...item,
                        admin_confirm_stt: adminData.admin_confirm_stt,
                      }
                    : item,
                );
              }
              return [...prev, adminData];
            });
          }
          break;
      }
    };

    // 1. Start listening
    socket.addEventListener("message", handleMessage);

    // 2. Stop listening when the component unmounts
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket, selecDate]); // Added selecDate so the filter updates when you change the calendar

  return (
    <>
      <div className="flex gap-3 my-3 w-full justify-end">
        {/* 2. Controlled Select component */}
        <div>
          <Select onValueChange={setSupplyerId} value={supplyerId}>
            <SelectTrigger className="border-slate-200 w-full bg-secondary">
              <SelectValue placeholder="ເລືອກບໍລິສັດ/ຮ້ານ" />
            </SelectTrigger>
            <SelectContent className="font-lao">
              {supllyers &&
                supllyers?.map((item, i) => (
                  <SelectItem key={i} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

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
        <PrintBakery selecDate={selecDate} supplyerId={supplyerId} />
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
                ຈຳນວນເບເກີລີ້ທັງໝົດ
              </TableHead>
              <TableHead className="text-center text-slate-900 font-bold">
                ລາຍການທີສາຂາແກ້ໄຂ
              </TableHead>
              <TableHead className="text-center text-slate-500 font-bold">
                ສາຂາຢືນຢັນ
              </TableHead>
              <TableHead className="text-center text-slate-500 font-bold">
                ຫົວໜ້າຢືນຢັນ
              </TableHead>
              <TableHead className="text-right pr-8 text-slate-500 font-bold">
                ຈັດການ
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
