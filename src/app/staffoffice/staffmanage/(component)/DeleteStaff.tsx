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
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteStaff } from "@/app/api/client/staff";
import dayjs from "dayjs";
import { Spinner } from "@/components/ui/spinner";

interface EditRoleStaffProps {
  staff: any; // Use your Staff_Office type here
}

export type StaffRole =
  | "ADMIN"
  | "STAFF_SPC"
  | "STAFF_TK"
  | "STAFF_WH"
  | "BARISTAR";

// Simplified mapping: Just Database Key -> Lao Label
const ROLE_LABELS: Record<StaffRole, string> = {
  ADMIN: "ແອັດມິນ",
  STAFF_SPC: "ພະແນກຈັດຊື້",
  STAFF_TK: "ພະນັກງານທຮີຄອຟ",
  STAFF_WH: "ພະນັກງານສາງ",
  BARISTAR: "ບາເລສຕ້າ",
};

const DeleteStaff = ({ staff }: EditRoleStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <UserX className="w-7 h-7" /> ລົບຢູເຊີ
    </DropdownMenuItem>
  );
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ທ່ານຕ້ອງການລົບຢູເຊີ: {staff.name} ແທ້ບໍ່ ?
            </DialogTitle>
          </DialogHeader>
          <ProfileForm staff={staff} setOpen={setOpen} />
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
            ທ່ານຕ້ອງການລົບຢູເຊີ: {staff.name} ແທ້ບໍ່ ?
          </DrawerTitle>
        </DrawerHeader>
        <ProfileForm staff={staff} className="px-4" setOpen={setOpen} />
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

export default DeleteStaff;

function ProfileForm({
  className,
  staff,
  setOpen,
}: {
  className?: string;
  staff: any;
  setOpen: (open: boolean) => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const displayDate = staff?.birthdate
    ? dayjs(staff.birthdate).format("DD/MM/YYYY")
    : "ຍັງບໍ່ມີຂໍ້ມູນ";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await deleteStaff({ id: staff.id });

        toast.success(`ລົບຢູເຊີ ${staff.name} ສຳເລັດ`);
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
      <div className="grid gap-3">
        <Label htmlFor="name" className="font-lao">
          ຮູບໂປຮພາຍ
        </Label>
        <Image
          src={staff.image ? staff.image : "/images/proflie.png"}
          alt={staff.name}
          width={90}
          height={90}
        />
        <Label htmlFor="name" className="font-lao">
          ຊື່ພະນັກງານ
        </Label>
        <Input
          id="name"
          defaultValue={staff.name}
          disabled
          className="bg-muted"
        />
        <Label htmlFor="name" className="font-lao">
          ເບີຕິດຕໍ່
        </Label>
        <Input
          id="phonenumber"
          defaultValue={staff.phonenumber}
          disabled
          className="bg-muted"
        />
        <Label htmlFor="name" className="font-lao">
          ວັນເດືອນ ປິ ເກີດ
        </Label>
        <Input
          id="birdthdate"
          defaultValue={displayDate}
          disabled
          className="bg-muted font-lao"
        />
        <Label htmlFor="role" className="font-lao">
          ຕຳແໜ່ງ
        </Label>
        <Input
          id="role"
          // Direct lookup: Get the label using the role key
          defaultValue={ROLE_LABELS[staff.role as StaffRole] || staff.role}
          disabled
          className="bg-muted font-lao"
        />
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
