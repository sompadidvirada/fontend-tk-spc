"use client";
import DateRanges from "@/components/DateRanges";
import React from "react";
import PrintReport from "./PrintReport";
import { DateRange } from "react-day-picker";
import { getReportBakery } from "@/app/api/client/trackingbakery";
import TableReport, { BakeryData } from "./TableReport";
import SelectBranch from "@/app/admin/tracksell/(component)/SelectBranch";
import { Branch_type } from "../../orderbakery/(component)/ParentContent";

export interface DataBranchProps {
  branchs: Branch_type[];
}

const ParentTable = ({ branchs }: DataBranchProps) => {
  const [value, setValue] = React.useState("");
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [report, setReport] = React.useState<BakeryData[] | []>([]);

  React.useEffect(() => {
    const fecthReportBake = async () => {
      const dateStart = range?.from?.toLocaleDateString("en-Ca");
      const dateEnd = range?.to?.toLocaleDateString("en-Ca");
      try {
        const ress = await getReportBakery({
          startDate: dateStart,
          endDate: dateEnd,
          branchId: value,
        });
        const responseFromApi = ress.data;
        setReport(responseFromApi);
      } catch (err) {
        console.log(err);
      }
    };

    if (range?.from && range?.to && value) {
      fecthReportBake();
    }
  }, [range, value]);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        {/* Buttons: Stacked on mobile, row on desktop */}
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10 justify-end w-full">
          <SelectBranch
            branchs={branchs}
            value={value}
            setValue={setValue}
            isForReport={true}
          />
          <PrintReport report={report} branchName={value} dateRange={range} />{" "}
          <DateRanges range={range} setRange={setRange} />
        </div>
      </div>
      <div className="px-5 mt-3">
        <TableReport data={report} />
      </div>
    </>
  );
};

export default ParentTable;
