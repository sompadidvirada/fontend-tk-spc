"use client";
import React, { useEffect, useState } from "react";
import MaterialReportTable from "./MaterialReportTable";
import DateRanges from "@/components/DateRanges";
import { DateRange } from "react-day-picker";
import CalendarRange from "./CalendarRange";
import { Button } from "@/components/ui/button";
import { FileInput, Printer, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import UploadFile from "./UploadFile";
import { Material, Material_Variant } from "../../material/page";
import {
  deleteAllStockRemain,
  getAllStockReamin,
  getReportRequisition,
} from "@/app/api/client/stock_requisition";
import { toast } from "sonner";
import { Branch_type } from "../../orderbakery/(component)/ParentContent";
import SelectBranch from "@/app/admin/tracksell/(component)/SelectBranch";


export interface Stock_Remain {
  id: number;
  material_name: string;
  image: string;
  all_stock: All_Stock_Remain[];
}

type All_Stock_Remain = {
  id: number;
  stock_id: number;
  conver_to_base: number;
  variant_name: string;
  barcode: string;
  stock_remain: number;
};

interface Report_Stock_Requisition {
  id: number;
  material_name: string;
  description: string;
  category_materialId: number;
  min_order: number;
  category_name: string;
  image: string;
  all_stockrequisition: All_Stock[];
}

type All_Stock = {
  id: number;
  variant_name: string;
  total_price_kip: number;
  total_price_bath: number;
  barcode: string;
  quantity_requisition: number;
};

interface Prop {
  branch: Branch_type[];
  materials: Material[];
}

const ParentCompo = ({ branch, materials }: Prop) => {
  const [range, setRange] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report_Stock_Requisition[]>([]);
  const [check, setCheck] = useState<Stock_Remain[]>([]);
  const [value, setValue] = useState("all");

  const startDate = range?.from?.toLocaleDateString("en-CA");
  const endDate = range?.to?.toLocaleDateString("en-CA");

  const isDisable = !startDate || !endDate || !value || loading;

  const fecthReportStockRequisition = async () => {
    if (!startDate || !endDate) return;
    try {
      const ress = await getReportRequisition({
        startDate: startDate,
        endDate: endDate,
        branchId: value === "all" ? value : Number(value),
      });
      setReport(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fecthStockRemain = async () => {
    try {
      const ress = await getAllStockReamin();
      setCheck(ress.data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteStockRem = async () => {
    try {
      await deleteAllStockRemain();
      toast.success("ລົບສະຕ໋ອກຄົງເຫລືອທັງໝົດສຳເລັດ.");
      setCheck([]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fecthStockRemain();
  }, []);

  useEffect(() => {
    if (startDate && endDate && value) {
      fecthReportStockRequisition();
    }
  }, [startDate, endDate, value]);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4 w-full">
        <div></div>
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <div>
            <Button
              variant="outline"
              className="font-lao"
              disabled={isDisable}
              onClick={deleteStockRem}
            >
              <Trash2 /> ລົບສະຕ໋ອກຄົງເຫຼືອທັງໝົດ
            </Button>
          </div>
          <UploadFile
            isDisable={isDisable}
            materials={materials}
            fecthStockRemain={fecthStockRemain}
          />
          <div>
            <Button variant={"outline"} className="font-lao" disabled={isDisable}>
              <Printer />
              ປິ່ນລາຍງານ
            </Button>
          </div>
          <SelectBranch
            branchs={branch}
            setValue={setValue}
            value={value}
            isForReport={true}
          />
          <CalendarRange range={range} setRange={setRange} />
        </div>
      </div>
      <Card className="@container/card bg-gray-200 border-none shadow-none">
        <MaterialReportTable
          selectedDate={range}
          loading={loading}
          value={"all"}
          fecthStockRemain={fecthStockRemain}
          check={check}
          data={report}
          branch={branch}
        />
      </Card>
    </>
  );
};

export default ParentCompo;
