import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import React from "react";
import { useReactToPrint } from "react-to-print";
import { BakeryData } from "./TableReport";
import ComponentToPrint from "./ComponentToPrint";
import { DateRange } from "react-day-picker";

interface DataProp {
  report: BakeryData[];
  branchName: string;
  dateRange: DateRange | undefined;
  lang?: string
}

const PrintReport =  ({ report, branchName, dateRange, lang }: DataProp) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <>
      <Button
        variant="outline"
        className="text-xs font-lao bg-blue-300 border-gray-400/20"
        onClick={reactToPrintFn}
        disabled={dateRange?.from && dateRange?.to && branchName ? false : true}
      >
        <Printer /> {lang === "LA" ? "ປິ່ນລາຍງານ" : "Print report"}
      </Button>
      <div className="hidden">
        <div ref={contentRef} className="p-8 font-lao">
          <ComponentToPrint
            ref={contentRef}
            data={report}
            branchName={branchName}
            dateRange={dateRange}
          />
        </div>
      </div>
    </>
  );
};

export default PrintReport;
