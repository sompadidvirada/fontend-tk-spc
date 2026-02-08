import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Stock_Requisition } from "./TableMaterial";
import { updateStock } from "@/app/api/client/stock_requisition";
import { Material_Variant } from "../../material/page";

export interface EditTrackSellProps {
  id: string | number;
  setCheck: React.Dispatch<React.SetStateAction<Stock_Requisition[]>>;
  variant: Material_Variant;
}

type Edit_From = {
  quantity: number;
  base_quantity: number;
};

const EditRequisition = ({ id, setCheck, variant }: EditTrackSellProps) => {
  const handleEditSell = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const dataToApi: Edit_From = {
      quantity: Number(formData.get("quantity")),
      base_quantity: Number(variant.conver_to_base),
    };

    try {
      const ress = await updateStock(dataToApi, Number(id));
      setCheck((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: dataToApi.quantity }
            : item,
        ),
      );
      toast.success(`ອັປເດດ ສຳເລັດ`, {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    } catch (err) {
      console.log(err);
      toast.error(`ລອງໃຫ່ມພາຍຫລັງ`, {
        cancel: {
          label: "x",
          onClick: () => {},
        },
      });
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Pencil className="h-4 w-4 text-gray-500" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[325px] font-lao">
        {/* PLACE FORM HERE */}
        <form onSubmit={handleEditSell}>
          <DialogHeader>
            <DialogTitle>ແກ້ໄຂ້ຍອດເບີກວັດຖຸດິບ</DialogTitle>
            <DialogDescription>ແກ້ໄຂຈຳນວນຍອດເບີກວັດຖຸດິບ.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="quantity">ຍອດເບິກວັດຖຸດິບ</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                required
                min={0}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                ຍົກເລີກ
              </Button>
            </DialogClose>
            <Button type="submit">ສົ່ງຟອມ</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditRequisition;
