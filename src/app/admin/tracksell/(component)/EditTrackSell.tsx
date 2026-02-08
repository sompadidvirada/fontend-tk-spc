import { editTrackSell } from "@/app/api/client/trackingbakery";
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
import { Bakery_sold } from "./ParentTable";
import { toast } from "sonner";

export interface EditTrackSellProps {
  id: string | number;
  setCheckBakery: React.Dispatch<React.SetStateAction<Bakery_sold[]>>;
}

type Edit_From = {
  quantity: number | null;
};

const EditTrackSell = ({ id, setCheckBakery }: EditTrackSellProps) => {
  const handleEditSell = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const dataToApi: Edit_From = {
      quantity: formData.get("quantity") as number | null,
    };

    try {
      await editTrackSell({ quantity: dataToApi.quantity as number }, id);
      setCheckBakery((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: dataToApi.quantity as number }
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
            <DialogTitle>ແກ້ໄຂ້ຍອດຂາຍ</DialogTitle>
            <DialogDescription>ແກ້ໄຂຈຳນວນຍອດຂາຍກ່ອນໜ້າ.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="quantity">ຍອດຂາຍ</Label>
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

export default EditTrackSell;
