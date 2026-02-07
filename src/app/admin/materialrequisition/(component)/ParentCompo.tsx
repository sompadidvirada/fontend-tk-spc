"use client";
import React, { useEffect, useState } from "react";
import CalendarCompo from "../../tracksell/(component)/Calendar";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import { Button } from "@/components/ui/button";
import { FolderUp, Printer, RotateCcw } from "lucide-react";
import { Material } from "../../material/page";
import TableMaterial, { Stock_Requisition } from "./TableMaterial";
import UploadFile from "./UploadFile";
import {
  deleteAllStockRequisition,
  getAllStockRequisition,
} from "@/app/api/client/stock_requisition";
import { toast } from "sonner";
import PrintStockRequi from "./PrintStockRequi";

export interface DataBranchProps {
  branchs: Branch_type[];
  materiant_Variant: Material[];
}

const ParentCompo = ({ branchs, materiant_Variant }: DataBranchProps) => {
  const [date, setDate] = React.useState<Date | undefined>();
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = useState(false);
  const [check, setCheck] = React.useState<Stock_Requisition[]>([]);

  const dateToSend = date?.toLocaleDateString("en-CA");

  const fecthCheck = async () => {
    if (!dateToSend) return;
    setLoading(true);
    try {
      const ress = await getAllStockRequisition({
        date: dateToSend,
        branchId: Number(value),
      });
      setCheck(ress.data);
    } catch (err) {
      console.log(err);
      toast.error("ບໍ່ສາມາດດຶງຍອດເບີກວັດຖຸດິບໄດ້.");
    } finally {
      setLoading(false);
    }
  };

  const deleteAllStock = async () => {
    if (!dateToSend) return;
    try {
      await deleteAllStockRequisition({
        date: dateToSend,
        branchId: Number(value),
      });
      setCheck([])
      toast.success("ລົບລາຍການທັງໝົດສຳເລັດ")
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (date && value) {
      fecthCheck();
    }
  }, [date, value]);
  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <CalendarCompo
            selectedDate={date}
            onDateChange={setDate}
            forOrder={false}
          />
          <SelectBranch
            branchs={branchs}
            value={value}
            setValue={setValue}
            isForReport={false}
          />
          <Button variant={"outline"} className="font-lao" onClick={deleteAllStock}>
            <RotateCcw className="mr-1 h-4 w-4" /> ລົບທັງໝົດ
          </Button>
          <UploadFile
            selectedDate={dateToSend ? dateToSend : ""}
            value={value}
            setCheck={setCheck}
            material_variant={materiant_Variant}
          />
          <PrintStockRequi
            branchs={branchs}
            value={value}
            check={check}
            materiant_Variant={materiant_Variant}
            dateToSend={dateToSend ? dateToSend : ""}
          />
        </div>

        {/** TABLE TRACKSELL */}
      </div>
      <div className="px-5 mt-3">
        <TableMaterial
          data={materiant_Variant}
          selectedDate={date}
          value={value}
          loading={loading}
          check={check}
          setCheck={setCheck}
        />
      </div>
    </>
  );
};

export default ParentCompo;
