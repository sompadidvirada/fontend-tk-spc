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
  DrawerDescription,
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
import { updateAvailableStaff, updateStaffRole } from "@/app/api/client/staff";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserLock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

// Inside EditRoleStaff.tsx
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

const SuspendStaff = ({ staff }: EditRoleStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <UserLock className="w-7 h-7" /> ແກ້ໄຂສິດຢູເຊີ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ປິດການໃຊ້ງານຂອງຢູເຊີ: {staff.name} ຊົ່ວຄວາ
            </DialogTitle>
            <DialogDescription className="font-lao text-left">
              ເປັນການປິດການໃຊ້ງານຢູເຊີນີ້ຊົ່ວຄາວ ບໍ່ແມ່ນການລົບຢູເຊີ
              ຍັງສາມາດແກ້ໄຂກັບໃຫ້ມາໃຊ້ງານໃຫ້ໄດ້ເປັນປົກກະຕິ.
            </DialogDescription>
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
            ປິດການໃຊ້ງານຢູເຊີ: {staff.name} ຊົ່ວຄາວ
          </DrawerTitle>
          <DrawerDescription className="font-lao">
            ເປັນການປິດການໃຊ້ງານຢູເຊີນີ້ຊົ່ວຄາວ ບໍ່ແມ່ນການລົບຢູເຊີ
            ຍັງສາມາດແກ້ໄຂກັບໃຫ້ມາໃຊ້ງານໃຫ້ໄດ້ເປັນປົກກະຕິ.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm staff={staff} setOpen={setOpen} className="px-4" />
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

export default SuspendStaff;

function ProfileForm({
  className,
  staff,
  setOpen,
}: {
  className?: string;
  staff: any;
  setOpen: (open: boolean) => void;
}) {
  const [available, setAvailable] = React.useState(
    staff.available ? "true" : "false"
  );
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string back to boolean for the database
    const booleanAvailable = available === "true";

    // Check if anything actually changed
    if (booleanAvailable === staff.available) {
      toast.info("ບໍ່ມີການປ່ຽນແປງ", {
        description: "ທ່ານຍັງບໍ່ໄດ້ປ່ຽນແປງສະຖານະ",
      });
      return;
    }
    startTransition(async () => {
      try {
        await updateAvailableStaff({ available: booleanAvailable }, staff.id);
        toast.success("ອັບເດດສຳເລັດ");
        router.refresh();
        // If you have setOpen(false) here, call it
      } catch (err) {
        toast.error("ມີບາງຢ່າງຜິດພາດ");
      } finally {
        setOpen(false);
      }
    });
  };

  return (
    <form
      onSubmit={handleUpdateRole}
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
        <Label htmlFor="role" className="font-lao">
          ຕຳແໜ່ງ
        </Label>
        <Input
          id="role"
          defaultValue={
            staff.role ? ROLE_LABELS[staff.role as StaffRole] : staff.role
          }
          disabled
          className="bg-muted font-lao"
        />{" "}
        {/* 2. Controlled Select component */}
        <RadioGroup
          value={available}
          onValueChange={setAvailable}
          className="flex flex-col gap-4 mt-2"
        >
          <div className="flex items-center space-x-2 font-lao text-green-400">
            <RadioGroupItem value="true" id="active" />
            <Label htmlFor="active" className="cursor-pointer ">
              ປົກກະຕິ (Active)
            </Label>
          </div>
          <div className="flex items-center space-x-2 font-lao text-destructive">
            <RadioGroupItem value="false" id="inactive" />
            <Label htmlFor="inactive" className="cursor-pointer">
              ປິດການໃຊ້ງານ (Inactive)
            </Label>
          </div>
        </RadioGroup>
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
