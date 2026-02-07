"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useMediaQuery } from "@/hooks/use-mobile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Croissant, UserCog } from "lucide-react";
import { Bakery_Detail } from "./TableBakery";
import { NumericFormat } from "react-number-format";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { changeStatusBakery } from "@/app/api/client/bakery";
import { Spinner } from "@/components/ui/spinner";

interface Edit_BakeryProps {
  bakery_selected: Bakery_Detail;
}

const ChangeStatus = ({ bakery_selected }: Edit_BakeryProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <ArrowUpDown className="w-7 h-7" />
      ແກ້ໄຂສະຖານະ
    </DropdownMenuItem>
  );
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ແກ້ໄຂສະຖານະ
            </DialogTitle>
            <DialogDescription className="font-lao">
              ແກ້ໄຂສະຖານະຍອດຂາຍສຳລັບເມນູ {bakery_selected.name}
            </DialogDescription>
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
            ແກ້ໄຂສະຖານະ: {bakery_selected.name}
          </DrawerTitle>
        </DrawerHeader>
        <ProfileForm
          bakery_selected={bakery_selected}
          setOpen={setOpen}
          className="px-4"
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

export default ChangeStatus;

function ProfileForm({
  className,
  bakery_selected,
  setOpen,
}: {
  className?: string;
  bakery_selected: Bakery_Detail;
  setOpen: (open: boolean) => void;
}) {
  const [status, setStatus] = React.useState(bakery_selected.status);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleUpdateBakery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    if (status === bakery_selected.status) {
      setOpen(false);
      return (
        toast.error(`ບໍ່ມີການປ່ຽນແປງສະຖານະ`),
        {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        }
      );
    }
    const id = formData.get("id") as string;
    startTransition(async () => {
      try {
        await changeStatusBakery(status, id);
        toast.success(`ອັບເດດລາຍການສຳເລັດ`, {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        });
        router.refresh();
        setOpen(false);
      } catch (err) {
        console.log(err);
        toast.error("ມີບາງຢ່າງຜິດພາດ", {
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
    <form
      onSubmit={handleUpdateBakery}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="grid gap-3 font-lao">
        <input type="hidden" name="id" value={bakery_selected.id} />
        <Label htmlFor="name" className="font-lao">
          ຮູບໂປຮພາຍ
        </Label>
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
          disabled
          defaultValue={bakery_selected.name}
          className="bg-muted"
        />

        <Label htmlFor="role" className="font-lao">
          ລາລາຕົ້ນທຶນ
        </Label>
        <NumericFormat
          customInput={Input}
          thousandSeparator={true}
          valueIsNumericString={true}
          placeholder="ລາຄາຕົ້ນທຶນ"
          disabled
          defaultValue={bakery_selected.price}
          className="font-lao"
        />
        <Label htmlFor="role" className="font-lao">
          ລາຄາຂາຍ
        </Label>
        <NumericFormat
          customInput={Input} // Use Shadcn Input as the base
          thousandSeparator={true}
          valueIsNumericString={true}
          placeholder="ລາຄາຂາຍ"
          disabled
          defaultValue={bakery_selected.sell_price}
          className="font-lao"
        />

        {/* 2. Controlled Select component */}
        <Label htmlFor="status">ສະຖານະ</Label>
        <Select onValueChange={setStatus} value={status}>
          <SelectTrigger className="border-slate-200 w-full">
            <SelectValue placeholder="ເລືອກໝວດໝູ່" defaultValue={status} />
          </SelectTrigger>
          <SelectContent className="font-lao">
            <SelectItem value="A">{`A (ຂາຍດີທີສຸດ)`}</SelectItem>
            <SelectItem value="B">{`B (ຂາຍປົກກະຕິ)`}</SelectItem>
            <SelectItem value="C">{`C (ເຝົ້າລະວັງ)`}</SelectItem>
            <SelectItem value="F">{`F (ຕັດອອກ)`}</SelectItem>
            <SelectItem value="A LPB">{`A LPB (ຂາຍດີທີສຸດ)`}</SelectItem>
            <SelectItem value="B LPB">{`B LPB (ຂາຍປົກກະຕິ)`}</SelectItem>
            <SelectItem value="C LPB">{`C LPB (ເຝົ້າລະວັງ)`}</SelectItem>
            <SelectItem value="F LPB">{`F LPB (ຕັດອອກ)`}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending} className="font-lao w-full">
        {isPending ? (
          <>
            <Spinner className="mr-2 h-4 w-4" /> ກຳລັງສົ່ງ...
          </>
        ) : (
          "ສົ່ງຟອມ"
        )}
      </Button>
    </form>
  );
}
