import React from "react";
import AddBakery from "./(component)/AddBakery";
import AddCategory from "./(component)/AddCategory";
import TableBakery from "./(component)/TableBakery";
import { getAllBakery, getAllCategoryBakery } from "@/app/api/server/bakery";
import Addsuppyler from "./(component)/Addsuppyler";
import { getSupplyer } from "@/app/api/server/supplyer";
import DetailSupplyer from "./(component)/DetailSupplyer";

const BakeryManage = async () => {
  const bakeryData = await getAllBakery();
  const categoryBakery = await getAllCategoryBakery();
  const supplyer = await getSupplyer()
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <h2 className="text-xl md:text-2xl font-bold">ຈັດການເບເກີລີ້</h2>
            <p className="text-[12px] text-muted-foreground">
              ເປັນຫນ້າຕ່າງໃນການຈັດການເບເກີລີ້
              ເພື່ອນຳໃຊ້ເຂົ້າໃນການຕິດຕາມເບເກີລີ້.
            </p>
          </div>
        </div>
      </div>
      {/* Controls Section: Buttons and Search */}
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        {/* Buttons: Stacked on mobile, row on desktop */}
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <AddBakery categoryBakery={categoryBakery} />
          <AddCategory />
          <Addsuppyler />
        </div>
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <DetailSupplyer supplyers={supplyer} />
        </div>
      </div>
      {/** table data for bakery detail */}
      <div className="px-5 mt-3">
        <div>
          <TableBakery data={bakeryData} categoryBakery={categoryBakery} supplyer={supplyer}/>
        </div>
      </div>
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default BakeryManage;
