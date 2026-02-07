"use client";
import React from "react";
import { BakeryDetail } from "../../tracksell/(component)/TableData";
import {
  getBakerysAvailable,
  getTrackingExp,
} from "@/app/api/client/trackingbakery";
import CalendarCompo from "../../tracksell/(component)/Calendar";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import TableData from "./TableData";
import DeleteAllTrack from "./DeleteAllTrack";

interface DataBranchProps {
  branchs: Branch_type[];
}

type Branch_type = {
  id: string;
  name: string;
  phonenumber: string;
  province: string;
  available: boolean;
};

export type Bakery_Exp = {
  id: number;
  quantity: number;
  bakery_detailId: number;
  branchId: number;
};

const Parent = ({ branchs }: DataBranchProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [value, setValue] = React.useState("");
  const [bakerys, setBakerys] = React.useState<BakeryDetail[]>([]);
  const [checkBakery, setCheckBakery] = React.useState<Bakery_Exp[]>([]);

  React.useEffect(() => {
    const fecthData = async () => {
      try {
        const dateTo = date?.toLocaleDateString("en-CA");
        const [bakerysRes, soldRes] = await Promise.all([
          getBakerysAvailable({ branchId: Number(value) }),
          getTrackingExp({ branchId: Number(value), date: dateTo }),
        ]);
        setBakerys(bakerysRes.data.data);
        setCheckBakery(soldRes.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (date && value) {
      fecthData();
    }
  }, [date, value]);

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        {/* Buttons: Stacked on mobile, row on desktop */}
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
          <DeleteAllTrack
            date={date}
            value={value}
            setCheckBakery={setCheckBakery}
          />
        </div>
      </div>
      {/** TABLE TRACKSELL */}
      <div className="px-5 mt-3">
        <TableData
          data={bakerys}
          selectedDate={date}
          value={value}
          checkBakery={checkBakery}
          setCheckBakery={setCheckBakery}
        />
      </div>
    </>
  );
};

export default Parent;
