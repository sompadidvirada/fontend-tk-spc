import React, { useState } from "react";
import { Staff_Office } from "./Table";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, UserCog } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMediaQuery } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Branch_type } from "../../tracksell/(component)/ParentTable";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { updateBranchStaff } from "@/app/api/client/staff";

interface EditRoleStaffProps {
  staff: Staff_Office;
  branchs: Branch_type[];
}

const EditBranchStaff = ({ staff, branchs }: EditRoleStaffProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <UserCog className="w-7 h-7" />
      ແກ້ໄຂສາຂາພະນັກງານ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="font-lao text-left">
              ແກ້ໄຂສາຂາທີປະຈຳຂອງ: {staff.name}
            </DialogTitle>
          </DialogHeader>
          <ProfileForm staff={staff} branchs={branchs} setOpen={setOpen} />
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
            ແກ້ໄຂສາຂາທີປະຈຳຂອງ: {staff.name}
          </DrawerTitle>
        </DrawerHeader>
        <ProfileForm
          staff={staff}
          setOpen={setOpen}
          branchs={branchs}
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

export default EditBranchStaff;

function ProfileForm({
  className,
  staff,
  setOpen,
  branchs,
}: {
  className?: string;
  staff: any;
  setOpen: (open: boolean) => void;
  branchs: Branch_type[];
}) {
  const [branchId, setBranchId] = React.useState(staff.branchId);
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();
  const [branchSearchOpen, setBranchSearchOpen] = useState(false);

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (branchId === staff?.branchId) {
      toast.info("ບໍ່ມີການປ່ຽນແປງ", {
        description: "ທ່ານຍັງບໍ່ໄດ້ປ່ຽນແປງຕຳແໜ່ງ",
      });
      return;
    }
    startTransition(async () => {
      try {
        await updateBranchStaff(staff.id, { branchId: branchId });
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
        setBranchId("");
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

      <div className="grid gap-3 font-lao">
        <Label>ສາຂາ</Label>
        <Popover open={branchSearchOpen} onOpenChange={setBranchSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={branchSearchOpen}
              className="w-full justify-between font-lao bg-white"
            >
              {branchId
                ? branchs.find((b) => String(b.id) === String(branchId))
                    ?.name || "ບໍ່ພົບຊື່ສາຂາ"
                : "ເລືອກສາຂາ..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 font-lao" align="start">
            <Command>
              <CommandInput placeholder="ຄົ້ນຫາສາຂາ..." />
              <CommandList>
                <CommandEmpty>ບໍ່ພົບຂໍ້ມູນສາຂາ.</CommandEmpty>
                <CommandGroup>
                  {branchs.map((branch) => (
                    <CommandItem
                      key={branch.id}
                      value={branch.name}
                      onSelect={() => {
                        setBranchId(branch.id.toString());
                        setBranchSearchOpen(false);
                      }}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          branchId === branch.id.toString()
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <div className="flex flex-col">
                        <span>{branch.name}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {branch.province}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
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
