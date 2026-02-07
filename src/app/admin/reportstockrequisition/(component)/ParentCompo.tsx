"use client";
import React, { useEffect, useState } from "react";
import MaterialReportTable from "./MaterialReportTable";
import DateRanges from "@/components/DateRanges";
import { DateRange } from "react-day-picker";
import CalendarRange from "./CalendarRange";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
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
export const demoReportData = [
  {
    id: 22,
    material_name: "ຄຣີມທຽມ mister save",
    description: "ຄຣີມທຽມຄຸນນະພາບດີ ສຳລັບປະສົມເຄື່ອງດື່ມ",
    category_materialId: 14,
    min_order: 60,
    category_name: "ວັດຖຸດິບສາງກະຈາຍ",
    image:
      "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com/material/1769671804308-tt.png",
    all_stockrequisition: [
      {
        id: 43,
        variant_name: "ແກັດ",
        total_price_kip: 74277000,
        total_price_bath: 106110,
        barcode: "8852114949209",
        quantity_requisition: 277, // Total base quantity converted to Box unit
      },
      {
        id: 44,
        variant_name: "ແພັກ",
        total_price_kip: 179732000,
        total_price_bath: 256760,
        barcode: "323213",
        quantity_requisition: 1385, // Total base quantity converted to Pack unit
      },
      {
        id: 45,
        variant_name: "ຖົງ (Base Unit)",
        total_price_kip: 0,
        total_price_bath: 0,
        barcode: "710",
        quantity_requisition: 5540, // Total raw amount in Bags
      },
      {
        id: 46,
        variant_name: "ຖົງ (Base Unit)",
        total_price_kip: 0,
        total_price_bath: 0,
        barcode: "710",
        quantity_requisition: 5540, // Total raw amount in Bags
      },
    ],
  },
  {
    id: 23,
    material_name: "ຊາກາມືແດງ ລົດ ວານິລາ",
    description: "ຊາແດງຫອມກິ່ນວານິລາ ສູດພິເສດ",
    category_name: "ວັດຖຸດິບສາງກະຈາຍ",
    min_order: 30,
    category_materialId: 14,
    image:
      "https://treekoff-store-product-image.s3.ap-southeast-2.amazonaws.com/material/1769701321278-ss.jpg",
    all_stockrequisition: [
      {
        id: 46,
        variant_name: "ແກັດ",
        total_price_kip: 4233600,
        total_price_bath: 6300,
        barcode: "18850370721116",
        quantity_requisition: 38,
      },
      {
        id: 47,
        variant_name: "ຖົງ",
        total_price_kip: 18748800,
        total_price_bath: 27900,
        barcode: "103",
        quantity_requisition: 456,
      },
    ],
  },
];

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
