import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FolderUp, RotateCcw, UserRoundPlus } from "lucide-react";
import React from "react";
import { BakeryDetail } from "./TableData";
import { Bakery_sold } from "./ParentTable";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { uploadFileTrackingSell } from "@/app/api/client/trackingbakery";
interface CalendarProp {
  selectedDate: Date | undefined;
  bakerys: BakeryDetail[];
  value: string;
  setCheckBakery: React.Dispatch<React.SetStateAction<Bakery_sold[]>>;
}

const UploadFile = ({
  selectedDate,
  bakerys,
  value,
  setCheckBakery,
}: CalendarProp) => {
  const handleUploadFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!selectedDate || !value) {
      toast.error("ກະລຸນາເລືອກວັນທີ່ ແລະ ສາຂາກ່ອນອັປໂຫລດ");
      event.target.value = ""; // Reset the input
      return;
    }

    // 1. Validation
    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("ຟາຍທີ່ອັປໂຫລດບໍ່ຖືກຕ້ອງ");
      return;
    }

    // 2. Parse HTML
    const htmlText = await file.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    const rows = doc.querySelectorAll("table.list tr");
    const extractedMap = new Map<
      number,
      {
        bakery_detailId: number;
        quantity: number;
        price: number; // Added
        sell_price: number; // Added (total price calculation)
      }
    >();

    const normalize = (str: string) =>
      str.replace(/\s+/g, " ").trim().toLowerCase();

    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 8) {
        const type = cells[7].textContent?.trim() || "";

        if (["BAKERY/CAKE", "BEVERAGES", "SET MENU"].includes(type)) {
          let menu = normalize(cells[2].textContent || "");
          const sellCount = parseInt(cells[3].textContent?.trim() || "0");

          if (isNaN(sellCount) || sellCount <= 0) return;

          // Extract part after "+"
          let lastPart = menu;
          if (menu.includes("+")) {
            const parts = menu.split("+").map((p) => normalize(p));
            lastPart = parts[parts.length - 1];
          }

          // Find product from the 'bakerys' prop
          const matchedProduct = bakerys.find(
            (p) => normalize(p.name) === lastPart,
          );

          if (matchedProduct) {
            const id = matchedProduct.id;
            const unitPrice = matchedProduct.price || 0;
            const unitSellPrice = matchedProduct.sell_price || 0
            if (!extractedMap.has(id)) {
              extractedMap.set(id, {
                bakery_detailId: id,
                quantity: sellCount,
                price: unitPrice,
                sell_price: unitSellPrice
              });
            } else {
              const existing = extractedMap.get(id)!;
              existing.quantity += sellCount;
            }
          }
        }
      }
    });

    // 3. Convert Map to Array for API
    const itemsToUpdate = Array.from(extractedMap.values());

    if (itemsToUpdate.length === 0) {
      toast.error("ບໍ່ພົບຂໍ້ມູນທີ່ກົງກັບລາຍການໃນລະບົບ");
      return;
    }
    const dateTo = selectedDate?.toLocaleDateString("en-CA");
    // 4. Prepare Final Data Object
    const finalPayload = {
      branchId: Number(value),
      date: dateTo,
      items: itemsToUpdate, // This is your bulk array
    };
    try {
      // Logic for API will go here:
      const ress = await uploadFileTrackingSell(finalPayload);
      const dataFromUploadRespone = ress.data.data;
      setCheckBakery(dataFromUploadRespone);
      toast.success(`ອັປໂຫລດຍອດຂາຍ ${itemsToUpdate.length} ລາຍການ ສຳເລັດ!`);
    } catch (err) {
      console.error(err);
      toast.error("ເກີດຂໍ້ຜິດພາດໃນການປະມວນຜົນ");
    } finally {
      event.target.value = ""; // Reset input
    }
  };
  return (
    <div className="flex items-center">
      {/* 1. The actual input is hidden */}
      <input
        type="file"
        id="file-upload"
        accept=".html"
        className="hidden"
        onChange={handleUploadFile}
      />

      {/* 2. The Label is styled to look exactly like your Button */}
      <Button
        asChild // This allows the Button to behave like the Label inside it
        variant="outline"
        className="font-lao h-8 md:h-9 max-w-50 cursor-pointer"
      >
        <label
          htmlFor="file-upload"
          className="flex items-center gap-2 cursor-pointer"
        >
          <FolderUp className="h-4 w-4" />
          ອັປໂຫລດຟາຍ
        </label>
      </Button>
    </div>
  );
};

export default UploadFile;
