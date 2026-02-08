import { updateStockRemain } from "@/app/api/client/stock_requisition";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import React from "react";
import { toast } from "sonner";

const EditStockDialog = ({ isOpen, setIsOpen, data, fecthStockRemain }: any) => {
  if (!data) return null;


  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const count = Number(formData.get("count"));

    try {
      await updateStockRemain({
        count: count,
        base_count_variant: data.conver_to_base,
        material_variantId: data.variantId,
      }, data.id);
      toast.success("ອັປເດດສະຕ໋ອກສຳເລັດ.")
      fecthStockRemain()
    } catch (err) {
      console.log(err);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="font-lao">
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂສະຕ໋ອກ</DialogTitle>
          <DialogDescription>
            {data.materialName} - {data.variantName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">ຈຳນວນຄົງເຫຼືອປະຈຸບັນ</label>
            <Input
              type="number"
              name="count"
              defaultValue={data.currentStock}
              className="w-full"
            />
          </div>
          <Button type="submit" className="w-full">
            ບັນທຶກ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStockDialog;
