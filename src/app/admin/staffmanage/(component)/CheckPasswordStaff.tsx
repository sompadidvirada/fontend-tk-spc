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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  checkPasswordStaff,
} from "@/app/api/client/staff";
import Image from "next/image";
import { UserSearch } from "lucide-react";

interface EditRoleStaffProps {
  staff: any; 
}

const CheckPasswordStaff = ({ staff }: EditRoleStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [fetching, setFetching] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      const getPass = async () => {
        setFetching(true);
        try {
          const ress = await checkPasswordStaff({ id: staff?.id });
          setPassword(ress.data.data.password);
        } catch (err) {
          toast.error("ບໍ່ສາມາດດຶງຂໍ້ມູນລະຫັດໄດ້");
        } finally {
          setFetching(false);
        }
      };
      getPass();
    }
  }, [open, staff?.id]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="font-lao flex gap-2"
        >
          <UserSearch className="w-7 h-7" />
          ເບີ່ງລະຫັດຢູເຊີ
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-lao text-left">
            ຂໍ້ມູນລະຫັດຜ່ານ: {staff.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-2">
            <Image
              src={staff.image || "/images/proflie.png"}
              alt={staff.name}
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
            <p className="font-lao text-sm text-muted-foreground">
              {staff.name}
            </p>
          </div>

          <div className="grid gap-2">
            <Label className="font-lao">ລະຫັດຜ່ານພະນັກງານ</Label>
            <Input
              value={fetching ? "ກຳລັງໂຫລດ..." : password}
              readOnly
              className={cn(
                "font-mono text-center text-lg tracking-widest",
                fetching && "animate-pulse text-muted-foreground"
              )}
            />
          </div>
        </div>

        <Button onClick={() => setOpen(false)} className="font-lao">
          ປິດໜ້າຕ່າງ
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default CheckPasswordStaff;
