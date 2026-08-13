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
  FileSpreadsheet,
  Printer,
  Store,
  XCircle,
} from "lucide-react";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import { toast } from "sonner";
import {
  getOrderBakeryPrint,
  getTrackingOrderBakery,
} from "@/app/api/client/order_bakery";
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
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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
  const [isExporting, setIsExporting] = useState(false);
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

  //excel handler export

  const handleExportExcel = async () => {
    try {
      setIsExporting(true);

      // Fetch the print data for the selected date and supplier
      const res = await getOrderBakeryPrint({
        order_at: selecDate,
        supplyerId: supplyerId,
      });

      const reportData = res?.data;

      // Validate data existence
      if (
        !reportData ||
        !reportData.branches ||
        !reportData.tableData ||
        reportData.tableData.length === 0
      ) {
        toast.warning("ບໍ່ມີຂໍ້ມູນສໍາລັບການ Export");
        return;
      }

      const formattedDate = format(date, "dd/MM/yyyy");
      const sheetData: any[][] = [];

      // 1. Report Title & Date Headers
      sheetData.push(["ລາຍງານການສັ່ງຊື້ສິນຄ້າ"]);
      sheetData.push([`Report Date: ${formattedDate}`]);
      sheetData.push([]); // Empty row space

      // 2. Table Header - Row 1 (Branch Numbers)
      const headerRow1 = ["ລາຍການສິນຄ້າ"];
      reportData.branches.forEach((_: any, index: number) =>
        headerRow1.push(`${index + 1}`),
      );
      headerRow1.push("ລວມ");
      sheetData.push(headerRow1);

      // 3. Table Header - Row 2 (Branch Names)
      const headerRow2 = [""];
      reportData.branches.forEach((b: any) => headerRow2.push(b.name));
      headerRow2.push("");
      sheetData.push(headerRow2);

      // 4. Data Rows
      reportData.tableData.forEach((row: any) => {
        const rowData: (string | number)[] = [row.bakeryName];

        reportData.branches.forEach((branch: any) => {
          const val = row[`branch_${branch.id}`];
          rowData.push(val && val !== 0 ? val : "");
        });

        rowData.push(row.total || 0);
        sheetData.push(rowData);
      });

      // 5. Total All Row
      const totalRow: (string | number)[] = ["TOTAL ALL"];
      reportData.branches.forEach((branch: any) => {
        const branchTotal = reportData.tableData.reduce(
          (sum: number, r: any) =>
            sum + (Number(r[`branch_${branch.id}`]) || 0),
          0,
        );
        totalRow.push(branchTotal);
      });

      const grandTotal = reportData.tableData.reduce(
        (sum: number, r: any) => sum + (Number(r.total) || 0),
        0,
      );
      totalRow.push(grandTotal);
      sheetData.push(totalRow);

      // 6. Generate Worksheet and Set Column Widths
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      const colWidths = [{ wch: 32 }]; // Column A width (Bakery Item Name)
      reportData.branches.forEach(() => colWidths.push({ wch: 16 })); // Branch columns width
      colWidths.push({ wch: 16 }); // Total column width
      worksheet["!cols"] = colWidths;

      // 7. Download File
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Order_Report");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const dataBlob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });

      saveAs(
        dataBlob,
        `Bakery_Order_Report_${format(date, "yyyy-MM-dd")}.xlsx`,
      );

      toast.success("Export Excel ສຳເລັດ!");
    } catch (error) {
      console.error(error);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການ Export Excel");
    } finally {
      setIsExporting(false);
    }
  };

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

        {/* this is where i want my export excel button to be*/}
        <div>
          <Button
            onClick={handleExportExcel}
            disabled={!isExporting && selecDate && supplyerId ? false : true}
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 font-bold"
          >
            <FileSpreadsheet className="h-4 w-4" />
            {isExporting ? "ກຳລັງ Export..." : "Export Excel"}
          </Button>
        </div>
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
