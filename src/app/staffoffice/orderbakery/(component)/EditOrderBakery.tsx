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
import { toast } from "sonner";
import { Order_Bakery } from "./ParentContent";
import { updateOrderBakery } from "@/app/api/client/order_bakery";
export interface EditTrackSellProps {
  id: string | number;
  setCheckOrderBakery: React.Dispatch<React.SetStateAction<Order_Bakery[]>>;
}

type Edit_From = {
  order_set: number | null;
};

const EditOrderBakery = ({ id, setCheckOrderBakery }: EditTrackSellProps) => {
     const handleEditSell = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
    
        const dataToApi: Edit_From = {
          order_set: formData.get("order_set") as number | null,
        };
    
        try {
          await updateOrderBakery({ order_set: dataToApi.order_set as number }, id as number);
          setCheckOrderBakery((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, order_set: dataToApi.order_set as number }
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
                  <Label htmlFor="order_set">ຍອດຂາຍ</Label>
                  <Input
                    id="order_set"
                    name="order_set"
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
  )
}

export default EditOrderBakery