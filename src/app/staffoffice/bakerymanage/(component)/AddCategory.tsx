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
import { CakeSlice, ChartGantt, UserRoundPlus } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { createCategoryBakery } from "@/app/api/client/bakery";
import { useRouter } from "next/navigation";

const AddCategory = () => {
  const [open, setOpen] = React.useState(false);

  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("name") as string;

    startTransition(async () => {
      try {
        const ress = await createCategoryBakery({ name: categoryName });
        toast.success(`ເພີ່ມເບເກີລີ້ ${categoryName} ສຳເລັດ`, {
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
          <ChartGantt className="mr-1 h-4 w-4" /> ເພີ່ມໝວດໝູ່
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106 font-lao">
        {/* 2. Form wraps the content inside the Dialog */}
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>ເພີ່ມໝວດໝູ່</DialogTitle>
            <DialogDescription className="text-[12px]">
              ເພີ່ມໝວດໝູ່ຂອງເບເກີລີ້ແຕ່ລະປະເພດ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="name">ຊື່ໝວດໝູ່</Label>
              <Input id="name" name="name" placeholder="ຊື່ເບໝວດໝູ່" required />
            </div>
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

export default AddCategory;
