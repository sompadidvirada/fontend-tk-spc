"use client";
import React from "react";
import CalendarCompo from "./Calendar";
import SelectBranch from "./SelectBranch";
import ToggleBakeryList from "./ToggleBakeryList";
import DeleteAllTrack from "./DeleteAllTrack";
import UploadFile from "./UploadFile";
import TableData, { BakeryDetail } from "./TableData";
import {
  getBakerysAvailable,
  getBakerySold,
} from "@/app/api/client/trackingbakery";

export interface DataBranchProps {
  branchs: Branch_type[];
  lang?: string
}

export type Branch_type = {
  id: string;
  name: string;
  phonenumber: string;
  province: string;
  available: boolean;
};

export type Bakery_sold = {
  id: number;
  quantity: number;
  bakery_detailId: number;
  branchId: number;
};

const ParentTable = ({ branchs }: DataBranchProps) => {
  const getYesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
  };

  const [date, setDate] = React.useState<Date | undefined>(getYesterday());
  const [value, setValue] = React.useState("");
  const [bakerys, setBakerys] = React.useState<BakeryDetail[]>([]);
  const [checkBakery, setCheckBakery] = React.useState<Bakery_sold[]>([]);

  React.useEffect(() => {
    const fecthData = async () => {
      try {
        const dateTo = date?.toLocaleDateString("en-CA");
        const [bakerysRes, soldRes] = await Promise.all([
          getBakerysAvailable({ branchId: Number(value) }),
          getBakerySold({ branchId: Number(value), date: dateTo }),
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
          <CalendarCompo selectedDate={date} onDateChange={setDate} forOrder={false}/>
          <SelectBranch
            branchs={branchs}
            value={value}
            setValue={setValue}
            isForReport={false}
          />
          <ToggleBakeryList />
          <DeleteAllTrack
            date={date}
            value={value}
            setCheckBakery={setCheckBakery}
          />
          <UploadFile
            bakerys={bakerys}
            selectedDate={date}
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

export default ParentTable;
