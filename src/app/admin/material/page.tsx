import { Button } from "@/components/ui/button";
import { CakeSlice, DiamondPlus } from "lucide-react";
import React from "react";
import TableMaterial from "./(component)/TableMaterial";
import AddMaterial from "./(component)/AddMaterial";
import AddCategoryMaterial from "./(component)/AddCategoryMaterial";
import {
  getAllCategoryMaterail,
  getAllMaterial,
} from "@/app/api/server/material";
import AddSupplyer from "./(component)/AddSupplyer";
import DetailSupplyer, { Supplyer_Spc } from "./(component)/DetailSupplyer";
import { getSupplyerSpc } from "@/app/api/server/supplyer";

export type Material_Variant = {
  id: number;
  variant_name: string;
  materialId: number;
  barcode: string;
  price_kip: number;
  sell_price_kip: number;
  price_bath: number;
  sell_price_bath: number;
  quantity_in_parent: number | null;
  parent_variantId: number | null;
  conver_to_base: number;
};

export interface Material {
  id: number;
  name: string;
  descriptions: string;
  category_materialId: number | null;
  min_order: number;
  image: string;
  material_variant: Material_Variant[];
  category_material: Category_Material;
  supplierSpc: Supplyer_Spc | null;
  supplier_spcId: number | null;
}



export type Category_Material = {
  id: number;
  name: string;
};


// Inside your return:

const Material = async () => {
  const category = await getAllCategoryMaterail();
  const materials = await getAllMaterial();
  const supplyer_spc = await getSupplyerSpc();
  return (
    <div className="mx-3 min-h-[80vh] pb-3 relative mt-3">
      {/* Header Section */}
      <div className="px-5">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="font-lao">
            <h2 className="text-xl md:text-2xl font-bold">ຈັດການວັດຖຸດິບ</h2>
            <p className="text-[12px] text-muted-foreground">
              ຈັດການເພີ່ມ ຫລືແກ້ໄຂ້ວັດຖຸດິບທີ່ຮັບເຂົ້າສາງ ແລະ
              ຈັດສົ່ງໃຫ້ແຕ່ລະສາຂາ.
            </p>
          </div>
        </div>
      </div>
      {/**button for manage material */}
      <div className="flex flex-col lg:flex-row justify-between px-5 mt-5 gap-4">
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <AddMaterial />
          <AddCategoryMaterial />
          <AddSupplyer />
        </div>
        <div className="grid grid-cols-1  md:flex md:flex-row gap-3 h-6 md:h-10">
          <DetailSupplyer supplyer_spc={supplyer_spc} />
          <Button
            variant="outline"
            size="sm"
            className="font-lao justify-start h-6 md:h-10 max-w-50"
          >
            <DiamondPlus className="mr-1 h-4 w-4" /> ລາຍລະອຽດໝວດໝູ່ວັດຖຸດິບ
          </Button>
        </div>
      </div>
      {/** table data for bakery detail */}
      <div className="px-5 mt-3 mb-5">
        <TableMaterial materials={materials} category={category} supplyer_spc={supplyer_spc}/>
      </div>
      <p className="absolute bottom-px right-4 text-black text-[12px] opacity-80 md:text-xs font-lao">
        Copyright © 2026 Sompadid virada. All rights reserved.
      </p>
    </div>
  );
};

export default Material;
