import { BadgeDollarSign, House } from "lucide-react";
import React from "react";
import ParentCompo from "./(component)/ParentCompo";
import { getAllBranch } from "@/app/api/server/branchs";
import { getAllMaterial } from "@/app/api/server/material";

const MaterialRequisition = async () => {
  const branchs = await getAllBranch();
  const materiant_Variant = await getAllMaterial();
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-5">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <div className="font-lao flex gap-2 items-center">
              <h2 className="text-xl md:text-2xl font-bold">
                ຄີຍອດເບີກວັດຖຸດິບແຕ່ລະສາຂາ.
              </h2>
              <House width={24} height={24} />
            </div>
            <p className="text-[12px] text-muted-foreground">
              ອັປໂຫລດຍອດຂາຍວັດຖຸດິບຂອງແຕ່ລະສາຂາຕາມຍອດເບີກຈາກລະບົບ.
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section: Buttons and Search */}
      <ParentCompo branchs={branchs} materiant_Variant={materiant_Variant} />

      {/** FOOTER CREDIT OF THE PAGE */}
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default MaterialRequisition;
