import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RotateCcw, UserRoundPlus } from "lucide-react";
import React, { memo } from "react";
import { Bakery_sold } from "./ParentTable";
import { toast } from "sonner";
import { deleteAllTrackingSell } from "@/app/api/client/trackingbakery";

interface DeleteProps {
  date: Date | undefined;
  value: string;
  setCheckBakery: React.Dispatch<React.SetStateAction<Bakery_sold[]>>;
}

const DeleteAllTrack = ({ date, value, setCheckBakery }: DeleteProps) => {
  const handleDeleteAllTrack = async () => {
    const dateToSend = date?.toLocaleDateString("en-CA");
    try {
      await deleteAllTrackingSell({
        date: dateToSend,
        branchId: Number(value),
      });
      setCheckBakery([])
      toast.success(`ລົບຍອດຂາຍທັງຫມົດຂອງວັນທີ ${dateToSend} ສຳເລັດ`, {
        cancel: {
          label: "x",
          onClick: ()=>{}
        }
      })
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫຼັງ", {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    }
  };
  return (
    <Button
      variant="outline"
      className="font-lao justify-start h-8 md:h-9 max-w-50"
      onClick={handleDeleteAllTrack}
    >
      <RotateCcw className="mr-1 h-4 w-4" /> ລົບທັງໝົດ
    </Button>
  );
};

export default memo(DeleteAllTrack);
