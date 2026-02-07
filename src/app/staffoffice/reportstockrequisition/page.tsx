import { getAllMaterial } from "@/app/api/server/material";
import { BadgeDollarSign } from "lucide-react";
import ParentCompo from "./(component)/ParentCompo";
import { getAllBranch } from "@/app/api/server/branchs";

const page = async () => {
  const materials = await getAllMaterial();
  const branch = await getAllBranch();
  return (
    <div className="flex flex-1 flex-col relative mt-3">
      <div className="@container/main flex flex-1 flex-col gap-2 mb-8">
        {" "}
        {/* Header Section */}
        <div className="px-5">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="font-lao">
              <div className="font-lao flex gap-2 items-center">
                <h2 className="text-xl md:text-2xl font-bold">
                  ລາຍງານຍອດເບີກວັດຖຸດິບ
                </h2>
                <BadgeDollarSign width={24} height={24} />
              </div>
              <p className="text-[12px] text-muted-foreground">
                ເບີ່ງລາຍງານຍອດເບີກວັດຖຸດິບແຕ່ລະສາຂາ.
              </p>
            </div>
          </div>
        </div>
        <div className="px-5">
          <ParentCompo branch={branch} materials={materials}/>
        </div>
      </div>
    </div>
  );
};

export default page;
