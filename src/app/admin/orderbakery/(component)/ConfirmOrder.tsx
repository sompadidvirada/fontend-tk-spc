import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteConfirmOrderBaristar,
  updateConfirmSttAdmin,
} from "@/app/api/client/order_bakery";
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
  supplyerId: string;
}

const ConfirmOrder = ({ selectDate, value, supplyerId }: Prop) => {
  const [confirmStt, setConfirmStt] = useState<ConfirmOrders | null>();

  useEffect(() => {
    const fecthData = async () => {
      const dateTo = selectDate ? selectDate.toLocaleDateString("en-CA") : "";
      try {
        const ress = await checkConfirmStatus({
          confirm_date: dateTo,
          branchId: Number(value),
        });
        console.log(ress);
        setConfirmStt(ress.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (selectDate && value && supplyerId) {
      fecthData();
    }
  }, [selectDate, value, supplyerId]);

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

  const handleDelteCfBaristar = async (id: number) => {
    try {
      const ress = await deleteConfirmOrderBaristar(id);
      console.log(ress);
      setConfirmStt(null);
    } catch (err) {
      console.log(err);
      toast.error("error");
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
      {confirmStt != null && confirmStt.baristar_confirm_stt == true && (
        <Button
          variant="outline"
          className="font-lao bg-red-300 text-red-800"
          disabled={confirmStt?.baristar_confirm_stt ? false : true}
          onClick={() => handleDelteCfBaristar(confirmStt?.id)}
        >
          <CheckCheck className="mr-1 h-4 w-4 " /> cancel CF BR
        </Button>
      )}
    </>
  );
};

export default ConfirmOrder;
