"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CakeSlice, HousePlus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { createBranchs } from "@/app/api/client/branchs";
import BranchLocationPicker from "./BranchLocationPicker";

const AddBranch = () => {
  const [open, setOpen] = React.useState(false);
  const [province, setProvince] = React.useState<string>("");
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [location, setLocation] = React.useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    if (province) formData.append("province", province);

    const data = Object.fromEntries(formData) as Record<string, string>;
    startTransition(async () => {
      try {
        await createBranchs({
          name: data.name,
          province: data.province,
          lat: location?.lat,
          lng: location?.lng,
        });
        toast.success(`ເພີ່ມສາຂາ ${data.name} ສຳເລັດ`, {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        });
        router.refresh();
      } catch (error: any) {
        console.error("Error sending data:", error);
        toast.error("ເກີດຂໍ້ຜິດຜາດຂັ້ນຕອນສ້າງ", {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        });
      } finally {
        setOpen(false);
        setLocation(null)
        setProvince("");
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* 1. Trigger is outside the form */}
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="font-lao justify-start h-6 md:h-10 max-w-50"
        >
          <HousePlus className="mr-1 h-4 w-4" /> ເພີ່ມສາຂາ
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106 font-lao">
        {/* 2. Form wraps the content inside the Dialog */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>ເພີ່ມສາຂາ</DialogTitle>
            <DialogDescription className="text-[12px]">
              ເພີ່ມລາຍລະອຽດສາຂາ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              {/** BRANCH NAME */}
              <Label htmlFor="name">ຊື່ສາຂາ</Label>
              <Input id="name" name="name" placeholder="ຊື່ສາຂາ" required />
              {/** PROVINCE OF THE BRANCH */}
              <Label htmlFor="province">ແຂວງ</Label>
              <Select onValueChange={setProvince} value={province}>
                <SelectTrigger className="border-slate-200 w-full">
                  <SelectValue
                    placeholder="ເລືອກແຂວງ"
                    defaultValue={province}
                  />
                </SelectTrigger>
                <SelectContent className="font-lao">
                  <SelectItem value={"ນະຄອນຫຼວງວຽງຈັນ"}>
                    ນະຄອນຫຼວງວຽງຈັນ
                  </SelectItem>
                  <SelectItem value={"ໄຊສົມບູນ"}>ໄຊສົມບູນ</SelectItem>
                  <SelectItem value={"ຊຽງຂວາງ"}>ຊຽງຂວາງ</SelectItem>
                  <SelectItem value={"ວຽງຈັນ"}>ວຽງຈັນ</SelectItem>
                  <SelectItem value={"ເຊກອງ"}>ເຊກອງ</SelectItem>
                  <SelectItem value={"ສະຫວັນນະເຂດ"}>ສະຫວັນນະເຂດ</SelectItem>
                  <SelectItem value={"ສາລະວັນ"}>ສາລະວັນ</SelectItem>
                  <SelectItem value={"ໄຊຍະບູລີ"}>ໄຊຍະບູລີ</SelectItem>
                  <SelectItem value={"ຜົງສາລີ"}>ຜົງສາລີ</SelectItem>
                  <SelectItem value={"ອຸດົມໄຊ"}>ອຸດົມໄຊ</SelectItem>
                  <SelectItem value={"ຫຼວງພະບາງ"}>ຫຼວງພະບາງ</SelectItem>
                  <SelectItem value={"ຫຼວງນ້ຳທາ"}>ຫຼວງນ້ຳທາ</SelectItem>
                  <SelectItem value={"Khammouane"}>ຄຳມ່ວນ</SelectItem>
                  <SelectItem value={"ຈຳປາສັກ"}>ຈຳປາສັກ</SelectItem>
                  <SelectItem value={"ບໍລິຄຳໄຊ"}>ບໍລິຄຳໄຊ</SelectItem>
                  <SelectItem value={"ບໍແກ້ວ"}>ບໍແກ້ວ</SelectItem>
                  <SelectItem value={"ອັດຕະປື"}>ອັດຕະປື</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-2">
            <Label>ເລືອກຕຳແໜ່ງສາຂາ</Label>
            <BranchLocationPicker value={location} onChange={setLocation} />

            {location && (
              <p className="text-xs text-muted-foreground">
                Lat: {location.lat}, Lng: {location.lng}
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isPending}>
                ຍົກເລີກ
              </Button>
            </DialogClose>
            {/* 3. Ensure this is type="submit" */}
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" /> ກຳລັງສົ່ງ...
                </>
              ) : (
                "ສົ່ງຟອມ"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBranch;
