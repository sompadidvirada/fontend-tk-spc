"use client";

import React, { useEffect } from "react";
import {
  Branch_type,
  DataBranchProps,
} from "../../tracksell/(component)/ParentTable";
import DateRanges from "@/components/DateRanges";
import { DateRange } from "react-day-picker";
import TableReport, { BakeryReportItem } from "./TableReport";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Supplyer } from "../../bakerymanage/(component)/TableBakery";
import { getReportBakeryNew } from "@/app/api/client/dashboard";

interface DataBranchPropss {
  branchs: Branch_type[];
  lang?: string;
  supplyer: Supplyer[];
}

const ParentTable = ({ branchs, lang, supplyer }: DataBranchPropss) => {
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [supplyerId, setSupplyerId] = React.useState("");
  const [report, setReport] = React.useState<BakeryReportItem[]>([])


  const start = range?.from?.toLocaleDateString("en-Ca");
  const end = range?.to?.toLocaleDateString("en-Ca");



  const feacthReport = async () => {
    if (!start || !end) return;
    try {
      const ress = await getReportBakeryNew({
        start: start,
        end: end,
        supplyerId: Number(supplyerId),
      });
      setReport(ress.data)
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!start || !end || !supplyerId)  return
      feacthReport()
    
  }, [range, supplyerId]);
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10 justify-end w-full">
          <DateRanges range={range} setRange={setRange} />
        </div>

        <div className="font-lao">
          <Select onValueChange={setSupplyerId} value={supplyerId}>
            <SelectTrigger className="border-slate-200 w-full bg-secondary">
              <SelectValue placeholder="ເລືອກບໍລິສັດ/ຮ້ານ" />
            </SelectTrigger>
            <SelectContent className="font-lao">
              {supplyer &&
                supplyer?.map((item, i) => (
                  <SelectItem key={i} value={item.id.toString()}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="px-5 mt-3">
        <TableReport data={report} />
      </div>
    </>
  );
};

export default ParentTable;
