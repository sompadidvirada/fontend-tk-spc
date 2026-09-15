import { useOrderToTrackSend } from "@/app/api/client/trackingbakery";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircuitBoard, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DataProp {
  date: string;
}

const UseOrderToSend = ({ date }: DataProp) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRun = async () => {
    setLoading(true);
    try {
      const ress = await useOrderToTrackSend({ date: date });
      console.log(ress.data);
      toast.success(ress.data.message)
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("ລອງໃຫ່ມພາຍຫລັງ")
    } finally {
      setLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!date || loading}
          className="font-lao h-8 md:h-9 max-w-50 cursor-pointer self-center"
        >
          <CircuitBoard className="h-4 w-4" />
          Use Manage Order
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="font-lao">
        {loading ? (
          // Loading state
          <div className="flex flex-col items-center justify-center py-8 gap-4">
            <Loader2 className="h-10 w-10 animate-spin" />

            <div className="text-center">
              <h3 className="font-semibold text-lg">ກຳລັງປະມວນຜົນ...</h3>

              <p className="text-sm text-muted-foreground mt-1">
                ກະລຸນາລໍຖ້າ ລະບົບກຳລັງນຳໃຊ້ອໍເດີ
              </p>
            </div>
          </div>
        ) : (
          <>
            <AlertDialogHeader>
              <AlertDialogTitle>
                ຕ້ອງການນຳໃຊ້ອໍເດີສັ່ງ ໃນການອັປໂຫລດເປັນອໍເດີໂຫລດແທ້ບໍ່ ?
              </AlertDialogTitle>

              <AlertDialogDescription>
                ຫລັງຈາກກົດຢືນຢັນແລ້ວ ລະບົບຈະນຳເອົາອໍເດິເບເກີລີ້
                ມາເປັນລາຍການໃນການຈັດສົ່ງເບເກີລີ້,
                ຖ້າຈຳນວນບໍ່ຖືກຕ້ອງຍັງສາມາດເລືອກແກ້ໄຂເປັນລະອຽດແຕ່ລະສາຂາໄດ້
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>ຍົກເລີກ</AlertDialogCancel>

              <AlertDialogAction onClick={handleRun}>ຢືນຢັນ</AlertDialogAction>
            </AlertDialogFooter>
          </>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UseOrderToSend;
