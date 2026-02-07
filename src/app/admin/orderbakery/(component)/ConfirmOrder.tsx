import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { updateConfirmSttAdmin } from "@/app/api/client/order_bakery";
import { checkConfirmStatus } from "@/app/api/client/baristar";

export interface ConfirmOrders {
  id: number;
  baristar_confirm_stt: boolean;
  admin_confirm_stt: boolean;
  branchId: number;
}

interface Prop {
  selectDate: Date | undefined;
  value: string;
}

const ConfirmOrder = ({ selectDate, value }: Prop) => {
  const [confirmStt, setConfirmStt] = useState<ConfirmOrders>();


  useEffect(() => {
    const fecthData = async () => {
      const dateTo = selectDate ? selectDate.toLocaleDateString("en-CA") : "";
      try {
        const ress = await checkConfirmStatus({
          confirm_date: dateTo,
          branchId: Number(value),
        });
        setConfirmStt(ress.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (selectDate && value) {
      fecthData();
    }
  }, [selectDate, value]);

  const handleUpdateConfirmStt = async (
    admin_stt: boolean,
    id: number | undefined,
  ) => {
    if (!id) {
      return toast.error("ລອງໃຫ່ມພາຍຫລັງ.");
    }
    try {
      const ress = await updateConfirmSttAdmin(
        { admin_confirm_stt: admin_stt },
        id,
      );
      setConfirmStt(ress.data);
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫລັງ.");
    }
  };

  return (
    <>
      {confirmStt?.admin_confirm_stt ? (
        <Button
          variant="outline"
          className="font-lao bg-red-300 text-red-800"
          disabled={confirmStt?.baristar_confirm_stt ? false : true}
          onClick={() => handleUpdateConfirmStt(false, confirmStt?.id)}
        >
          <CheckCheck className="mr-1 h-4 w-4 " /> ຍົກເລີກຢືນຢັນ
        </Button>
      ) : (
        <Button
          variant="outline"
          className="font-lao"
          disabled={!confirmStt?.baristar_confirm_stt ? true : false}
          onClick={() => handleUpdateConfirmStt(true, confirmStt?.id)}
        >
          <CheckCheck className="mr-1 h-4 w-4 " /> ຢືນຢັນອໍເດີ
        </Button>
      )}
    </>
  );
};

export default ConfirmOrder;
