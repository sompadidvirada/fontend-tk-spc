import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Package,
  User,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { Track_Report_Bakery } from "../page";
import { updateStatusReport } from "@/app/api/client/track_report_baristar";
import { useRouter } from "next/navigation";

interface ReportDetailDrawerProps {
  report: Track_Report_Bakery;
  setReports: React.Dispatch<React.SetStateAction<Track_Report_Bakery[]>>;
  children: React.ReactNode; // This tells TS that children are UI elements
}
interface InfoBoxProps {
  icon: React.ReactNode;
  label: string;
  value: string | undefined; // Using undefined just in case the report data is missing
}

const ReportDetailDrawer: React.FC<ReportDetailDrawerProps> = ({
  report,
  children,
  setReports,
}) => {
  if (!report) return <>{children}</>;
  const [open, setOpen] = useState(false);

  const handleStatusUpdate = async (status: boolean, id: number) => {
    if (status === undefined) return;
    try {
      const response = await updateStatusReport({ status: status }, id);

      if (response) {
        setReports((prevReports) =>
          prevReports.map((r) => (r.id === id ? { ...r, status: status } : r)),
        );
        setOpen(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="sm:max-w-2xl overflow-y-auto font-lao bg-white border-l shadow-2xl px-8">
        <SheetHeader className="border-b pb-6">
          <div className="flex justify-between items-center mb-2">
            <Badge className={"bg-amber-100 text-amber-700"}>ລໍຖ້າກວດສອບ</Badge>
            <span className="text-xs text-slate-400 font-mono">
              {report.id}
            </span>
          </div>
          <SheetTitle className="text-2xl font-bold text-slate-900 leading-tight">
            {report.title}
          </SheetTitle>
          <SheetDescription className="text-slate-500">
            ກວດສອບລາຍລະອຽດ ແລະ ຫຼັກຖານທີ່ສົ່ງມາຈາກສາຂາ
          </SheetDescription>
        </SheetHeader>

        <div className="py-8 space-y-8 pb-1 0">
          {/* Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            <InfoBox
              icon={<Package size={18} />}
              label="ສິນຄ້າ"
              value={report.bakery_detail.name}
            />
            <InfoBox
              icon={<MapPin size={18} />}
              label="ສາຂາ"
              value={report.branch.name}
            />
            <InfoBox
              icon={<Calendar size={18} />}
              label="ວັນທີສົ່ງ"
              value={new Date(report.report_date).toLocaleDateString("lo-LA")}
            />
            <InfoBox
              icon={<User size={18} />}
              label="ຜູ້ລາຍງານ"
              value={`ID: ${report.staff_officeId || ""}`}
            />
          </div>

          {/* Gallery Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>ຮູບພາບປະກອບ</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-500">
                {report.baristar_images_report?.length || 0} ຮູບ
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {report.baristar_images_report?.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-sm"
                >
                  <Image
                    src={img.image}
                    alt="evidence"
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Problem Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-500" /> ລາຍລະອຽດບັນຫາ
            </h3>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 leading-relaxed shadow-inner">
              {report.descriptoion || "ບໍ່ມີລາຍລະອຽດເພີ່ມເຕີມ"}
            </div>
          </div>
        </div>

        {/* Floating Action Bar */}
        <div className="bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-md border-t flex gap-4">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            onClick={() => handleStatusUpdate(false, report.id)}
          >
            <XCircle className="mr-2 h-4 w-4" /> ປະຕິເສດ
          </Button>
          <Button
            className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-lg"
            onClick={() => handleStatusUpdate(true, report.id)}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" /> ແກ້ໄຂສຳເລັດ
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Helper component to keep the code clean
const InfoBox = ({ icon, label, value }: InfoBoxProps) => (
  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-slate-200 transition-all">
    <div className="text-slate-400 bg-white p-2 rounded-lg shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">
        {label}
      </p>
      <p className="text-sm font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default ReportDetailDrawer;
