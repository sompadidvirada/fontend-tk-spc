"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { useMediaQuery } from "@/hooks/use-mobile";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Grid2X2Check } from "lucide-react";
import { Bakery_Detail } from "./TableBakery";
import Image from "next/image";
import {
  checkAvailaBleBake,
  UpdateAvailabilityForm,
  updateAvailableBakery,
} from "@/app/api/client/bakery";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";

interface Edit_BakeryProps {
  bakery_selected: Bakery_Detail;
}
interface BranchAvailability {
  id: number;
  name: string;
  province: string;
  status: boolean;
}

const EditStatufSellPerBranch = ({ bakery_selected }: Edit_BakeryProps) => {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [branches, setBranches] = React.useState<BranchAvailability[]>([]);
  const [isPending, startTransition] = React.useTransition();
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  // 2. Function to handle individual switch toggles

  React.useEffect(() => {
    const checkAvailableBakes = async () => {
      setIsLoading(true);
      try {
        const ress = await checkAvailaBleBake(bakery_selected.id);
        setBranches(ress.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false); // End loading
      }
    };
    if (open) {
      checkAvailableBakes();
    }
  }, [open]);

  const handleToggleBranch = (branchId: number) => {
    setBranches((prev) => {
      const nextState = prev.map((b) =>
        b.id === branchId ? { ...b, status: !b.status } : b,
      );
      return nextState;
    });
  };

  // 3. Function to handle the final submission
  const handleSaveAllChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter to get ONLY the IDs that are currently toggled ON
    const enabledIds = branches
      .filter((b) => b.status === true)
      .map((b) => b.id);

    const payload: UpdateAvailabilityForm = {
      bakeryId: bakery_selected.id,
      activeBranchIds: enabledIds,
    };
    startTransition(async () => {
      try {
        await updateAvailableBakery(payload);
        toast.success("ບັນທຶກສຳເລັດ");
        router.refresh();
        setOpen(false);
      } catch (err) {
        toast.error("ມີບາງຢ່າງຜິດພາດ");
      } finally {
        setOpen(false);
      }
    });
  };

  // Trigger element remains the same...
  const trigger = (
    <DropdownMenuItem
      onSelect={(e) => e.preventDefault()}
      className="font-lao flex gap-2"
    >
      <Grid2X2Check className="w-7 h-7" />
      ຈັດການການລົງສິນຄ້າ
    </DropdownMenuItem>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-w-[90vw] w-[90vw] h-[80vh] flex flex-col p-0 overflow-hidden">
          {/* Wrap everything in a form */}
          <form
            onSubmit={handleSaveAllChanges}
            className="flex flex-col h-full"
          >
            {/* 1. Header Section (Remains the same) */}
            <div className="flex gap-4 p-6 border-b bg-muted/20">
              <div className="relative w-24 h-24 shrink-0">
                <Image
                  src={bakery_selected.image || "/images/proflie.png"}
                  alt={bakery_selected.name}
                  fill
                  className="rounded-lg object-cover border shadow-sm"
                />
              </div>
              <div className="flex flex-col justify-center">
                <DialogTitle className="font-lao text-2xl text-primary">
                  ຈັດການສະຖານະການຂາຍ
                </DialogTitle>
                <DialogDescription className="font-lao text-base mt-1">
                  ກຳນົດສາຂາທີ່ອະນຸຍາດໃຫ້ວາງຂາຍເມນູ:{" "}
                  <span className="font-bold text-foreground">
                    {bakery_selected.name}
                  </span>
                </DialogDescription>
              </div>
            </div>

            {/* 2. Scrollable Table Section */}
            <div className="flex-1 overflow-y-auto px-6">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow className="bg-background hover:bg-background">
                    <TableHead className="font-lao w-[100px]">ລຳດັບ</TableHead>
                    <TableHead className="font-lao">ຊື່ສາຂາ</TableHead>
                    <TableHead className="font-lao">ແຂວງ</TableHead>
                    <TableHead className="font-lao text-right">
                      ສະຖານະການຂາຍ
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 font-lao"
                      >
                        ກຳລັງໂຫລດຂໍ້ມູນ...
                      </TableCell>
                    </TableRow>
                  ) : (
                    branches.map((branch, index) => (
                      <TableRow key={branch.id}>
                        <TableCell className="font-medium">
                          {index + 1}
                        </TableCell>
                        <TableCell className="font-lao">
                          {branch.name}
                        </TableCell>
                        <TableCell className="font-lao text-muted-foreground">
                          {branch.province}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-3">
                            <span
                              className={cn(
                                "text-xs font-lao transition-colors",
                                branch.status
                                  ? "text-green-600"
                                  : "text-red-600",
                              )}
                            >
                              {branch.status ? "ເປີດຂາຍ" : "ປິດຂາຍ"}
                            </span>
                            <Switch
                              className="cursor-pointer border-black/30"
                              checked={branch.status}
                              onCheckedChange={() =>
                                handleToggleBranch(branch.id)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* 3. Footer Section */}
            <div className="p-4 border-t bg-muted/10 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="font-lao"
                disabled={isPending}
              >
                ຍົກເລີກ
              </Button>
              <Button
                type="submit"
                className="font-lao px-8"
                disabled={isPending}
              >
                {isPending ? (
                  <Spinner className="h-4 w-4 animate-spin" />
                ) : (
                  "ຢືນຢັນ"
                )}
              </Button>
            </div>
          </form>
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
export default EditStatufSellPerBranch;
