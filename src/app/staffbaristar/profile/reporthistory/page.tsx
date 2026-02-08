"use client";
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  X,
  Info,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useSession } from "../../SessionProvider";
import { getReportHistory } from "@/app/api/client/baristar";
import { toast } from "sonner";
import { format } from "date-fns";


const ReportHistory = () => {
  const router = useRouter();
  const staff_detail = useSession();

  // --- States ---
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // Replace with your actual API utility call
        const response = await getReportHistory({
          branchId: staff_detail?.branchId,
          page: currentPage,
          limit: itemsPerPage,
        });

        setReports(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      } catch (err) {
        toast.error("ບໍ່ສາມາດໂຫລດຂໍ້ມູນປະຫວັດໄດ້");
      } finally {
        setIsLoading(false);
      }
    };

    if (staff_detail?.branchId) {
      fetchHistory();
    }
  }, [currentPage, staff_detail?.branchId]);

  return (
    <div className="min-h-screen bg-slate-50 font-lao pb-24">
      {/* 1. Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md px-4 py-4 border-b flex items-center justify-between z-10">
        <button onClick={() => router.back()} className="p-2 text-slate-600 active:scale-90 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <div className="flex flex-col items-center">
          <span className="font-bold text-sm">ປະຫວັດການລາຍງານ</span>
          <span className="text-[10px] text-slate-400">ທັງໝົດ {totalItems} ລາຍການ</span>
        </div>
        <div className="w-10" />
      </div>

      {/* 2. Report Grid */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          // Loading Skeleton
          [1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 animate-pulse rounded-[2rem]" />
          ))
        ) : reports.length === 0 ? (
          <div className="text-center py-20 text-slate-400">ຍັງບໍ່ມີປະຫວັດການລາຍງານ</div>
        ) : (
          reports.map((report) => (
            <Sheet key={report.id}>
              <SheetTrigger asChild>
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 active:scale-[0.98] transition-all cursor-pointer">
                  <div className="relative h-44">
                    {/* Primary Image from the related table */}
                    <img
                      src={report.baristar_images_report[0]?.image || "/placeholder-bakery.png"}
                      className="w-full h-full object-cover"
                      alt="report"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <Clock size={12} className="text-amber-500" />
                      <span className="text-[10px] font-bold">
                        {format(new Date(report.report_date), "dd/MM/yyyy")}
                      </span>
                    </div>
                    {report.baristar_images_report.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-white">
                        <ImageIcon size={12} />
                        <span className="text-[10px]">+ {report.baristar_images_report.length - 1}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-base line-clamp-1 flex-1">
                        {report.bakery_detail?.name}
                      </h3>
                      <Badge variant="outline" className="ml-2 text-[10px] border-amber-200 bg-amber-50 text-amber-700">
                        Pending
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500">
                      <AlertCircle size={14} className="text-blue-500" />
                      <span className="text-xs">{report.title}</span>
                    </div>
                  </div>
                </div>
              </SheetTrigger>

              <SheetContent side="bottom" className="h-[90vh] rounded-t-[2rem] p-0 overflow-hidden font-lao">
                <div className="h-full flex flex-col">
                  <div className="p-6 overflow-y-auto flex-1 no-scrollbar">
                    <SheetHeader className="mb-6">
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4" />
                      <SheetTitle className="text-xl font-bold text-left">{report.bakery_detail?.name}</SheetTitle>
                      <div className="flex items-center gap-2 text-slate-400 text-xs">
                        <Clock size={14} /> {format(new Date(report.report_date), "dd/MM/yyyy")} • ID: #{report.id}
                      </div>
                    </SheetHeader>

                    <div className="space-y-4">
                      <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ຮູບພາບປະກອບ</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {report.baristar_images_report.map((imgObj: any, idx: number) => (
                          <div key={idx} className="aspect-square rounded-2xl overflow-hidden border">
                            <img src={imgObj.image} className="w-full h-full object-cover" alt="detail" />
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 pt-4">
                        <Label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">ລາຍລະອຽດບັນຫາ</Label>
                        <div className="bg-slate-50 rounded-2xl p-4 text-slate-700 text-sm leading-relaxed border border-slate-100">
                          {report.descriptoion} {/* Matches your backend typo */}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white border-t">
                    <SheetClose asChild>
                      <Button className="w-full h-14 rounded-2xl bg-[#402f22] text-white">ປິດໜ້າຕ່າງ</Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))
        )}
      </div>

      {/* 3. Pagination Controls */}
      {!isLoading && reports.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-4 px-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shadow-sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
          </Button>

          <span className="text-sm font-bold">
            ໜ້າ <span className="text-[#402f22]">{currentPage}</span> / {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10 shadow-sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages || 1, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
export default ReportHistory;
