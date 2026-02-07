import { School } from "lucide-react";
import React from "react";
import AddBranch from "./(component)/AddBranch";
import BranchMap from "./(component)/BranchMap";
import { getAllBranch } from "@/app/api/server/branchs";
import DetailBranch from "./(component)/DetailBranch";
import MapSection from "./(component)/MapSection";

const page = async () => {
  const branchs = await getAllBranch()
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <div className="font-lao flex gap-2 items-center">
              <h2 className="text-xl md:text-2xl font-bold">ຈັດການສາຂາ</h2>
              <School width={24} height={24} />
            </div>
            <p className="text-[12px] text-muted-foreground">
              ຈັດການລາຍລະອຽດຂອງແຕ່ລະສາຂາ ບໍ່ວາຈະເປັນ ຊື່ ເບີຕິດຕໍ່ ແຜນທີ່ສາຂາ.
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section: Buttons and Search */}
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <AddBranch />
          <DetailBranch branchs={branchs} />
        </div>
      </div>
      {/* Mapbox Section */}
      <div className="px-5 my-6">
        <MapSection branchs={branchs}/>
      </div>
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default page;
