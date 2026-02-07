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
import { useMediaQuery } from "@/hooks/use-mobile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { updateStaffRole } from "@/app/api/client/staff";
import { useRouter } from "next/navigation";
import { UserCog } from "lucide-react";
import { Staff_Office } from "./Table";
import { Spinner } from "@/components/ui/spinner";

interface EditRoleStaffProps {
  staff: Staff_Office;
}

const EditRoleStaff = ({ staff }: EditRoleStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <UserCog className="w-7 h-7" />
      ແກ້ໄຂຕຳແໜ່ງພະນັກງານ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ແກ້ໄຂຕຳແໜ່ງ: {staff.name}
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
            ແກ້ໄຂຕຳແໜ່ງ: {staff.name}
          </DrawerTitle>
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

export default EditRoleStaff;

function ProfileForm({
  className,
  staff,
  setOpen,
}: {
  className?: string;
  staff: any;
  setOpen: (open: boolean) => void;
}) {
  const [role, setRole] = React.useState(staff.role);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === staff?.role) {
      toast.info("ບໍ່ມີການປ່ຽນແປງ", {
        description: "ທ່ານຍັງບໍ່ໄດ້ປ່ຽນແປງຕຳແໜ່ງ",
      });
      return;
    }
    startTransition(async () => {
      try {
        await updateStaffRole({ role }, staff.id);
        toast.success("ອັບເດດສຳເລັດ", {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        });
        router.refresh();
        setOpen(false);
      } catch (err) {
        console.log(err);
        toast.success("ມີບາງຢ່າງຜິດພາດ", {
          cancel: {
            label: "x",
            onClick: () => console.log("Cancel!"),
          },
        });
      } finally {
        setOpen(false);
        setRole("");
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
          ຊື່ພະນັກງານ
        </Label>
        <Input
          id="name"
          defaultValue={staff.name}
          disabled
          className="bg-muted"
        />
      </div>

      <div className="grid gap-3">
        <Label htmlFor="role" className="font-lao">
          ຕຳແໜ່ງ
        </Label>
        {/* 2. Controlled Select component */}
        <Select onValueChange={setRole} value={role}>
          <SelectTrigger className="border-slate-200 w-full font-lao">
            <SelectValue placeholder="ເລືອກຕຳແໜ່ງ" />
          </SelectTrigger>
          <SelectContent className="font-lao">
            <SelectItem value="ADMIN" className="cursor-pointer">
              ແອັດມິນ
            </SelectItem>
            <SelectItem value="STAFF_SPC">ພະນັກງານຈັດຊື້</SelectItem>
            <SelectItem value="STAFF_TK">ພະນັກງານທຮີຄອຟ</SelectItem>
            <SelectItem value="STAFF_WH">ພະນັກງານສາງ</SelectItem>
            <SelectItem value="BARISTAR">ບາເລສຕ້າ</SelectItem>
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
