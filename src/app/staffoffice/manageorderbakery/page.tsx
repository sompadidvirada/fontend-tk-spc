import { Filter } from "lucide-react";
import TableData from "./(component)/TableData";
import { getSupplyer } from "@/app/api/server/supplyer";

// --- DEMO DATA ---
// Each row represents one branch's total status for the day

const TrackAllOrder = async () => {
  const supllyers = await getSupplyer()
  return (
    <div className="flex flex-1 flex-col relative px-4 font-lao mt-3">
      <div className="@container/main flex flex-1 flex-col gap-2 mb-8">
        <div className="font-lao px-4 lg:px-6 ">
          <div className="font-lao flex gap-2 items-center">
            <h2 className="text-xl md:text-2xl font-bold">
              ຈັດການອໍເດີເບເກີລີ້ແຕ່ລະສາຂາ
            </h2>
            <Filter width={24} height={24} />
          </div>
          <p className="text-[12px] text-muted-foreground">
            ຈັດການອໍເດີເບເກີລີສຳລັບແຕ່ລະສາຂາ ຕາມລາຍລະອຽດການຕິດຕາມເບເກີລີ້.
          </p>
        </div>

        <TableData supllyers={supllyers}/>
        {/* --- HEADER --- */}
      </div>
    </div>
  );
};

export default TrackAllOrder;
