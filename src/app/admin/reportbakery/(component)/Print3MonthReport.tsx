import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";

interface DataProp {
  branchId: string;
  branchName: string; // This is your 'value' (branchId)
  dateRange: DateRange | undefined;
  lang?: string;
}

const Print3MonthReport = ({ branchId, branchName, dateRange }: DataProp) => {
  const handleOpenPrintTab = () => {
    if (!dateRange?.from || !dateRange?.to || !branchId) return;

    // Format dates to YYYY-MM-DD
    const start = dateRange.from.toLocaleDateString("en-CA");
    const end = dateRange.to.toLocaleDateString("en-CA");

    // Build the URL
    const params = new URLSearchParams({
      start,
      end,
      branchId: branchId,
      branchName: branchName,
    });

    window.open(`/print-bakery-report-3month?${params.toString()}`, "_blank");
  };
  return (
    <Button
      variant="outline"
      className="text-xs font-lao bg-yellow-300 border-gray-400/20"
      onClick={handleOpenPrintTab}
      disabled={!(dateRange?.from && dateRange?.to && branchId)}
    >
      <Printer className="mr-2 h-4 w-4" />
        ປີ່ນລາຍງານ 3 ເດືອນ
    </Button>
  );
};

export default Print3MonthReport;
