"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2 } from "lucide-react";
import BranchLocationPicker from "./BranchLocationPicker";
import { updateDetailBranch } from "@/app/api/client/branchs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Branch = {
  id: number;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

const EditBranch = ({ branch }: { branch: Branch }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: branch.name,
    province: branch.province,
    location: { lat: branch.lat, lng: branch.lng },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Logic to update branch via API
    try {
      await updateDetailBranch(formData, branch.id);
      router.refresh()
      toast.success("ອັປເດດສາຂາສຳເລັດ")
    } catch (err) {
      console.log(err);
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 cursor-pointer"
        >
          <Edit2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-lao">
        <DialogHeader>
          <DialogTitle>ແກ້ໄຂຂໍ້ມູນສາຂາ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">ຊື່ສາຂາ</Label>
            <Input id="name" defaultValue={branch.name} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="province">ແຂວງ</Label>
            <Input id="province" defaultValue={branch.province} />
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <div className="grid gap-2">
              <Label>ເລືອກສະຖານທີ່ໃນແຜນທີ່ (ຄລິກເພື່ອປ່ຽນ)</Label>
              <BranchLocationPicker
                value={formData.location}
                onChange={(val) => setFormData({ ...formData, location: val })}
              />
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="text-[10px] bg-slate-100 p-1 rounded text-center">
                  Lat: {formData?.location?.lat?.toFixed(6)}
                </div>
                <div className="text-[10px] bg-slate-100 p-1 rounded text-center">
                  Lng: {formData?.location?.lng?.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 w-full"
            >
              ບັນທຶກການປ່ຽນແປງ
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBranch;
