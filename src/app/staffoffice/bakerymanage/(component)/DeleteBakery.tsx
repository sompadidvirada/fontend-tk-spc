"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Croissant } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Bakery_Detail } from "./TableBakery";
import { deleteBakery } from "@/app/api/client/bakery";
import { Spinner } from "@/components/ui/spinner";

interface Edit_BakeryProps {
  bakery_selected: Bakery_Detail;
}

const DeleteBakery = ({ bakery_selected }: Edit_BakeryProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <Croissant className="w-7 h-7" />
      ລົບຂໍ້ມູນ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ທ່ານຕ້ອງການລົບເບເກີລີ້: {bakery_selected.name} ແທ້ບໍ່ ?
            </DialogTitle>
          </DialogHeader>
          <ProfileForm bakery_selected={bakery_selected} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="font-lao">
            ທ່ານຕ້ອງການລົບເບເກີລີ້: {bakery_selected.name} ແທ້ບໍ່ ?
          </DrawerTitle>
        </DrawerHeader>
        <ProfileForm
          bakery_selected={bakery_selected}
          className="px-4"
          setOpen={setOpen}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" className="font-lao">
              ຍົກເລີກ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteBakery;

function ProfileForm({
  className,
  bakery_selected,
  setOpen,
}: {
  className?: string;
  bakery_selected: any;
  setOpen: (open: boolean) => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const id = formData.get("id");
    startTransition(async () => {
      try {
        await deleteBakery(Number(id));
        toast.success(`ລົບຢູລາຍການ ${bakery_selected.name} ສຳເລັດ`);
        router.refresh();
      } catch (err) {
        console.log(err);
        toast.error("ລອງໃຫ່ມພາຍຫລັງ");
      } finally {
        setOpen(false);
      }
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="grid gap-3 font-lao">
        <input type="hidden" name="id" value={bakery_selected.id} />
        <Label htmlFor="name">ຮູບພາບ</Label>
        <Image
          src={
            bakery_selected.image
              ? bakery_selected.image
              : "/images/proflie.png"
          }
          alt={bakery_selected.name}
          width={90}
          height={90}
        />
        <Label htmlFor="name">ຊື່ເບເກີລີ້</Label>
        <Input
          id="name"
          defaultValue={bakery_selected.name}
          disabled
          className="bg-muted"
        />
        <Label htmlFor="name">ໝວດໝູ່</Label>
        <Input
          id="category"
          defaultValue={bakery_selected.bakeryCategory.name}
          disabled
          className="bg-muted"
        />
        <Label htmlFor="name">ສະຖານະຍອດຂາຍ</Label>
        <Input
          id="status"
          defaultValue={bakery_selected.status}
          disabled
          className="bg-muted"
        />
      </div>
      <Button type="submit" disabled={isPending} className="font-lao w-full">
        {isPending ? <Spinner className="h-4 w-4 animate-spin" /> : "ຢືນຢັນ"}
      </Button>
    </form>
  );
}
