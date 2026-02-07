import { CalendarFold } from "lucide-react";
import CalendarOrder from "./(component)/CalendarOrder";
import { getSupplyerSpc } from "@/app/api/server/supplyer";
import { useSession } from "@/app/staffbaristar/SessionProvider";

const CalendarOrderSpc = async () => {
  const supplyer_spc = await getSupplyerSpc();
  return (
    <div className="flex flex-1 flex-col relative px-4 font-lao mt-3">
      <div className="px-4 lg:px-6 mb-4">
        <div className="flex gap-2 items-center">
          <h2 className="text-xl md:text-2xl font-bold">ແຜນຈັດຊື້</h2>
          <CalendarFold width={24} height={24} />
        </div>
        <p className="text-[12px] text-muted-foreground">
          ເປັນຫນ້າຕ່າງໃນການຈັດການເບເກີລີ້ ເພື່ອນຳໃຊ້ເຂົ້າໃນການຕິດຕາມເບເກີລີ້.
        </p>
      </div>

      {/**FULLCALENDAR FOR ORDER SPC */}

      <CalendarOrder supplyer_spc={supplyer_spc} />
    </div>
  );
};

export default CalendarOrderSpc;
