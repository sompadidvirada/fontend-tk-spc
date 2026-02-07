import { CakeSlice } from "lucide-react";
import React from "react";
import ParentContent from "./(component)/ParentContent";
import { getAllBranch } from "@/app/api/server/branchs";

const OrderBakery = async () => {
  const branchs = await getAllBranch();
  return (
    <div className="flex flex-1 flex-col relative">
      <div className="@container/main flex flex-1 flex-col gap-2 mb-8">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Header Section */}
          <div className="font-lao px-4 lg:px-6 ">
            <div className="font-lao flex gap-2 items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                ຈັດການອໍເດີເບເກີລີ້ແຕ່ລະສາຂາ
              </h2>
              <CakeSlice width={24} height={24} />
            </div>
            <p className="text-[12px] text-muted-foreground">
              ຈັດການອໍເດີເບເກີລີສຳລັບແຕ່ລະສາຂາ ຕາມລາຍລະອຽດການຕິດຕາມເບເກີລີ້.
            </p>
          </div>
        </div>
        {/**CONTENT OF THE PAGE */}
        <div className="px-4 lg:px-6">
          <ParentContent branchs={branchs} />
        </div>
      </div>

      {/**FOOTER CREDIT OF THE PAGE */}
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default OrderBakery;
