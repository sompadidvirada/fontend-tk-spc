"use client";
import React from "react";
import { DataBranchProps } from "../../tracksell/(component)/ParentTable";
import { BakeryDetail } from "../../tracksell/(component)/TableData";
import {
  getBakerysAvailable,
  getBakerySend,
} from "@/app/api/client/trackingbakery";
import CalendarCompo from "../../tracksell/(component)/Calendar";
import SelectBranch from "../../tracksell/(component)/SelectBranch";
import ToggleBakeryList from "../../tracksell/(component)/ToggleBakeryList";
import TableData from "./TableData";
import DeleteAllTrack from "./DeleteAllTrack";
import UploadFile from "./UploadFile";

export type Bakery_send = {
  id: number;
  quantity: number;
  bakery_detailId: number;
  branchId: number;
};

const ParentTable = ({ branchs }: DataBranchProps) => {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [value, setValue] = React.useState("");
  const [bakerys, setBakerys] = React.useState<BakeryDetail[]>([]);
  const [checkBakery, setCheckBakery] = React.useState<Bakery_send[]>([]);

  React.useEffect(() => {
    const fecthData = async () => {
      try {
        const dateTo = date?.toLocaleDateString("en-CA");
        const [bakerysRes, soldRes] = await Promise.all([
          getBakerysAvailable({ branchId: Number(value) }),
          getBakerySend({ branchId: Number(value), date: dateTo }),
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
          <SelectBranch branchs={branchs} value={value} setValue={setValue} isForReport={false}/>
          <ToggleBakeryList />
          <DeleteAllTrack
            date={date}
            value={value}
            setCheckBakery={setCheckBakery}
          />
          <UploadFile  bakerys={bakerys}
            selectedDate={date}
            value={value}
            setCheckBakery={setCheckBakery} />
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
