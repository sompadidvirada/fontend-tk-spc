"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import ReportDetailDrawer from "./(component)/ReportDetailDrawer";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fecthAllReportBakeryBaristar } from "@/app/api/client/track_report_baristar";

export interface Track_Report_Bakery {
  id: number;
  report_date: Date;
  title: string;
  descriptoion: string;
  status: boolean
  bakery_detailId: number;
  branchId: number;
  staff_officeId: number | null;
  baristar_images_report: Report_Image[];
  bakery_detail: Bakery_Detail;
  branch: Branch;
}
interface PaginationData {
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

type Report_Image = {
  id: number;
  image: string;
  baristar_reportId: number;
};

type Bakery_Detail = {
  name: string;
  image: string;
};
type Branch = {
  id: number;
  name: string;
  province: string;
  phonenumber: number;
  available: boolean;
};

const TrackReport = () => {
  const [reports, setReports] = useState<Track_Report_Bakery[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const result = await fecthAllReportBakeryBaristar({
        page: currentPage,
        limit: rowsPerPage,
      });
      setReports(result.data.data);
      setPagination(result.data.pagination);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentPage, rowsPerPage]); // Refetch when page or limit changes

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-lao">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">ລາຍງານທັງໝົດ</h1>
          <p className="text-slate-500">ຈັດການ ແລະ ກວດສອບບັນຫາຈາກແຕ່ລະສາຂາ</p>
        </div>
        <Button className="bg-[#402f22] hover:bg-[#2d2118]">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">ລາຍງານທັງໝົດ 30 ມື້ຍ້ອນຫລັງ</p>
          <p className="text-2xl font-bold">12 ລາຍການ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">ລາຍການລໍຖ້າກວດສອບ</p>
          <p className="text-2xl font-bold text-blue-600">5 ລາຍການ</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500">ລາຍການທີກວດສອບສຳເລັດ</p>
          <p className="text-2xl font-bold text-green-600">128 ລາຍການ</p>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[100px]">ຮູບພາບ</TableHead>
              <TableHead>ຊື່ເບເກີລີ້</TableHead>
              <TableHead>ສາຂາ</TableHead>
              <TableHead>ຫົວຂໍ້ບັນຫາ</TableHead>
              <TableHead>ວັນທີສົ່ງ</TableHead>
              <TableHead>ສະຖານະ</TableHead>
              <TableHead className="text-right">ຈັດການ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  ກຳລັງໂຫລດ...
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="hover:bg-slate-50/50 transition-colors font-lao"
                >
                  <TableCell>
                    <div className="relative h-12 w-12">
                      <Image
                        src={report.bakery_detail.image} // Using your provided image path
                        fill
                        className="rounded-lg object-cover border"
                        alt="bakery"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">
                        {report.bakery_detail.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ID: {report.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.branch.name}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {report.title}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(report.report_date).toLocaleDateString("lo-LA")}
                  </TableCell>
                  <TableCell>
                     {report.status ? (
                      <Badge className={"bg-green-200 text-green-700"}>
                      ກວດສອບແລ້ວ
                    </Badge>
                     ) : (
                      <Badge className={"bg-amber-100 text-amber-700"}>
                      ລໍຖ້າກວດສອບ
                    </Badge>
                     )
}
                  </TableCell>
                  <TableCell className="text-right">
                    {/* Wrap the button and pass the specific report data */}
                    <ReportDetailDrawer report={report} setReports={setReports}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-200"
                      >
                        <Eye className="h-4 w-4 text-slate-600" />
                      </Button>
                    </ReportDetailDrawer>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-6 py-4 border-t bg-slate-50/50">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500 font-lao">
              ທັງໝົດ {pagination?.totalItems || 0} ລາຍການ
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-lao">
                ແຖວຕໍ່ໜ້າ:
              </span>
              <Select
                value={rowsPerPage.toString()}
                onValueChange={(val) => {
                  setRowsPerPage(parseInt(val));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  disabled={currentPage === 1 || loading}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="font-lao"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> ກ່ອນໜ້າ
                </Button>
              </PaginationItem>

              <div className="flex items-center px-4 text-sm font-medium">
                ໜ້າທີ {pagination?.currentPage || 1} /{" "}
                {pagination?.totalPages || 1}
              </div>

              <PaginationItem>
                <Button
                  variant="ghost"
                  disabled={currentPage === pagination?.totalPages || loading}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="font-lao"
                >
                  ຖັດໄປ <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};
export default TrackReport;
