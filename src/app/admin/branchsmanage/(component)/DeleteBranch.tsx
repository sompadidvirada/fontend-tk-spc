import { deleteBranch } from "@/app/api/client/branchs";
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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Branch = {
  id: number;
  name: string;
  province: string;
  lat: number;
  lng: number;
};

export function DeleteBranch({ branch }: { branch: Branch }) {
   const router = useRouter()
  const handleDelteBranch =async (id : number) => {
    try {
        await deleteBranch(id)
        toast.success("ລົບເລັດ")
        router.refresh()
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫລັງ.");
    }
  };
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Trash2 />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm font-lao">
          <DialogHeader>
            <DialogTitle>ລົບສາຂາ</DialogTitle>
            <DialogDescription>
              ຕ້ອງການລົບສາຂາ {branch.name} ອອກຈາກລະບົບແທ້ບໍ່??
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ຍົກເລີກ</Button>
            </DialogClose>
            <Button onClick={()=> handleDelteBranch(branch.id)}>ຢືນຢັນ</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
